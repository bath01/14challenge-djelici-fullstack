import type { LucideIcon } from 'lucide-react';
import { ORANGE } from '@/pages/dashboard/constants';

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    color?: string;
    icon?: LucideIcon;
}

export default function StatCard({ label, value, sub, color = ORANGE, icon: Icon }: StatCardProps) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100 dark:bg-stone-900 dark:ring-stone-800">
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</p>
                {Icon && <Icon size={20} className="text-stone-400 dark:text-stone-500" />}
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight" style={{ color }}>
                {value}
            </p>
            {sub && <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">{sub}</p>}
        </div>
    );
}
