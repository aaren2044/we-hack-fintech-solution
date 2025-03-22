import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations
import { FaWrench } from 'react-icons/fa'; // Example icon for tools
const ToolsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
            <div className="container mx-auto px-4 space-y-6">
                <h1 className="text-3xl font-semibold mb-4 text-center text-gray-900">Select a Tool</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Loan Eligibility Calculator', path: '/tools/loan-eligibility' },
                        { label: 'EMI Calculator', path: '/tools/emi-calculator' },
                        { label: 'Budget Planning Calculator', path: '/tools/budget-planning' },
                        { label: 'Business Growth Projection Calculator', path: '/tools/business-growth' },
                    ].map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="flex items-center mb-3">
                                <FaWrench className="h-6 w-6 text-yellow-500" />
                                <h2 className="text-xl font-bold ml-2">{tool.label}</h2>
                            </div>
                            <Link
                                to={tool.path}
                                className="mt-auto inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 text-center"
                            >
                                Start
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ToolsPage;
