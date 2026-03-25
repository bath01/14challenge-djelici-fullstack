interface TooltipPayload {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    unit?: string;
}

export default function CustomTooltip({ active, payload, label, unit = '' }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-orange-100 bg-white p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold text-stone-600">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-stone-600">{p.name}:</span>
                    <span className="font-semibold text-stone-800">
                        {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
                        {unit && ` ${unit}`}
                    </span>
                </div>
            ))}
        </div>
    );
}
