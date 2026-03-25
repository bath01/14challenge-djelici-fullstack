# Stage 1: Install PHP dependencies
FROM composer:2 AS composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# Stage 2: Build frontend assets (needs PHP for wayfinder:generate)
FROM node:22-alpine AS frontend

RUN apk add --no-cache php84-cli php84-phar php84-mbstring php84-tokenizer php84-xml php84-xmlwriter php84-simplexml php84-dom

RUN ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY --from=composer /app/vendor vendor/
COPY artisan bootstrap/ config/ routes/ app/ database/ ./

COPY resources/ resources/
COPY vite.config.ts tsconfig.json ./
COPY public/ public/

RUN npm run build

# Stage 3: Production image
FROM php:8.4-fpm-alpine AS production

RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    sqlite-dev \
    libpng \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_sqlite \
        gd \
        opcache \
        pcntl \
        bcmath \
    && apk del libpng-dev libjpeg-turbo-dev freetype-dev sqlite-dev \
    && rm -rf /var/cache/apk/*

COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .

COPY --chown=www-data:www-data --from=frontend /app/public/build public/build

COPY --chown=www-data:www-data --from=composer /app/vendor vendor/

# Set storage permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Create SQLite database file if it doesn't exist
RUN touch database/database.sqlite && chown www-data:www-data database/database.sqlite

EXPOSE 80

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
