import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Use your actual API key here
const apiKey = "AIzaSyAILbWN9EAoj8S2hzYQRhIgtdM3--a5EI0"; // Replace with your Gemini API key

const FinStartAI: React.FC = () => {
    const [userMessage, setUserMessage] = useState('');
    const [responses, setResponses] = useState<{ text: string; author: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [botTyping, setBotTyping] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userMessage.trim()) {
            toast.error("Please enter a question.");
            return;
        }

        // Block non-finance related questions
        const nonFinanceQuestions = ["Who is the prime minister", "What is the capital of", "Who won the world cup"];
        if (nonFinanceQuestions.some(q => userMessage.toLowerCase().includes(q.toLowerCase()))) {
            toast.error("I can only answer finance-related questions.");
            setUserMessage('');
            return;
        }

        // Add user message to responses
        setResponses(prev => [...prev, { text: userMessage, author: 'User' }]);
        setLoading(true);
        setUserMessage('');
        setBotTyping(true);

        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        
        try {
            const response = await fetch(`${apiUrl}?key=${apiKey}`, {
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
                                    text: userMessage,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        maxOutputTokens: 1000,
                        temperature: 0.7,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching data from the API: ${errorData.message}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                setResponses(prev => [...prev, { text: data.candidates[0].content.parts[0].text, author: 'FinStart AI' }]);
            } else {
                toast.error("Unexpected response from AI.");
            }
        } catch (error) {
            toast.error(`There was a problem connecting to the API: ${error.message}`);
        } finally {
            setLoading(false);
            setBotTyping(false);
        }
    };

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [responses]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12 flex flex-col justify-between">
            <div className="container mx-auto px-4 space-y-6 flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 text-center">FinStart AI</h2>

                {/* Chat History */}
                <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-h-[70vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold">Chat History</h3>
                    <div className="space-y-4">
                        {responses.map((response, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`flex ${response.author === 'User' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`p-4 rounded-lg ${response.author === 'User' ? 'bg-blue-100 text-gray-900' : 'bg-yellow-100 text-gray-900'} max-w-xs`}>
                                    <p className="font-medium">{response.author}:</p>
                                    {/* Use dangerouslySetInnerHTML to render formatted content */}
                                    <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatResponse(response.text) }}></p>
                                </div>
                            </motion.div>
                        ))}
                        {botTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex justify-start"
                            >
                                <div className="p-4 bg-yellow-200 text-gray-900 rounded-lg max-w-xs">
                                    <p>FinStart AI is typing...</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition-all"
                    />
                    <motion.button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                        whileHover={{ scale: 1.05 }}
                        disabled={loading}
                    >
                        <Send size={20} />
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

// Function to format the response text (e.g., add bullet points, bold text, etc.)
const formatResponse = (text: string) => {
    // Convert bullet points
    let formattedText = text.replace(/\* \*/g, '<ul><li>').replace(/\*/g, '</li></ul>');
    
    // Add support for bold text (if any)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle any other rich text formatting here...

    return formattedText;
};

export default FinStartAI;
