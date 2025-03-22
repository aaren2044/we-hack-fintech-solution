import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { FaMoneyBillWave, FaClipboardList, FaChartBar, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Register necessary chart components including PointElement and LineElement
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

export default function DashboardPage() {
    const { currency } = useCurrency();
    // Sample values
    const earningsData = [1200, 1500, 1300, 1800, 1600, 1400, 2000, 1700, 2100, 1900, 2500, 2200];
    const expenditureData = [1000, 1100, 1200, 1300, 1250, 1150, 1400, 1300, 1500, 1400, 1600, 1550];
    
    // Calculate cumulative earnings/expenditure
    const cumulativeEarnings = earningsData.reduce((acc, value) => acc + value, 0);
    const cumulativeExpenditure = expenditureData.reduce((acc, value) => acc + value, 0);
    
    // Calculate profit/loss
    const profitLoss = cumulativeEarnings - cumulativeExpenditure;
    
    // Average monthly figures
    const averageEarnings = cumulativeEarnings / earningsData.length;
    const averageExpenditure = cumulativeExpenditure / expenditureData.length;
    
    // Calculate Simple Moving Average (SMA) for trend line
    const calculateSMA = (data, period = 3) => {
        const sma = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - period + 1);
            const subset = data.slice(start, i + 1);
            sma.push(subset.reduce((acc, val) => acc + val, 0) / subset.length);
        }
        return sma;
    };

    // Get trend line (SMA for earnings)
    const trendLine = calculateSMA(earningsData);

    // Data for bar charts
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Earnings',
                data: earningsData,
                backgroundColor: 'rgba(255, 215, 0, 0.6)', // Light yellow
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expenditure',
                data: expenditureData,
                backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange
                borderColor: 'rgba(255, 165, 0, 1)',
                borderWidth: 1,
            },
            // Add Trend Line
            {
                label: 'Earnings Trend',
                data: trendLine,
                type: 'line',
                fill: false,
                borderColor: 'rgba(0, 128, 0, 1)', // Green
                borderWidth: 2,
                tension: 0.1, // Makes the line smooth
                pointRadius: 0, // No points on the line
            }
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: `${currency} Amount`,  // Fixed the syntax here
                },
            },
            y: {
                title: {
                    display: true,
                    text: `${currency} Amount`,  // Fixed the syntax here
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${currency} ${tooltipItem.raw.toLocaleString()}`;  // Fixed the syntax here
                    },
                },
            },
        },
    };

    // AI Insights Section - I added a sample text for this as it was undefined
    const aiInsights = 'Based on current trends, we project a 10% increase in revenue for the next quarter!';

    return (
        <div className="flex h-screen bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 p-6">
            {/* Sidebar */}
            <div className="w-64 bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Dashboard</h2>
                <ul>
                    {['Tools', 'Courses', 'Community', 'News', 'Government Schemes', 'FinStart AI', 'Banks Nearby', 'Report Summary'].map((item, index) => (
                        <li key={index} className="mb-4">
                            <Link
                                to={`/${item.replace(/\s+/g, '-').toLowerCase()}`}
                                className="text-gray-700 hover:text-yellow-600 transition-transform duration-300 flex items-center transform hover:scale-105"
                            >
                                <FaClipboardList className="mr-2" />
                                {item}
                            </Link>
                        </li>
                    ))}
                    {/* Telegram Bot Link */}
                    <li className="mb-4">
                        <a
                            href="https://web.telegram.org/k/#@microTransbot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-yellow-600 transition-transform duration-300 flex items-center transform hover:scale-105"
                        >
                            <FaClipboardList className="mr-2" />
                            Telegram Bot
                        </a>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto bg-yellow-100 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">Business Overview</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <motion.div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl flex items-center hover:scale-105">
                        <FaMoneyBillWave className="text-yellow-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">Total Earnings</h2>
                            <p className="text-lg">{currency} {cumulativeEarnings.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl flex items-center hover:scale-105">
                        <FaClipboardList className="text-yellow-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">Total Expenditure</h2>
                            <p className="text-lg">{currency} {cumulativeExpenditure.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl flex items-center hover:scale-105">
                        <FaChartBar className="text-yellow-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">Profit/Loss</h2>
                            <p className={`text-lg ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {currency} {profitLoss.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Average Monthly Earnings and Expenditure */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <motion.div className="bg-white p-6 rounded-lg shadow-lg flex items-center transition-transform duration-300 hover:shadow-xl hover:scale-105">
                        <FaMoneyBillWave className="text-yellow-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">Average Monthly Earnings</h2>
                            <p className="text-lg">{currency} {averageEarnings.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-lg shadow-lg flex items-center transition-transform duration-300 hover:shadow-xl hover:scale-105">
                        <FaClipboardList className="text-yellow-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">Average Monthly Expenditure</h2>
                            <p className="text-lg">{currency} {averageExpenditure.toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>

                {/* AI Insights Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">FinStart AI Insights</h2>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <FaLightbulb className="text-yellow-500 mb-2" />
                        <p>{aiInsights}</p>
                    </div>
                </div>

                {/* Graph Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Graphs</h2>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <Bar data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
}