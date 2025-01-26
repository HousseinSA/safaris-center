    import { NextResponse } from "next/server";
    import db from "@/lib/mongodb";

    export async function GET(request: Request) {
        const { searchParams } = new URL(request.url);
        const expenseId = searchParams.get("id");

        try {
            if (expenseId) {
                const expense = await db.getExpenseById(expenseId);
                if (!expense) {
                    return NextResponse.json(
                        { error: "Expense not found" },
                        { status: 404 }
                    );
                }
                return NextResponse.json(expense);
            } else {
                const expenses = await db.getAllExpenses();
                return NextResponse.json(expenses);
            }
        } catch (error) {
            console.error("Error fetching expense(s):", error);
            return NextResponse.json(
                { error: "Failed to fetch expense(s)" },
                { status: 500 }
            );
        }
    }

    export async function POST(request: Request) {
        try {
            const expenseData = await request.json();

            // Ensure _id is not included in the expenseData
            if (expenseData._id) {
                delete expenseData._id;
            }

            const result = await db.createExpense(expenseData);
            return NextResponse.json(result, { status: 201 });
        } catch (error) {
            console.error("Error creating expense:", error);
            return NextResponse.json(
                { error: "Failed to create expense" },
                { status: 500 }
            );
        }
    }

    export async function PUT(request: Request) {
        try {
            const { _id, ...expenseData } = await request.json();

            if (!_id) {
                return NextResponse.json(
                    { error: "Expense ID is required" },
                    { status: 400 }
                );
            }

            const result = await db.updateExpense(_id, expenseData);

            if (result.matchedCount === 0) {
                return NextResponse.json(
                    { error: "Expense not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(result);
        } catch (error) {
            console.error("Error updating expense:", error);
            return NextResponse.json(
                { error: "Failed to update expense" },
                { status: 500 }
            );
        }
    }

    export async function DELETE(request: Request) {
        try {
            const { searchParams } = new URL(request.url);
            const id = searchParams.get("id");

            if (!id) {
                return NextResponse.json(
                    { error: "Expense ID is required" },
                    { status: 400 }
                );
            }

            const result = await db.deleteExpense(id);
            return NextResponse.json(result);
        } catch (error) {
            console.error("Error deleting expense:", error);
            return NextResponse.json(
                { error: "Failed to delete expense" },
                { status: 500 }
            );
        }
    }