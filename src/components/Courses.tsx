import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaPlayCircle, FaClipboardList } from 'react-icons/fa';
// Sample data for course modules
const courseModules = [
    {
        id: '1',
        title: 'Introduction to Microfinance',
        description: 'Learn the basics of microfinance, its importance, and its impact on small businesses.',
        link: '/courses/introduction-to-microfinance' // Replace with actual course link
    },
    {
        id: '2',
        title: 'Financial Planning for Startups',
        description: 'This module covers essential financial planning strategies for new ventures.',
        link: '/courses/financial-planning-for-startups' // Replace with actual course link
    },
    {
        id: '3',
        title: 'Understanding Investment Strategies',
        description: 'Gain insights into various investment strategies and how to apply them effectively.',
        link: '/courses/investment-strategies' // Replace with actual course link
    },
    {
        id: '4',
        title: 'Business Growth and Development',
        description: 'Explore growth strategies and development techniques for small businesses.',
        link: '/courses/business-growth' // Replace with actual course link
    }
];
const CoursesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
            <div className="container mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Available Courses</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courseModules.map((module) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white p-6 rounded-lg shadow-lg border border-yellow-300 flex flex-col"
                        >
                            <div className="flex items-center text-yellow-500 mb-4">
                                <FaBookOpen className="h-6 w-6 mr-2" />
                                <h3 className="text-xl font-semibold">{module.title}</h3>
                            </div>
                            <p className="text-gray-700 mb-4">{module.description}</p>
                            <a
                                href={module.link}
                                className="mt-auto inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 text-center"
                            >
                                Start Course
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default CoursesPage;
