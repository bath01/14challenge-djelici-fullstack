<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'economie' => [
                'population' => $this->parsePopulation(),
                'worldBank' => $this->parseWorldBank(),
            ],
            'education' => [
                'teachers' => $this->parseTeachers(),
                'byRegion' => $this->parseEducationByRegion(),
                'byPeriod' => $this->parseEducationByPeriod(),
            ],
            'sante' => [
                'covid' => $this->parseCovid(),
                'accidents' => $this->parseAccidents(),
                'accidentsByType' => $this->parseAccidentsByType(),
                'hivCoverage' => $this->parseHivCoverage(),
            ],
            'securite' => [
                'military' => $this->parseMilitary(),
            ],
            'sport' => [
                'stadiums' => $this->parseStadiums(),
            ],
        ]);
    }

    private function parsePopulation(): array
    {
        $rows = $this->readCsv(base_path("data/economie/Evolution de la population des principales villes de Côte d'Ivoire selon les RGPH (1975-2021).csv"));

        return array_map(fn ($row) => [
            'annee' => (int) $row['Année'],
            'abidjan' => (int) $row['Abidjan'],
            'bouake' => (int) $row['Bouaké'],
        ], $rows);
    }

    private function parseWorldBank(): array
    {
        $rows = $this->readCsv(base_path('data/economie/Indicateurs provenant de la Banque Mondiale.csv'));
        $grouped = [];

        foreach ($rows as $row) {
            // Normalize non-breaking spaces to regular spaces
            $indicator = str_replace("\xc2\xa0", ' ', trim($row['Indicateur'] ?? ''));
            $value = $row['Valeur'] ?? '';
            if ($indicator === '' || $indicator === 'Indicateur' || $value === '') {
                continue;
            }
            $grouped[$indicator][] = [
                'annee' => (int) $row['Année'],
                'valeur' => (float) $value,
            ];
        }

        return $grouped;
    }

    private function parseCovid(): array
    {
        $rows = $this->readCsv(base_path('data/health/covid_CIV.csv'));
        $result = [];

        foreach ($rows as $row) {
            $result[] = [
                'date' => $row['date'] ?? '',
                'totalCas' => (int) ($row['total_cases'] ?? 0),
                'nouveauxCas' => (int) ($row['new_cases'] ?? 0),
                'totalDeces' => (int) ($row['total_deaths'] ?? 0),
                'nouveauxDeces' => (int) ($row['new_deaths'] ?? 0),
                'totalVaccines' => (int) ($row['total_vaccinations'] ?? 0),
                'personnesVaccinees' => (int) ($row['people_vaccinated'] ?? 0),
            ];
        }

        return $result;
    }

    private function parseAccidents(): array
    {
        $rows = $this->readCsv(base_path("data/health/Evolution des accidents de la route de 2000 à 2020.csv"));

        return array_map(fn ($row) => [
            'annee' => (int) $row['Année'],
            'categorie' => $row['Catégorie'],
            'effectif' => (int) $row['Effectif'],
        ], $rows);
    }

    private function parseAccidentsByType(): array
    {
        $rows = $this->readCsv(base_path("data/health/ACCIDENTS CORPORELS SURVENUS EN CÔTE D'IVOIRE EN 2007, 2008 & 2009.csv"));

        return array_map(fn ($row) => [
            'annee' => (int) $row['ANNEE'],
            'lieu' => $row['LIEU'],
            'statut' => $row['STATUT'],
            'valeur' => (float) $row['VALEUR'],
        ], $rows);
    }

    private function parseHivCoverage(): array
    {
        $rows = $this->readCsv(base_path('data/health/couverture-des-femmes-enceintes-sous-traitement-anti-retroviraux_pays_CEDEAO.csv'));
        $grouped = [];

        foreach ($rows as $row) {
            $pays = trim($row['Pays'] ?? '');
            if ($pays === '') {
                continue;
            }
            $keys = array_keys($row);
            $lastKey = end($keys);
            $grouped[$pays][] = [
                'annee' => (int) $row['Année'],
                'couverture' => (float) ($row[$lastKey] ?? 0),
            ];
        }

        return $grouped;
    }

    private function parseTeachers(): array
    {
        $rows = $this->readCsv(base_path("data/education/Effectif total des enseignants disponibles par disciplines selon le sexe et le statut de l'établissement.csv"));

        return array_map(fn ($row) => [
            'discipline' => $row['Discipline'],
            'enseignement' => $row['Enseignement'],
            'genre' => $row['Genre'],
            'effectif' => (int) $row['Effectif'],
        ], $rows);
    }

    private function parseEducationByRegion(): array
    {
        $rows = $this->readCsv(base_path("data/education/Proportion des filles et garçons dans le primaire selon le statut de l'école par DREN.csv"));

        return array_map(fn ($row) => [
            'dren' => trim($row['DREN']),
            'statut' => $row['Statut'],
            'genre' => $row['Genre'],
            'effectif' => (int) $row['Effectif'],
        ], $rows);
    }

    private function parseEducationByPeriod(): array
    {
        $rows = $this->readCsv(base_path('data/education/repartition-des-eleves-et-enseignants-par-drenet-de-2018-a-2021.csv'));

        return array_map(fn ($row) => [
            'periode' => $row['PERIODE'],
            'statut' => $row['STATUT'],
            'ville' => trim($row['VILLE']),
            'drenet' => trim($row['DRENET']),
            'sexe' => $row['SEXE'],
            'effectif' => (int) $row['EFFECTIF'],
        ], $rows);
    }

    private function parseMilitary(): array
    {
        $rows = $this->readCsv(base_path("data/security/Effectif des femmes dans l'armée de 2011 à 2020.csv"));

        return array_map(fn ($row) => [
            'annee' => (int) $row['Année'],
            'categorie' => trim($row['Catégorie']),
            'genre' => $row['Genre'],
            'effectif' => $row['Effectif'] !== '' ? (int) $row['Effectif'] : null,
            'pourcentage' => trim($row['Pourcentage'], " \t\n\r\0\x0B\""),
        ], $rows);
    }

    private function parseStadiums(): array
    {
        $rows = $this->readCsv(base_path('data/sport/can-2023-stades-sheet1.csv'));

        return array_map(fn ($row) => [
            'nom' => $row['Nom'] ?? '',
            'description' => $row['Description'] ?? '',
            'capacite' => (int) ($row['Capacité'] ?? 0),
            'ouverture' => (string) ($row['Ouverture'] ?? ''),
            'renovation' => (string) ($row['Rénovation'] ?? ''),
            'ville' => $row['Ville'] ?? '',
            'photos' => $row['Photos'] ?? '',
        ], $rows);
    }

    private function readCsv(string $path): array
    {
        $rows = [];
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return $rows;
        }

        // Strip UTF-8 BOM if present
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle);
        if ($headers === false) {
            fclose($handle);

            return $rows;
        }

        // Clean header names
        $headers = array_map(fn ($h) => trim((string) $h, " \t\n\r\0\x0B\"\u{FEFF}"), $headers);

        while (($data = fgetcsv($handle)) !== false) {
            if (count($data) !== count($headers)) {
                continue;
            }
            $rows[] = array_combine($headers, $data);
        }

        fclose($handle);

        return $rows;
    }
}
