import Card from '@/components/dashboard/Card';
import ChartTitle from '@/components/dashboard/ChartTitle';
import CustomTooltip from '@/components/dashboard/CustomTooltip';
import FilterSelect from '@/components/dashboard/FilterSelect';
import StatCard from '@/components/dashboard/StatCard';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Building, Globe, Home, TrendingUp } from 'lucide-react';
import { BLUE, fmt, GOLD, GREEN, KEY_INDICATORS, ORANGE } from './constants';
import type { PopulationRow, WorldBankEntry } from './types';

interface Props {
    population: PopulationRow[];
    worldBank: Record<string, WorldBankEntry[]>;
}

export default function EconomieSection({ population, worldBank }: Props) {
    const availableIndicators = KEY_INDICATORS.filter((k) => worldBank[k]);
    const [indicator, setIndicator] = useState(availableIndicators[0] ?? Object.keys(worldBank)[0] ?? '');

    const latestPop = population[population.length - 1];
    const indicatorData = worldBank[indicator] ?? [];
    const latestIndicator = indicatorData[indicatorData.length - 1];
    const gdpData = worldBank['Croissance du PIB (% annuel)'] ?? [];
    const latestGdp = gdpData[gdpData.length - 1];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    icon={Building}
                    label="Population Abidjan (2021)"
                    value={fmt(latestPop?.abidjan ?? 0)}
                    sub="Recensement RGPH"
                    color={ORANGE}
                />
                <StatCard
                    icon={Home}
                    label="Population Bouaké (2021)"
                    value={fmt(latestPop?.bouake ?? 0)}
                    sub="Recensement RGPH"
                    color={GREEN}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Croissance PIB"
                    value={`${latestGdp?.valeur?.toFixed(1) ?? '—'}%`}
                    sub={`En ${latestGdp?.annee ?? ''}`}
                    color={GOLD}
                />
                <StatCard
                    icon={Globe}
                    label="Indicateurs BM"
                    value={`${Object.keys(worldBank).length}`}
                    sub="Banque Mondiale"
                    color={BLUE}
                />
            </div>

            <Card>
                <ChartTitle>Évolution de la population — Abidjan & Bouaké (1975–2021)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={population} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="gradAbidjan" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={ORANGE} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={ORANGE} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradBouake" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="abidjan"
                            name="Abidjan"
                            stroke={ORANGE}
                            fill="url(#gradAbidjan)"
                            strokeWidth={2.5}
                            dot={{ r: 5, fill: ORANGE }}
                        />
                        <Area
                            type="monotone"
                            dataKey="bouake"
                            name="Bouaké"
                            stroke={GREEN}
                            fill="url(#gradBouake)"
                            strokeWidth={2.5}
                            dot={{ r: 5, fill: GREEN }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <ChartTitle>Indicateur Banque Mondiale</ChartTitle>
                    <FilterSelect
                        value={indicator}
                        onChange={setIndicator}
                        options={availableIndicators.map((k) => ({
                            value: k,
                            label: k.length > 60 ? k.slice(0, 60) + '…' : k,
                        }))}
                        label="Indicateur :"
                    />
                </div>
                <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: ORANGE }}>
                        {latestIndicator?.valeur?.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) ?? '—'}
                    </span>
                    <span className="text-sm text-stone-500">en {latestIndicator?.annee}</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={indicatorData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="valeur"
                            name={indicator.length > 35 ? indicator.slice(0, 35) + '…' : indicator}
                            stroke={ORANGE}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
