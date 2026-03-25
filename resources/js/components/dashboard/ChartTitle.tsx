interface ChartTitleProps {
    children: React.ReactNode;
}

export default function ChartTitle({ children }: ChartTitleProps) {
    return <h3 className="mb-4 text-base font-semibold text-stone-800">{children}</h3>;
}
