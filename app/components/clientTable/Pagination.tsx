import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    indexOfFirstClient: number;
    indexOfLastClient: number;
    clientsLength: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    indexOfFirstClient,
    indexOfLastClient,
    clientsLength,
    onNextPage,
    onPreviousPage,
}: PaginationProps) => {
    return (
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="text-sm text-gray-700">
                {indexOfFirstClient + 1} - {Math.min(indexOfLastClient, clientsLength)} of {clientsLength}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};