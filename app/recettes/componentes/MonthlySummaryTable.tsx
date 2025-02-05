"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MonthlyData } from "@/lib/types";

interface MonthlySummaryTableProps {
    monthlyData: MonthlyData[];
}

export const MonthlySummaryTable = ({ monthlyData }: MonthlySummaryTableProps) => {
    return (
        <Table>
            <TableHeader className="bg-primary">
                <TableRow className="text-white hover:bg-primary">
                    <TableHead className="text-white">Mois</TableHead>
                    <TableHead className="text-white">Total Recettes</TableHead>
                    <TableHead className="text-white">Total Dépenses</TableHead>
                    <TableHead className="text-white">Bénéfices</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {monthlyData.map((data, index) => (
                    <TableRow key={index}>
                        <TableCell className="text-primary bg-gray-100 capitalize">{data.month}</TableCell>
                        <TableCell>{data.totalServices.toLocaleString()} MRU</TableCell>
                        <TableCell>{data.totalExpenses.toLocaleString()} MRU</TableCell>
                        <TableCell
                            style={{
                                color: data.benefits < 0 ? "red" : "green",
                                fontWeight: data.benefits < 0 ? "bold" : "normal",
                            }}
                        >
                            {data.benefits.toLocaleString()} MRU
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    );
};