"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearPaginationProps {
    currentYear: number;
    availableYears: number[];
    onNextYear: () => void;
    onPreviousYear: () => void;
}

export const YearPagination = ({ currentYear, availableYears, onNextYear, onPreviousYear }: YearPaginationProps) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <Button
                onClick={onPreviousYear}
                disabled={!availableYears.includes(currentYear - 1)}
                variant="outline"
                size="sm"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-bold text-primary">{currentYear}</span>
            <Button
                onClick={onNextYear}
                disabled={!availableYears.includes(currentYear + 1)}
                variant="outline"
                size="sm"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};