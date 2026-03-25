import Card from '@/components/dashboard/Card';
import ChartTitle from '@/components/dashboard/ChartTitle';
import CustomTooltip from '@/components/dashboard/CustomTooltip';
import StatCard from '@/components/dashboard/StatCard';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { PieChart as PieChartLucide, Shield, ShieldCheck, TrendingUp } from 'lucide-react';
import { BLUE, fmt, GOLD, GREEN, ORANGE, PALETTE, TEAL } from './constants';
import type { MilitaryRow } from './types';

interface Props {
    military: MilitaryRow[];
}

function parsePct(value: string): number {
    return parseFloat(value.replace(',', '.').replace('%', '').trim());
}

export default function SecuriteSection({ military }: Props) {
    const evolutionData = useMemo(() => {
        const map: Record<number, { annee: number; Hommes: number; Femmes: number }> = {};
        military
            .filter((r) => r.categorie === 'Effectif de Policiers' && r.effectif !== null)
            .forEach((r) => {
                if (!map[r.annee]) map[r.annee] = { annee: r.annee, Hommes: 0, Femmes: 0 };
                const key = r.genre === 'Homme' ? 'Hommes' : 'Femmes';
                map[r.annee][key] = r.effectif ?? 0;
            });
        return Object.values(map).sort((a, b) => a.annee - b.annee);
    }, [military]);

    const cat2020 = useMemo(
        () => military.filter((r) => r.annee === 2020 && r.categorie !== 'Effectif de Policiers' && r.pourcentage !== ''),
        [military],
    );

    const pieHommes = useMemo(
        () =>
            cat2020
                .filter((r) => r.genre === 'Homme')
                .map((r) => ({ name: r.categorie, value: parsePct(r.pourcentage) }))
                .filter((r) => !isNaN(r.value)),
        [cat2020],
    );

    const pieFemmes = useMemo(
        () =>
            cat2020
                .filter((r) => r.genre === 'Femme')
                .map((r) => ({ name: r.categorie, value: parsePct(r.pourcentage) }))
                .filter((r) => !isNaN(r.value)),
        [cat2020],
    );

    const latest = evolutionData[evolutionData.length - 1];
    const totalPolice = (latest?.Hommes ?? 0) + (latest?.Femmes ?? 0);
    const pctFemmes = totalPolice > 0 ? ((latest?.Femmes ?? 0) / totalPolice) * 100 : 0;
    const growthFemmes =
        evolutionData[0]?.Femmes > 0
            ? (((latest?.Femmes ?? 0) - evolutionData[0].Femmes) / evolutionData[0].Femmes) * 100
            : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon={Shield} label="Total policiers (2020)" value={fmt(totalPolice)} sub="Effectif total" color={ORANGE} />
                <StatCard
                    icon={ShieldCheck}
                    label="Policières femmes"
                    value={fmt(latest?.Femmes ?? 0)}
                    sub="Effectif féminin"
                    color={TEAL}
                />
                <StatCard
                    icon={PieChartLucide}
                    label="Part des femmes"
                    value={`${pctFemmes.toFixed(1)}%`}
                    sub="Police nationale"
                    color={GREEN}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Croissance féminine"
                    value={`+${growthFemmes.toFixed(0)}%`}
                    sub="Depuis 2011"
                    color={GOLD}
                />
            </div>

            <Card>
                <ChartTitle>Évolution de l'effectif des policiers (2011–2020)</ChartTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={evolutionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={60} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="Hommes" fill={BLUE} radius={[3, 3, 0, 0]} stackId="a" />
                        <Bar dataKey="Femmes" fill={TEAL} radius={[3, 3, 0, 0]} stackId="a" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <ChartTitle>Répartition par grade — Hommes (2020, %)</ChartTitle>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieHommes}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {pieHommes.map((_, i) => (
                                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <ChartTitle>Répartition par grade — Femmes (2020, %)</ChartTitle>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieFemmes}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {pieFemmes.map((_, i) => (
                                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card>
                <ChartTitle>Taux de féminisation par grade — Police Nationale (2020)</ChartTitle>
                <div className="space-y-4">
                    {pieFemmes.map((cat, i) => {
                        const hommePct = pieHommes.find((h) => h.name === cat.name)?.value ?? 0;
                        return (
                            <div key={i}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="font-medium text-stone-700">{cat.name}</span>
                                    <span className="font-semibold" style={{ color: TEAL }}>
                                        {cat.value}% femmes
                                    </span>
                                </div>
                                <div className="flex h-4 overflow-hidden rounded-full bg-stone-100">
                                    <div style={{ width: `${hommePct}%`, background: BLUE }} />
                                    <div style={{ width: `${cat.value}%`, background: TEAL }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 flex items-center gap-6 text-xs text-stone-500">
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm" style={{ background: BLUE }} /> Hommes
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm" style={{ background: TEAL }} /> Femmes
                    </span>
                </div>
            </Card>
        </div>
    );
}
