import Card from '@/components/dashboard/Card';
import ChartTitle from '@/components/dashboard/ChartTitle';
import CustomTooltip from '@/components/dashboard/CustomTooltip';
import StatCard from '@/components/dashboard/StatCard';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Calendar, Landmark, MapPin, Trophy, Users, Wrench } from 'lucide-react';
import { BLUE, fmt, GOLD, GREEN, ORANGE, PALETTE } from './constants';
import type { StadiumRow } from './types';

interface Props {
    stadiums: StadiumRow[];
}

export default function SportSection({ stadiums }: Props) {
    const totalCapacity = stadiums.reduce((s, st) => s + st.capacite, 0);
    const maxCap = Math.max(...stadiums.map((s) => s.capacite));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon={Landmark} label="Stades CAN 2023" value={`${stadiums.length}`} sub="Côte d'Ivoire" color={ORANGE} />
                <StatCard icon={Users} label="Capacité totale" value={fmt(totalCapacity)} sub="Tous stades" color={GREEN} />
                <StatCard icon={Trophy} label="Plus grand stade" value={fmt(maxCap)} sub="Stade Olympique" color={GOLD} />
                <StatCard
                    icon={MapPin}
                    label="Villes hôtes"
                    value={`${new Set(stadiums.map((s) => s.ville)).size}`}
                    sub="Régions du pays"
                    color={BLUE}
                />
            </div>

            <Card>
                <ChartTitle>Capacité des stades CAN 2023</ChartTitle>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={stadiums.map((s) => ({
                            nom: s.nom.split(' ').slice(0, 3).join(' '),
                            capacite: s.capacite,
                        }))}
                        margin={{ top: 5, right: 20, left: 10, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="nom" tick={{ fontSize: 9, angle: -25, textAnchor: 'end' }} interval={0} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="capacite" name="Capacité" radius={[6, 6, 0, 0]}>
                            {stadiums.map((_, i) => (
                                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {stadiums.map((st, i) => (
                    <div
                        key={i}
                        className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100 transition-shadow hover:shadow-md dark:bg-stone-900 dark:ring-stone-800"
                    >
                        {st.photos && (
                            <div className="h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                                <img
                                    src={st.photos}
                                    alt={st.nom}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold leading-tight text-stone-800 dark:text-stone-100">{st.nom}</h4>
                                <span
                                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                                    style={{ background: PALETTE[i % PALETTE.length] }}
                                >
                                    {fmt(st.capacite)}
                                </span>
                            </div>
                            <div className="mb-3 flex flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400">
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} className="shrink-0" />
                                    <span className="font-medium text-stone-700 dark:text-stone-300">{st.ville}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={11} className="shrink-0" /> Ouvert en {st.ouverture}
                                </span>
                                {st.renovation && (
                                    <span className="flex items-center gap-1">
                                        <Wrench size={11} className="shrink-0" /> Rénové en {st.renovation}
                                    </span>
                                )}
                            </div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <span className="text-stone-500 dark:text-stone-400">Capacité</span>
                                <span className="font-semibold text-stone-700 dark:text-stone-300">
                                    {st.capacite.toLocaleString('fr-FR')} places
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-700">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${(st.capacite / maxCap) * 100}%`,
                                        background: PALETTE[i % PALETTE.length],
                                    }}
                                />
                            </div>
                            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                {st.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
