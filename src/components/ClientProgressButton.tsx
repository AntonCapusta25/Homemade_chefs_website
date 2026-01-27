"use client";

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ClientProgressButton() {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = () => {
        setIsCompleted(!isCompleted);
        // In a real app, this would call a server action or API
    };

    return (
        <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-4">Track Progress</h3>
            <button
                onClick={handleComplete}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl ${isCompleted
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-[#0F1E19] text-white hover:bg-[#F47A44]"
                    }`}
            >
                <CheckCircle size={24} className={isCompleted ? "fill-white/20" : ""} />
                {isCompleted ? "Completed" : "Mark as Complete"}
            </button>
            {isCompleted && (
                <p className="mt-4 text-green-600 font-medium animate-pulse">
                    Progress saved to your Chef Profile!
                </p>
            )}
        </div>
    );
}
