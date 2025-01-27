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

            // Extract unique years from the data
            const years = new Set<number>();
            expensesData.forEach((expense) => years.add(new Date(expense.date).getFullYear()));
            clientsData.forEach((client) => years.add(new Date(client.dateOfBooking).getFullYear()));

            const sortedYears = Array.from(years).sort((a, b) => b - a);
            setAvailableYears(sortedYears);

            // Set the current year to the most recent year with data
            if (sortedYears.length > 0) {
                setCurrentYear(sortedYears[0]);
            }

            // Group data by month for the selected year
            const groupedData = groupDataByMonth(expensesData, clientsData, sortedYears[0]);
            setMonthlyData(groupedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchMonthlyData();
    }, [fetchMonthlyData]);

    // Group data by month and filter by current year
    const groupDataByMonth = (expenses: Expense[], clients: Client[], year: number): MonthlyData[] => {
        const grouped: { [key: string]: { totalServices: number; totalExpenses: number } } = {};

        // Calculate total expenses per month
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

        // Calculate total services per month
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

        // Convert to array and calculate benefits
        return Object.entries(grouped).map(([month, totals]) => ({
            month,
            totalServices: totals.totalServices,
            totalExpenses: totals.totalExpenses,
            benefits: totals.totalServices - totals.totalExpenses,
        }));
    };

    // Handle year change (pagination)
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

    // Check if pagination should be shown
    const shouldShowPagination = availableYears.length > 1 || (availableYears.length === 1 && availableYears[0] !== new Date().getFullYear());

    return (
        <div className=" md:p-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold mb-4 text-primary">Recettes</h2>
                <Link href={'/'}>
                    <Button className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline-block">Retour à la liste des clients</span>
                    </Button>
                </Link>
            </div>

            {/* Year Pagination */}
            {shouldShowPagination && currentYear !== null && (
                <YearPagination
                    currentYear={currentYear}
                    availableYears={availableYears}
                    onNextYear={handleNextYear}
                    onPreviousYear={handlePreviousYear}
                />
            )}

            {/* Monthly Summary Table */}
            <MonthlySummaryTable monthlyData={monthlyData} />
        </div>
    );
}