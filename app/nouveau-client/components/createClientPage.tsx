'use client'
import AddClientForm from "@/app/components/clientForm/AddClientForm";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const createClientPage = () => {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold mb-4 text-primary">Créer un client</h2>
                <Link href={'/'}>
                    <Button
                        className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
                    >
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline-block">Retour à la liste des clients</span>
                    </Button>
                </Link >
            </div>
            <AddClientForm />
        </>
    )
}

export default createClientPage