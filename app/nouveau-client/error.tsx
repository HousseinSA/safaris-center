'use client'
import React from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
    let message;

    // Determine the error message based on the error type
    if (error.name === 'ValidationError') {
        message = "Veuillez vérifier vos informations et réessayer.";
    } else if (error.name === 'NetworkError') {
        message = "Impossible de se connecter. Assurez-vous d'avoir une bonne connexion Internet.";
    } else if (error.message.includes('404')) {
        message = "Désolé, la page que vous cherchez n'est pas disponible.";
    } else {
        message = "Oups ! Quelque chose s'est mal passé. Veuillez réessayer plus tard.";
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={reset}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
};

export default Error;