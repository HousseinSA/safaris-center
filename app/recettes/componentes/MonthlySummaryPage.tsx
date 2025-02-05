"use client";
import { useState, useEffect, useCallback } from "react";
import { Client, Expense } from "@/lib/types";
import { MonthlySummaryTable } from "./MonthlySummaryTable";
import { YearPagination } from "./YearPagination";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

interface MonthlyData {
    month: string;
    totalServices: number;
    totalExpenses: number;
    benefits: number;
}

export default function MonthlySummaryPage() {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    // Fetch data function
    const fetchMonthlyData = useCallback(async () => {
        try {
            const expensesResponse = await fetch("/api/expenses");
            const expensesData: Expense[] = await expensesResponse.json();
            const clientsResponse = await fetch("/api/clients");
            const clientsData: Client[] = await clientsResponse.json();

            const years = new Set<number>();
            expensesData.forEach((expense) => years.add(new Date(expense.date).getFullYear()));
            clientsData.forEach((client) => years.add(new Date(client.dateOfBooking).getFullYear()));

            const sortedYears = Array.from(years).sort((a, b) => b - a);
            setAvailableYears(sortedYears);

            if (sortedYears.length > 0) {
                const currentYear = new Date().getFullYear();
                const initialYear = sortedYears.includes(currentYear) ? currentYear : sortedYears[0];
                setCurrentYear(initialYear);
                const groupedData = groupDataByMonth(expensesData, clientsData, initialYear);
                setMonthlyData(groupedData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchMonthlyData();
    }, [fetchMonthlyData]);

    const groupDataByMonth = (expenses: Expense[], clients: Client[], year: number): MonthlyData[] => {
        const grouped: { [key: string]: { totalServices: number; totalExpenses: number } } = {};

        expenses.forEach((expense) => {
            const date = new Date(expense.date);
            if (date.getFullYear() === year) {
                const monthYear = `${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()}`;
                if (!grouped[monthYear]) {
                    grouped[monthYear] = { totalServices: 0, totalExpenses: 0 };
                }
                grouped[monthYear].totalExpenses += Number(expense.price);
            }
        });

        clients.forEach((client) => {
            const date = new Date(client.dateOfBooking);
            if (date.getFullYear() === year) {
                const monthYear = `${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()}`;
                if (!grouped[monthYear]) {
                    grouped[monthYear] = { totalServices: 0, totalExpenses: 0 };
                }
                grouped[monthYear].totalServices += Number(client.totalPrice);
            }
        });

        return Object.entries(grouped).map(([month, totals]) => ({
            month,
            totalServices: totals.totalServices,
            totalExpenses: totals.totalExpenses,
            benefits: totals.totalServices - totals.totalExpenses,
        }));
    };

    const handleNextYear = () => {
        if (currentYear !== null) {
            const nextYear = currentYear + 1;
            if (availableYears.includes(nextYear)) {
                setCurrentYear(nextYear);
                const expensesResponse = fetch("/api/expenses").then((res) => res.json());
                const clientsResponse = fetch("/api/clients").then((res) => res.json());
                Promise.all([expensesResponse, clientsResponse]).then(([expensesData, clientsData]) => {
                    const groupedData = groupDataByMonth(expensesData, clientsData, nextYear);
                    setMonthlyData(groupedData);
                });
            }
        }
    };

    const handlePreviousYear = () => {
        if (currentYear !== null) {
            const previousYear = currentYear - 1;
            if (availableYears.includes(previousYear)) {
                setCurrentYear(previousYear);
                const expensesResponse = fetch("/api/expenses").then((res) => res.json());
                const clientsResponse = fetch("/api/clients").then((res) => res.json());
                Promise.all([expensesResponse, clientsResponse]).then(([expensesData, clientsData]) => {
                    const groupedData = groupDataByMonth(expensesData, clientsData, previousYear);
                    setMonthlyData(groupedData);
                });
            }
        }
    };

    const shouldShowPagination = availableYears.length > 1 || (availableYears.length === 1 && availableYears[0] !== new Date().getFullYear());

    return (
        <div className="md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Recettes</h2>
                <Link href={'/'}>
                    <Button className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline-block">Retour à la liste des clients</span>
                    </Button>
                </Link>
            </div>
            {shouldShowPagination && currentYear !== null && (
                <YearPagination
                    currentYear={currentYear}
                    availableYears={availableYears}
                    onNextYear={handleNextYear}
                    onPreviousYear={handlePreviousYear}
                />
            )}
            <MonthlySummaryTable monthlyData={monthlyData} />
        </div>
    );
}