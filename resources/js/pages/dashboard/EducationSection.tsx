import Card from '@/components/dashboard/Card';
import ChartTitle from '@/components/dashboard/ChartTitle';
import CustomTooltip from '@/components/dashboard/CustomTooltip';
import FilterSelect from '@/components/dashboard/FilterSelect';
import StatCard from '@/components/dashboard/StatCard';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { BLUE, fmt, GOLD, GREEN, ORANGE, TEAL } from './constants';
import type { EducationPeriodRow, EducationRegionRow, TeacherRow } from './types';

interface Props {
    teachers: TeacherRow[];
    byRegion: EducationRegionRow[];
    byPeriod: EducationPeriodRow[];
}

export default function EducationSection({ teachers, byRegion, byPeriod }: Props) {
    const [statut, setStatut] = useState('PUBLIC');
    const [periode, setPeriode] = useState('2018-2019');

    const periodes = useMemo(() => [...new Set(byPeriod.map((r) => r.periode))].sort(), [byPeriod]);
    const statuts = useMemo(() => [...new Set(byPeriod.map((r) => r.statut))], [byPeriod]);

    const teachersData = useMemo(() => {
        const map: Record<string, { discipline: string; Femmes: number; Hommes: number }> = {};
        teachers
            .filter((r) => r.enseignement === 'Public')
            .forEach((r) => {
                if (!map[r.discipline]) map[r.discipline] = { discipline: r.discipline, Femmes: 0, Hommes: 0 };
                map[r.discipline][r.genre as 'Femmes' | 'Hommes'] = r.effectif;
            });
        return Object.values(map).sort((a, b) => b.Femmes + b.Hommes - (a.Femmes + a.Hommes));
    }, [teachers]);

    const totalTeachers = teachersData.reduce((s, r) => s + r.Femmes + r.Hommes, 0);
    const totalFemmes = teachersData.reduce((s, r) => s + r.Femmes, 0);

    const regionData = useMemo(() => {
        const map: Record<string, { dren: string; Filles: number; Garçons: number }> = {};
        byRegion.forEach((r) => {
            if (!map[r.dren]) map[r.dren] = { dren: r.dren, Filles: 0, Garçons: 0 };
            if (r.genre === 'Filles') map[r.dren]['Filles'] = r.effectif;
            else map[r.dren]['Garçons'] = r.effectif;
        });
        return Object.values(map)
            .sort((a, b) => b.Filles + b.Garçons - (a.Filles + a.Garçons))
            .slice(0, 12);
    }, [byRegion]);

    const totalEleves = regionData.reduce((s, r) => s + r.Filles + r.Garçons, 0);

    const periodData = useMemo(() => {
        const map: Record<string, { ville: string; Masculin: number; Feminin: number }> = {};
        byPeriod
            .filter((r) => r.periode === periode && r.statut === statut)
            .forEach((r) => {
                if (!map[r.ville]) map[r.ville] = { ville: r.ville, Masculin: 0, Feminin: 0 };
                if (r.sexe === 'MASCULIN') map[r.ville]['Masculin'] += r.effectif;
                else map[r.ville]['Feminin'] += r.effectif;
            });
        return Object.values(map)
            .sort((a, b) => b.Masculin + b.Feminin - (a.Masculin + a.Feminin))
            .slice(0, 12);
    }, [byPeriod, periode, statut]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    icon="👩‍🏫"
                    label="Total enseignants (Public)"
                    value={fmt(totalTeachers)}
                    sub="Secteur public"
                    color={ORANGE}
                />
                <StatCard
                    icon="♀️"
                    label="Part des femmes enseignantes"
                    value={`${((totalFemmes / totalTeachers) * 100).toFixed(0)}%`}
                    sub="Enseignement public"
                    color={TEAL}
                />
                <StatCard
                    icon="📚"
                    label="Élèves (primaire, 12 DREN)"
                    value={fmt(totalEleves)}
                    sub="Top 12 régions"
                    color={GREEN}
                />
                <StatCard
                    icon="🏫"
                    label="Disciplines enseignées"
                    value={`${teachersData.length}`}
                    sub="Éducation publique"
                    color={GOLD}
                />
            </div>

            <Card>
                <ChartTitle>Enseignants par discipline — Secteur Public (Femmes vs Hommes)</ChartTitle>
                <ResponsiveContainer width="100%" height={380}>
                    <BarChart layout="vertical" data={teachersData} margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="discipline" tick={{ fontSize: 11 }} width={105} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="Femmes" stackId="a" fill={TEAL} />
                        <Bar dataKey="Hommes" stackId="a" fill={BLUE} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <ChartTitle>Élèves dans le primaire par région (Filles vs Garçons) — Top 12 DREN</ChartTitle>
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={regionData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="dren" tick={{ fontSize: 10, angle: -35, textAnchor: 'end' }} interval={0} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="Filles" fill={TEAL} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Garçons" fill={BLUE} radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <ChartTitle>Répartition des élèves par ville et période</ChartTitle>
                    <div className="flex flex-wrap gap-3">
                        <FilterSelect
                            label="Période :"
                            value={periode}
                            onChange={setPeriode}
                            options={periodes.map((p) => ({ value: p, label: p }))}
                        />
                        <FilterSelect
                            label="Statut :"
                            value={statut}
                            onChange={setStatut}
                            options={statuts.map((s) => ({ value: s, label: s }))}
                        />
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={periodData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="ville" tick={{ fontSize: 10, angle: -35, textAnchor: 'end' }} interval={0} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="Masculin" fill={BLUE} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Feminin" fill={TEAL} radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
