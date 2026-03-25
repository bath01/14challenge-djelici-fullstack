interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100 ${className}`}>
            {children}
        </div>
    );
}
