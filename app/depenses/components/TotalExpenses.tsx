interface TotalExpensesProps {
    totalExpenses: number;
}

export const TotalExpenses = ({ totalExpenses }: TotalExpensesProps) => {
    return (
        <div className="mt-2 max-w-md bg-gray-100 p-4 rounded-md shadow-sm">
            <div className="flex justify-between">
                <span className="font-bold text-primary">Total des dépenses: </span>
                <span className="text-gray-600 font-medium">{totalExpenses.toLocaleString()} MRU</span>
            </div>
        </div>
    );
};