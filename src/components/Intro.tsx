import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaDollarSign, FaBookOpen } from 'react-icons/fa';

// Corrected YouTube embed URL
const videoUrl = "https://www.youtube.com/embed/GQcE_1i1cv0?si=KCK7QzxRA8cB_alu";

const questions = [
    { 
        question: "1. What is microfinance?", 
        options: [
            { id: '1', text: "Financial services for entrepreneurs and small businesses." },
            { id: '2', text: "A government scheme for large corporations." },
            { id: '3', text: "Insurance for small businesses." },
            { id: '4', text: "Tax benefits for large enterprises." },
        ],
        correctAnswerId: '1',
        explanation: "Microfinance provides financial services such as loans and savings specifically targeting entrepreneurs and small businesses."
    },
    {
        question: "2. Which of the following is a key feature of microfinance?",
        options: [
            { id: '1', text: "High-interest rates." },
            { id: '2', text: "Focus on large corporations." },
            { id: '3', text: "Small loan amounts." },
            { id: '4', text: "Exclusive to urban areas." },
        ],
        correctAnswerId: '3',
        explanation: "Microfinance typically offers small loan amounts to individuals and small businesses."
    },
    {
        question: "3. What is the primary goal of microfinance?",
        options: [
            { id: '1', text: "To maximize profits for banks." },
            { id: '2', text: "To provide financial services to low-income individuals." },
            { id: '3', text: "To fund large-scale infrastructure projects." },
            { id: '4', text: "To provide tax breaks for corporations." },
        ],
        correctAnswerId: '2',
        explanation: "The primary goal of microfinance is to provide financial services to low-income individuals and small businesses to help them grow and become self-sufficient."
    },
    {
        question: "4. Which of the following is NOT a microfinance service?",
        options: [
            { id: '1', text: "Small loans." },
            { id: '2', text: "Savings accounts." },
            { id: '3', text: "Insurance." },
            { id: '4', text: "Stock market trading." },
        ],
        correctAnswerId: '4',
        explanation: "Microfinance services typically include small loans, savings accounts, and insurance, but not stock market trading."
    },
    {
        question: "5. Who is the target audience for microfinance?",
        options: [
            { id: '1', text: "Large corporations." },
            { id: '2', text: "High-net-worth individuals." },
            { id: '3', text: "Low-income individuals and small businesses." },
            { id: '4', text: "Government agencies." },
        ],
        correctAnswerId: '3',
        explanation: "Microfinance targets low-income individuals and small businesses who lack access to traditional banking services."
    },
];

const ModuleDetailPage: React.FC = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);  // State to show results

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setSelectedAnswers(prev => {
            const updatedAnswers = [...prev];
            const existingIndex = updatedAnswers.findIndex(ans => ans.startsWith(questionId));
            if (existingIndex >= 0) {
                updatedAnswers[existingIndex] = `${questionId}-${answerId}`;
            } else {
                updatedAnswers.push(`${questionId}-${answerId}`);
            }
            return updatedAnswers;
        });
    };

    const handleSubmit = () => {
        setShowResults(true); // Show results upon submission
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
            <div className="container mx-auto px-4 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Introduction to Microfinance</h2>
                <p className="text-gray-700 text-center mb-4">
                    Microfinance is a crucial financial tool that supports small businesses by providing them with access to credit, enabling economic growth and self-sufficiency.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">Watch the Video</h3>
                    <iframe 
                        width="100%" 
                        height="315" 
                        src={videoUrl} 
                        title="Introduction to Microfinance" 
                        className="rounded-lg"
                        allowFullScreen
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Quiz</h3>
                    {questions.map((question, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-bold">{question.question}</p>
                            <div className="space-y-2">
                                {question.options.map(option => (
                                    <motion.label key={option.id}
                                        className="block p-3 border rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <input 
                                            type="radio" 
                                            name={question.question} 
                                            value={option.id} 
                                            onChange={() => handleAnswerSelect(question.question, option.id)}
                                            className="mr-2" 
                                        />
                                        {option.text}
                                    </motion.label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <motion.button 
                        onClick={handleSubmit} 
                        className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                        whileHover={{ scale: 1.05 }}
                    >
                        Submit Answers
                    </motion.button>
                </div>
                {/* Results Area */}
                {showResults && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Results</h3>
                        {selectedAnswers.map((answer, index) => {
                            const [questionId, answerId] = answer.split('-');
                            const question = questions.find(q => q.question === questionId);
                            const isCorrect = question && question.correctAnswerId === answerId;
                            return (
                                <div key={index} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'} my-2`}>
                                    <p className="font-medium">{question?.question}</p>
                                    <p>{isCorrect ? "Correct Answer!" : "Incorrect Answer."}</p>
                                    {!isCorrect && <p className="text-gray-600">{question?.explanation}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleDetailPage;