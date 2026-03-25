import { Head, Link } from '@inertiajs/react';

const TEAM = [
    {
        initials: 'BD',
        name: 'Bath Dorgeles',
        role: 'Chef de projet',
        color: '#F77F00',
    },
    {
        initials: 'OM',
        name: 'Oclin Marcel',
        role: 'Développeur Frontend',
        color: '#009A44',
    },
    {
        initials: 'RI',
        name: 'Rayane Irie',
        role: 'Développeur Full-Stack',
        color: '#C8A84B',
    }
];

const STACK = [
    {
        category: 'Backend',
        color: '#F77F00',
        items: [
            { name: 'Laravel 13', desc: 'Framework PHP — routing, controllers, parsing CSV' },
            { name: 'PHP 8.4', desc: 'Langage serveur avec constructor promotion & arrow functions' },
            { name: 'Inertia.js v2', desc: 'Pont SPA sans API REST — props typées du serveur au client' },
        ],
    },
    {
        category: 'Frontend',
        color: '#009A44',
        items: [
            { name: 'React 19', desc: 'Composants UI déclaratifs avec hooks' },
            { name: 'TypeScript', desc: 'Typage statique sur toutes les interfaces et props' },
            { name: 'Tailwind CSS v4', desc: 'Utilitaires CSS — thème Côte d\'Ivoire personnalisé' },
            { name: 'Recharts', desc: 'Graphiques SVG réactifs : AreaChart, BarChart, PieChart…' },
        ],
    },
    {
        category: 'Tooling',
        color: '#C8A84B',
        items: [
            { name: 'Vite 8', desc: 'Bundler ultra-rapide avec code-splitting par section' },
            { name: 'Laravel Wayfinder', desc: 'Routes TypeScript générées automatiquement' },
            { name: 'Pest 4', desc: 'Framework de tests PHP expressif' },
            { name: 'Laravel Pint', desc: 'Formateur de code PHP conforme aux standards PSR' },
        ],
    },
    {
        category: 'Données',
        color: '#2196F3',
        items: [
            { name: 'RGPH', desc: 'Recensements Généraux de la Population et de l\'Habitat' },
            { name: 'Banque Mondiale', desc: '48 indicateurs économiques et sociaux (1960–2020)' },
            { name: 'OMS / Our World in Data', desc: 'Données COVID-19 et couverture ARV CEDEAO' },
            { name: 'INS Côte d\'Ivoire', desc: 'Éducation, sécurité, transport et sport' },
        ],
    },
];

export default function About() {
    return (
        <>
            <Head title="À propos — Djelici">
            </Head>

            <div className="min-h-screen bg-[#FFF8F0]">
                {/* Header */}
                <header className="relative overflow-hidden bg-[#F77F00]">
                    <div className="absolute inset-0 flex">
                        <div className="w-1/3 bg-[#F77F00]" />
                        <div className="w-1/3 bg-white/15" />
                        <div className="w-1/3 bg-[#009A44]/60" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="hidden h-10 w-7 shrink-0 overflow-hidden rounded shadow-lg sm:flex">
                                    <div className="flex-1 bg-[#F77F00]" />
                                    <div className="flex-1 bg-white" />
                                    <div className="flex-1 bg-[#009A44]" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                                        Djelici — À propos
                                    </h1>
                                    <p className="text-xs font-medium text-orange-100">
                                        Côte d'Ivoire — Données statistiques nationales
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/"
                                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                            >
                                ← Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Project description */}
                    <section className="mb-16">
                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-orange-100 md:p-12">
                            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                                <div className="shrink-0">
                                    <div className="flex h-20 w-14 overflow-hidden rounded-2xl shadow-xl">
                                        <div className="flex-1 bg-[#F77F00]" />
                                        <div className="flex-1 bg-white" />
                                        <div className="flex-1 bg-[#009A44]" />
                                    </div>
                                </div>
                                <div>
                                    <span className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                                        Challenge 14-14-14 · Jour 10 · Mars 2026
                                    </span>
                                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-stone-900">
                                        Djelici
                                    </h2>
                                    <p className="mb-4 max-w-2xl text-base leading-relaxed text-stone-600">
                                        <strong className="text-stone-800">Djelici</strong> est un tableau de bord analytique
                                        dédié à la <strong className="text-[#F77F00]">Côte d'Ivoire</strong>. Il centralise et
                                        visualise des données statistiques nationales issues de sources officielles notamment le portail Open Data national 
                                        (<a href='https://data.gouv.ci' className="text-[#F77F00]" target="_blank">data.gouv.ci</a>) couvrant
                                        l'économie, l'éducation, la santé, la sécurité et le sport.
                                    </p>
                                    <p className="max-w-2xl text-base leading-relaxed text-stone-600">
                                        L'application repose sur des jeux de données pré-enregistrés (CSV, GeoJSON) parsés
                                        côté serveur et transmis au client via Inertia.js, sans base de données ni API
                                        externe. Elle offre des filtres dynamiques et des graphiques interactifs adaptés à
                                        chaque type de donnée.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team */}
                    <section className="mb-16">
                        <h2 className="mb-2 text-2xl font-bold text-stone-900">L'équipe</h2>
                        <p className="mb-8 text-sm text-stone-500">Les membres ayant contribué à la réalisation du projet.</p>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {TEAM.map((member, i) => (
                                <div
                                    key={i}
                                    className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-orange-100 transition hover:shadow-md"
                                >
                                    <div
                                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow-sm"
                                        style={{ background: member.color }}
                                    >
                                        {member.initials}
                                    </div>
                                    <h3 className="mb-0.5 font-bold text-stone-800">{member.name}</h3>
                                    <p className="mb-3 text-xs font-semibold" style={{ color: member.color }}>
                                        {member.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tech stack */}
                    <section>
                        <h2 className="mb-2 text-2xl font-bold text-stone-900">Stack technique</h2>
                        <p className="mb-8 text-sm text-stone-500">Technologies et sources de données utilisées dans le projet.</p>
                        <div className="grid gap-6 md:grid-cols-2">
                            {STACK.map((group, i) => (
                                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
                                    <div className="mb-4 flex items-center gap-3">
                                        <span
                                            className="h-1 w-8 rounded-full"
                                            style={{ background: group.color }}
                                        />
                                        <h3 className="font-bold text-stone-800">{group.category}</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {group.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <span
                                                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                                    style={{ background: group.color }}
                                                />
                                                <div>
                                                    <span className="text-sm font-semibold text-stone-700">
                                                        {item.name}
                                                    </span>
                                                    <span className="mx-2 text-stone-300">·</span>
                                                    <span className="text-xs text-stone-500">{item.desc}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="mt-12 border-t border-orange-100 bg-white py-6">
                    <div className="mx-auto max-w-7xl px-4 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
                        <p>CHALLENGE 14-14-14 // JOUR 10 // MARS 2026</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
