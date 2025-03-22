import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
// Sample data for government schemes
const governmentSchemes = [
    {
        id: '1',
        title: 'PM Mudra Yojana',
        description: 'Provides loans up to ₹10 lakhs to small businesses and startups.',
        website: 'https://www.mudra.org.in/',
        applyLink: 'https://www.mudra.org.in/online-loan-application',
        icon: '💼'
    },
    {
        id: '2',
        title: 'Startup India',
        description: 'Supports early-stage startups with funding, mentorship, and networking.',
        website: 'https://www.startupindia.gov.in/',
        applyLink: 'https://www.startupindia.gov.in/content/sih/en/startup-india-registration.html',
        icon: '🚀'
    },
    {
        id: '3',
        title: 'Credit Guarantee Fund Scheme',
        description: 'Provides guarantees for loans to small enterprises.',
        website: 'https://www.cgtsi.org.in/',
        applyLink: 'https://www.cgtsi.org.in/',
        icon: '💳'
    },
    {
        id: '4',
        title: 'Skill India',
        description: 'Offers skill development programs for young entrepreneurs.',
        website: 'https://www.skillindia.gov.in/',
        applyLink: 'https://www.skillindia.gov.in/training-partners',
        icon: '🎓'
    }
];
const GovernmentSchemes: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
            <div className="container mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Government Schemes for Microfinance</h2>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {governmentSchemes.map((scheme) => (
                        <motion.div
                            key={scheme.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white p-6 rounded-lg shadow-lg border border-yellow-300 space-y-4 flex flex-col"
                        >
                            <div className="flex items-center text-2xl">{scheme.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900">{scheme.title}</h3>
                            <p className="text-gray-700">{scheme.description}</p>
                            <div className="flex justify-between mt-auto">
                                <Link
                                    to={scheme.website}
                                    target="_blank"
                                    className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                                >
                                    More Info
                                </Link>
                                <Link
                                    to={scheme.applyLink}
                                    target="_blank"
                                    className="px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all"
                                >
                                    Apply Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default GovernmentSchemes;
