import Card from '@/components/dashboard/Card';
import ChartTitle from '@/components/dashboard/ChartTitle';
import CustomTooltip from '@/components/dashboard/CustomTooltip';
import FilterSelect from '@/components/dashboard/FilterSelect';
import StatCard from '@/components/dashboard/StatCard';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { fmt, GREEN, ORANGE, PALETTE, RED } from './constants';
import type { AccidentRow, AccidentTypeRow, CovidRow, HivRow } from './types';

interface Props {
    covid: CovidRow[];
    accidents: AccidentRow[];
    accidentsByType: AccidentTypeRow[];
    hivCoverage: Record<string, HivRow[]>;
}

const COVID_METRICS = [
    { value: 'totalCas', label: 'Cas totaux' },
    { value: 'nouveauxCas', label: 'Nouveaux cas' },
    { value: 'totalDeces', label: 'Décès totaux' },
    { value: 'nouveauxDeces', label: 'Nouveaux décès' },
    { value: 'totalVaccines', label: 'Vaccinations totales' },
    { value: 'personnesVaccinees', label: 'Personnes vaccinées' },
] as const;

type CovidMetric = (typeof COVID_METRICS)[number]['value'];

export default function SanteSection({ covid, accidents, accidentsByType, hivCoverage }: Props) {
    const [covidMetric, setCovidMetric] = useState<CovidMetric>('totalCas');
    const [accidentStatut, setAccidentStatut] = useState('ACCIDENTS');
    const [hivCountry, setHivCountry] = useState("Cote d'Ivoire");

    const covidFiltered = useMemo(
        () => covid.filter((r) => Number(r[covidMetric]) > 0),
        [covid, covidMetric],
    );

    const latestCovid = covid[covid.length - 1];
    const latestAccident = accidents[accidents.length - 1];

    const accidentTypeData = useMemo(() => {
        const map: Record<string, { annee: string; [lieu: string]: number | string }> = {};
        accidentsByType
            .filter((r) => r.statut === accidentStatut)
            .forEach((r) => {
                const key = String(r.annee);
                if (!map[key]) map[key] = { annee: key };
                map[key][r.lieu] = r.valeur;
            });
        return Object.values(map);
    }, [accidentsByType, accidentStatut]);

    const lieux = useMemo(() => [...new Set(accidentsByType.map((r) => r.lieu))], [accidentsByType]);
    const statuts = useMemo(() => [...new Set(accidentsByType.map((r) => r.statut))], [accidentsByType]);
    const hivCountries = Object.keys(hivCoverage).sort();
    const hivData = hivCoverage[hivCountry] ?? [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    icon="🦠"
                    label="Cas COVID totaux"
                    value={fmt(latestCovid?.totalCas ?? 0)}
                    sub="Côte d'Ivoire"
                    color={RED}
                />
                <StatCard
                    icon="💀"
                    label="Décès COVID"
                    value={fmt(latestCovid?.totalDeces ?? 0)}
                    sub={latestCovid?.date}
                    color="#B71C1C"
                />
                <StatCard
                    icon="💉"
                    label="Personnes vaccinées"
                    value={fmt(latestCovid?.personnesVaccinees ?? 0)}
                    sub="Total cumulé"
                    color={GREEN}
                />
                <StatCard
                    icon="🚗"
                    label="Accidents de route (2020)"
                    value={fmt(latestAccident?.effectif ?? 0)}
                    sub="Évolution 2000–2020"
                    color={ORANGE}
                />
            </div>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <ChartTitle>COVID-19 en Côte d'Ivoire</ChartTitle>
                    <FilterSelect
                        label="Métrique :"
                        value={covidMetric}
                        onChange={(v) => setCovidMetric(v as CovidMetric)}
                        options={COVID_METRICS.map((m) => ({ value: m.value, label: m.label }))}
                    />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={covidFiltered} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="gradCovid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={RED} stopOpacity={0.25} />
                                <stop offset="95%" stopColor={RED} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(d: string) => d.slice(0, 7)}
                            interval={Math.floor(covidFiltered.length / 10)}
                        />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={covidMetric}
                            name={COVID_METRICS.find((m) => m.value === covidMetric)?.label ?? covidMetric}
                            stroke={RED}
                            fill="url(#gradCovid)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <ChartTitle>Évolution des accidents de la route (2000–2020)</ChartTitle>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={accidents} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="effectif" name="Accidents" fill={ORANGE} radius={[4, 4, 0, 0]}>
                            {accidents.map((_, i) => (
                                <Cell key={i} fill={`hsl(${30 + i * 2}, 90%, ${45 + i * 0.5}%)`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <ChartTitle>Accidents corporels 2007–2009 par lieu</ChartTitle>
                    <FilterSelect
                        label="Indicateur :"
                        value={accidentStatut}
                        onChange={setAccidentStatut}
                        options={statuts.map((s) => ({ value: s, label: s }))}
                    />
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={accidentTypeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {lieux.map((lieu, i) => (
                            <Bar key={lieu} dataKey={lieu} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <ChartTitle>Couverture ARV femmes enceintes VIH+ — Pays CEDEAO</ChartTitle>
                    <FilterSelect
                        label="Pays :"
                        value={hivCountry}
                        onChange={setHivCountry}
                        options={hivCountries.map((c) => ({ value: c, label: c }))}
                    />
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={hivData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="gradHiv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5e6d0" />
                        <XAxis dataKey="annee" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} width={45} domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip unit="%" />} />
                        <Area
                            type="monotone"
                            dataKey="couverture"
                            name="Couverture ARV (%)"
                            stroke={GREEN}
                            fill="url(#gradHiv)"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: GREEN }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
