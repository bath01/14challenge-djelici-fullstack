import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    return (
        <button
            onClick={onToggle}
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
