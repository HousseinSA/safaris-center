interface TotalExpensesProps {
    totalExpenses: number;
}

export const TotalExpenses = ({ totalExpenses }: TotalExpensesProps) => {
    return (
        <div className="mt-4 text-right">
            <span className="font-bold text-primary">Total des dépenses: </span>
            <span>{totalExpenses.toLocaleString()} MRU</span>
        </div>
    );
};