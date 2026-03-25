# Stage 1: PHP deps for production (no dev)
FROM composer:2 AS composer-prod

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# Stage 2: PHP deps including dev (needed for wayfinder:generate during build)
FROM composer:2 AS composer-dev

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# Stage 3: Build frontend assets (needs PHP + dev deps for wayfinder:generate)
FROM node:22-alpine AS frontend

RUN apk add --no-cache \
    php84-cli php84-phar php84-mbstring php84-tokenizer \
    php84-xml php84-xmlwriter php84-simplexml php84-dom \
    php84-openssl php84-fileinfo php84-iconv php84-ctype php84-json

RUN ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY --from=composer-dev /app/vendor vendor/
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY app/ app/
COPY database/ database/
COPY resources/ resources/
COPY vite.config.ts tsconfig.json ./
COPY public/ public/

# Create minimal .env so Laravel can boot for wayfinder:generate
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache database \
    && printf "APP_NAME=Laravel\nAPP_ENV=local\nAPP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\nAPP_DEBUG=false\nDB_CONNECTION=sqlite\nDB_DATABASE=/app/database/database.sqlite\n" > .env \
    && touch database/database.sqlite

RUN php artisan wayfinder:generate --with-form
RUN npm run build

# Stage 4: Production image
FROM php:8.4-fpm-alpine AS production

RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    sqlite-dev \
    libpng \
    libpng-dev \
    libjpeg-turbo \
    libjpeg-turbo-dev \
    freetype \
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
COPY --chown=www-data:www-data --from=composer-prod /app/vendor vendor/

# Set storage permissions and clear cached bootstrap files (may reference dev packages)
RUN rm -f bootstrap/cache/packages.php bootstrap/cache/services.php \
    && mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Create SQLite database file
RUN touch database/database.sqlite && chown www-data:www-data database/database.sqlite

EXPOSE 80

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
