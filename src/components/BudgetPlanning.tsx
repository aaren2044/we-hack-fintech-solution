import React, { useState } from 'react';
import { FaMoneyBillWave, FaRegFileAlt, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Replace with your actual API key
const apiKey = "AIzaSyBwZtgyY1EC5SqtClMJH9dFY4DVFT0468w";

const BudgetPlanningCalculator = () => {
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');
    const [savingsGoal, setSavingsGoal] = useState('');
    const [suggestions, setSuggestions] = useState<{ text: string; author: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateSavings = () => {
        const totalIncome = parseFloat(income);
        const totalExpenses = parseFloat(expenses);
        const savings = totalIncome - totalExpenses;
        return savings >= 0
            ? `You can save ₹${savings.toFixed(2)}.`
            : `You're over budget by ₹${Math.abs(savings).toFixed(2)}.`;
    };

    const formatResponse = (text: string) => {
        // Replace ** with bold tags
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace * with bullet points
        text = text.replace(/\* /g, '• ');
        // Replace newlines with <br> tags
        text = text.replace(/\n/g, '<br>');
        return text;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuggestions([]);
        setError('');

        try {
            // Calculate savings
            const result = calculateSavings();
            setSuggestions(prev => [...prev, { text: result, author: 'User' }]);

            // Call Gemini API for suggestions
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: `Income: ₹${income}, Expenses: ₹${expenses}, Savings Goal: ₹${savingsGoal}. Provide budget planning suggestions.`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Error fetching suggestions from AI.');
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const formattedText = formatResponse(data.candidates[0].content.parts[0].text);
                setSuggestions(prev => [
                    ...prev,
                    { text: formattedText, author: 'FinStart AI' },
                ]);
            } else {
                throw new Error('No suggestions found in the API response.');
            }
        } catch (err) {
            setError('Error calculating budget. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 p-6">
            {/* Calculator Section */}
            <div className="w-1/2 p-6 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Budget Planning Calculator</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <div className="mb-4 flex items-center">
                        <FaMoneyBillWave className="text-yellow-500 mr-3" size={24} />
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            placeholder="Monthly Income (₹)"
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <FaClipboardList className="text-yellow-500 mr-3" size={24} />
                        <input
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            placeholder="Monthly Expenses (₹)"
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <FaRegFileAlt className="text-yellow-500 mr-3" size={24} />
                        <input
                            type="number"
                            value={savingsGoal}
                            onChange={(e) => setSavingsGoal(e.target.value)}
                            placeholder="Savings Goal (₹)"
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-yellow-500 text-white rounded-lg py-2 w-full hover:bg-yellow-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Calculating...' : 'Calculate Budget'}
                    </button>
                </form>
            </div>
            {/* AI Suggestions Section */}
            <div className="w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">FinStart AI Suggestions</h2>
                <div className="overflow-y-auto h-full">
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-4 bg-gray-100 rounded-lg shadow-lg mt-2"
                        >
                            <p className="font-medium">{suggestion.author}:</p>
                            <p
                                dangerouslySetInnerHTML={{ __html: suggestion.text }}
                                className="whitespace-pre-line"
                            ></p>
                        </motion.div>
                    ))}
                </div>
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default BudgetPlanningCalculator;