interface FilterSelectProps {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    label?: string;
}

export default function FilterSelect({ value, onChange, options, label }: FilterSelectProps) {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-xs font-medium text-stone-500">{label}</span>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-orange-100 bg-white px-3 py-1.5 text-xs text-stone-700 shadow-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
