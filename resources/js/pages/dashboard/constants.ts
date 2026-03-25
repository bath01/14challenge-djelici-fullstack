export const ORANGE = '#F77F00';
export const GREEN = '#009A44';
export const GOLD = '#C8A84B';
export const BLUE = '#2196F3';
export const RED = '#E53935';
export const PURPLE = '#8E24AA';
export const TEAL = '#00897B';
export const PINK = '#E91E63';

export const PALETTE = [ORANGE, GREEN, GOLD, BLUE, RED, PURPLE, TEAL, '#FF8A65', '#26A69A'];

export const KEY_INDICATORS = [
    "Croissance du PIB (% annuel)",
    "Accès à l'électricité (% de la population)",
    "Espérance de vie à la naissance, femmes (années)",
    "Espérance de vie à la naissance, hommes (années)",
    "Taux de fertilité, total (naissances par femme)",
    "Taux de mortalité infantile, moins de 5 ans (pour 1 000)",
    "Prévalence du VIH, femmes (% des femmes âgées de 15 à 24 ans)",
    "Dépenses publiques en éducation (% du PIB)",
    "Croissance de la population (% annuel)",
    "Émissions de CO2 (tonnes métriques par habitant)",
    "Inscriptions à l'école, primaire (% brut)",
    "Agriculture, valeur ajoutée (% du PIB)",
    "Exportations de biens et de services (% du PIB)",
    "Importations de biens et de services (% du PIB)",
    "Dépenses militaires (% du PIB)",
];

export const TABS = [
    { id: 'economie', label: 'Économie' },
    { id: 'education', label: 'Éducation' },
    { id: 'sante', label: 'Santé' },
    { id: 'securite', label: 'Sécurité' },
    { id: 'sport', label: 'Sport' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return n.toLocaleString('fr-FR');
}
