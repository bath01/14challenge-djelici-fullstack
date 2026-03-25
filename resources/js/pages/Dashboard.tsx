import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { TABS, type TabId } from './dashboard/constants';
import EconomieSection from './dashboard/EconomieSection';
import EducationSection from './dashboard/EducationSection';
import SanteSection from './dashboard/SanteSection';
import SecuriteSection from './dashboard/SecuriteSection';
import SportSection from './dashboard/SportSection';
import type { DashboardProps } from './dashboard/types';

export default function Dashboard({ economie, education, sante, securite, sport }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<TabId>('economie');

    return (
        <>
            <Head title="Djelici" />

            <div className="min-h-screen bg-[#FFF8F0]">
                <header className="relative overflow-hidden bg-[#F77F00]">
                    <div className="absolute inset-0 flex">
                        <div className="w-1/3 bg-[#F77F00]" />
                        <div className="w-1/3 bg-white/15" />
                        <div className="w-1/3 bg-[#009A44]/60" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-5">
                            <div className="hidden h-12 w-8 shrink-0 overflow-hidden rounded shadow-lg sm:flex">
                                <div className="flex-1 bg-[#F77F00]" />
                                <div className="flex-1 bg-white" />
                                <div className="flex-1 bg-[#009A44]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                    Djelici
                                </h1>
                                <p className="mt-0.5 text-sm font-medium text-orange-100">
                                    Côte d'Ivoire — Données statistiques nationales
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="sticky top-0 z-10 border-b border-orange-100 bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex overflow-x-auto">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'border-[#F77F00] text-[#F77F00]'
                                            : 'border-transparent text-stone-500 hover:border-orange-200 hover:text-stone-700'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {activeTab === 'economie' && (
                        <EconomieSection population={economie.population} worldBank={economie.worldBank} />
                    )}
                    {activeTab === 'education' && (
                        <EducationSection
                            teachers={education.teachers}
                            byRegion={education.byRegion}
                            byPeriod={education.byPeriod}
                        />
                    )}
                    {activeTab === 'sante' && (
                        <SanteSection
                            covid={sante.covid}
                            accidents={sante.accidents}
                            accidentsByType={sante.accidentsByType}
                            hivCoverage={sante.hivCoverage}
                        />
                    )}
                    {activeTab === 'securite' && <SecuriteSection military={securite.military} />}
                    {activeTab === 'sport' && <SportSection stadiums={sport.stadiums} />}
                </main>

                <footer className="mt-8 border-t border-orange-100 bg-white py-6">
                    <div className="mx-auto max-w-7xl px-4 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
                        <p>
                            CHALLENGE 14-14-14 // JOUR 10 // MARS 2026
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
