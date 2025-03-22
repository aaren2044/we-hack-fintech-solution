import React, { useState } from 'react';
import { FaDollarSign, FaChartBar, FaRegFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Replace with your actual API key
const apiKey = "AIzaSyBwZtgyY1EC5SqtClMJH9dFY4DVFT0468w";

const BusinessGrowthProjectionCalculator: React.FC = () => {
    const [initialInvestment, setInitialInvestment] = useState('');
    const [growthRate, setGrowthRate] = useState('');
    const [years, setYears] = useState('');
    const [suggestions, setSuggestions] = useState<{ text: string; author: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateGrowth = () => {
        const investment = parseFloat(initialInvestment);
        const rate = parseFloat(growthRate) / 100; // Convert to decimal
        const time = parseInt(years);

        if (isNaN(investment) || isNaN(rate) || isNaN(time)) {
            throw new Error('Invalid input values');
        }

        // Future Value = P(1 + r)^t
        const futureValue = investment * Math.pow(1 + rate, time);

        return futureValue >= investment
            ? `Your projected growth value will be ₹${futureValue.toFixed(2)}.`
            : `Your projected growth value will be ₹${futureValue.toFixed(2)}, which is a decrease.`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuggestions([]);
        setError('');

        try {
            const result = calculateGrowth();
            setSuggestions(prev => [...prev, { text: result, author: 'User' }]);

            // Call Gemini API for additional suggestions
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
                                        text: `Initial Investment: ₹${initialInvestment}, Growth Rate: ${growthRate}%, Duration: ${years} years. Please provide insights on business growth projection.`,
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
                setSuggestions(prev => [
                    ...prev,
                    { text: data.candidates[0].content.parts[0].text, author: 'FinStart AI' },
                ]);
            } else {
                throw new Error('No suggestions found in the API response.');
            }
        } catch (err) {
            setError('Error calculating growth projection. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Data for the growth projection graph
    const investmentValues = [];
    const numYears = parseInt(years);
    if (!isNaN(numYears) && !isNaN(parseFloat(initialInvestment)) && !isNaN(parseFloat(growthRate))) {
        for (let i = 0; i <= numYears; i++) {
            investmentValues.push(
                parseFloat(initialInvestment) * Math.pow(1 + parseFloat(growthRate) / 100, i)
            );
        }
    }

    const data = {
        labels: Array.from({ length: numYears }, (_, i) => `Year ${i + 1}`),
        datasets: [
            {
                label: 'Projected Growth',
                data: investmentValues,
                fill: false,
                backgroundColor: 'rgba(255, 215, 0, 1)', // Yellow
                borderColor: 'rgba(255, 215, 0, 0.6)', // Light yellow
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Years',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount (₹)',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `₹${tooltipItem.raw.toLocaleString()}`;
                    },
                },
            },
        },
    };

    return (
        <div className="flex h-screen bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 p-6">
            {/* Left Side: Calculator and Graph */}
            <div className="w-1/2 p-6 flex flex-col">
                {/* Calculator Section */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">Business Growth Projection Calculator</h1>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full">
                        <div className="mb-4 flex items-center">
                            <FaDollarSign className="text-yellow-500 mr-3" size={24} />
                            <input
                                type="number"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(e.target.value)}
                                placeholder="Initial Investment (₹)"
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <FaChartBar className="text-yellow-500 mr-3" size={24} />
                            <input
                                type="number"
                                value={growthRate}
                                onChange={(e) => setGrowthRate(e.target.value)}
                                placeholder="Expected Growth Rate (%)"
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <FaRegFileAlt className="text-yellow-500 mr-3" size={24} />
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(e.target.value)}
                                placeholder="Duration (in years)"
                                className="border rounded w-full p-2"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-yellow-500 text-white rounded-lg py-2 w-full hover:bg-yellow-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Calculating...' : 'Calculate Projected Growth'}
                        </button>
                    </form>
                </div>

                {/* Graph Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Projected Growth Graph</h2>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>

            {/* Right Side: AI Suggestions */}
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
                                dangerouslySetInnerHTML={{ __html: suggestion.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/•/g, '<li>$&</li>') }} // Enables bullet points and bold text
                                className="whitespace-pre-wrap"
                            ></p>
                        </motion.div>
                    ))}
                </div>
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default BusinessGrowthProjectionCalculator;