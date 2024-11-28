"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

const GoBackButton = () => {
    const router = useRouter();

    const simonGoBack = () => {
        router.back();
    };

    return (
        <button
            onClick={simonGoBack}
            className="flex justify-start items-center gap-2 pb-4 hover:text-green-600 text-sm underline"
        >
            <FiArrowLeft className="text-xl" /> 
            <p>Go to Previous Screen</p>
        </button>
    );
};

export default GoBackButton;
