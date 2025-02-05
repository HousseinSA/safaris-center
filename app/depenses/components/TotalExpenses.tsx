interface TotalExpensesProps {
    totalExpenses: number;
}

export const TotalExpenses = ({ totalExpenses }: TotalExpensesProps) => {
    return (
        <div className="mt-2 max-w-md bg-gray-50 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center">
                <span className="font-bold text-primary text-sm">Total Dépenses: </span>
                <span className="text-gray-800 text-sm  bg-gray-100 px-4 py-2 rounded-md font-medium">{totalExpenses.toLocaleString()} MRU</span>
            </div>
        </div>
    );
};

