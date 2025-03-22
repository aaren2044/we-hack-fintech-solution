import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
// Sample data for news articles with images
const newsArticles = [
    {
        id: '1',
        title: 'Understanding Microfinance in India',
        description: 'Explore how microfinance plays a crucial role in supporting small businesses across the nation.',
        link: 'https://www.siliconindia.com/news/general/microfinance-revival-in-sight-in-india-banks-to-take-the-lead-hsbc-report-nid-234995-cid-1.html',
        image: 'https://www.siliconindia.com/news/newsimages/oBp3rU87.jpg',
    },
    {
        id: '2',
        title: 'New Government Initiatives for Startups',
        description: 'The government introduces new schemes to boost startups in the financial sector.',
        link: 'https://www.msn.com/en-in/news/India/piyush-goyal-hails-startups-says-many-nations-want-to-adopt-indias-development-model/ar-AA1BrK3r?ocid=BingNewsVerp',
        image: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1BrK3n.img?w=768&h=564&m=6&x=824&y=277&s=388&d=388',
    },
    {
        id: '3',
        title: 'Financial Literacy Programs for Entrepreneurs',
        description: 'Learn more about programs aimed at improving the financial literacy of aspiring entrepreneurs.',
        link: 'https://pctechmag.com/2025/03/financial-literacy-for-beginners-a-comprehensive-guide/',
        image: 'https://i0.wp.com/pctechmag.com/wp-content/uploads/2025/03/office-1574717_1280.jpg?w=1280&ssl=1',
    },
    {
        id: '4',
        title: 'Top Microfinance Institutions in India',
        description: 'A detailed overview of leading microfinance institutions and their impact on small businesses.',
        link: 'https://www.financialexpress.com/market/stock-insights/5-cheapest-microfinance-banks-in-india/3780073/',
        image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/invest.reuters_20250317200801.jpg?w=1024',
    }
];
const NewsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
            <div className="container mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Latest Financial News</h2>
                
                <div className="space-y-6">
                    {newsArticles.map((article) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white p-6 rounded-lg shadow-lg border border-yellow-300 flex"
                        >
                            <img src={article.image} alt={article.title} className="w-24 h-24 rounded mr-4 object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center text-yellow-500 mb-2">
                                    <Newspaper className="h-6 w-6 mr-2" />
                                    <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                                </div>
                                <p className="text-gray-700">{article.description}</p>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                                >
                                    Read More
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default NewsPage;
