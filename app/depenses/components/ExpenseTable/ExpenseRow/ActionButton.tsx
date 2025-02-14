import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, X } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Expense } from "@/lib/types";

export const ActionButtons = ({ isEditing, onSubmit, onCancelEdit, onEdit, onDeleteClick, expense, deletingId, isSubmitting }: {
    isEditing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    onEdit: (expense: Expense) => void;
    onDeleteClick: (id: string) => void;
    expense: Expense;
    deletingId: string | null;
    isSubmitting: boolean;
}) => (
    <div className="flex space-x-2">
        {isEditing ? (
            <>
                <Button onClick={onSubmit} size="sm" className="text-white" disabled={isSubmitting}>
                    {isSubmitting ? <BeatLoader color="#ffffff" size={4} /> : <Check className="h-4 w-4" />}
                </Button>
                <Button onClick={onCancelEdit} size="sm" variant="outline">
                    <X className="h-4 w-4" />
                </Button>
            </>
        ) : (
            <>
                <Button onClick={() => onEdit(expense)} size="sm" className="text-white">
                    <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDeleteClick(expense._id!.toString())} size="sm" variant="destructive" disabled={deletingId === expense._id}>
                    {deletingId === expense._id ? <BeatLoader color="#ffffff" size={4} /> : <Trash className="h-4 w-4" />}
                </Button>
            </>
        )}
    </div>
);