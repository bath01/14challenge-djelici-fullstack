export interface PopulationRow {
    annee: number;
    abidjan: number;
    bouake: number;
}

export interface WorldBankEntry {
    annee: number;
    valeur: number;
}

export interface CovidRow {
    date: string;
    totalCas: number;
    nouveauxCas: number;
    totalDeces: number;
    nouveauxDeces: number;
    totalVaccines: number;
    personnesVaccinees: number;
}

export interface AccidentRow {
    annee: number;
    categorie: string;
    effectif: number;
}

export interface AccidentTypeRow {
    annee: number;
    lieu: string;
    statut: string;
    valeur: number;
}

export interface HivRow {
    annee: number;
    couverture: number;
}

export interface TeacherRow {
    discipline: string;
    enseignement: string;
    genre: string;
    effectif: number;
}

export interface EducationRegionRow {
    dren: string;
    statut: string;
    genre: string;
    effectif: number;
}

export interface EducationPeriodRow {
    periode: string;
    statut: string;
    ville: string;
    drenet: string;
    sexe: string;
    effectif: number;
}

export interface MilitaryRow {
    annee: number;
    categorie: string;
    genre: string;
    effectif: number | null;
    pourcentage: string;
}

export interface StadiumRow {
    nom: string;
    description: string;
    capacite: number;
    ouverture: string;
    renovation: string;
    ville: string;
    photos: string;
}

export interface DashboardProps {
    economie: {
        population: PopulationRow[];
        worldBank: Record<string, WorldBankEntry[]>;
    };
    education: {
        teachers: TeacherRow[];
        byRegion: EducationRegionRow[];
        byPeriod: EducationPeriodRow[];
    };
    sante: {
        covid: CovidRow[];
        accidents: AccidentRow[];
        accidentsByType: AccidentTypeRow[];
        hivCoverage: Record<string, HivRow[]>;
    };
    securite: {
        military: MilitaryRow[];
    };
    sport: {
        stadiums: StadiumRow[];
    };
}
