import React, { useState } from 'react';
import { PlusCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Sample data with one question having answers
const initialQuestions = [
  {
    id: '1',
    question: 'What are the best microfinance options for small businesses?',
    answers: [
      { id: '1', text: 'Consider community-driven microfinance, which offers lower interest rates.', author: 'Rahul Sharma' },
      { id: '2', text: 'If you have a good credit score, try applying through established MFIs.', author: 'Priya Verma' },
    ]
  },
  {
    id: '2',
    question: 'How to apply for microfinance loans?',
    answers: [], // This question will be answered later
  }
];

const initialCommunities = [
  { id: '1', name: 'Microfinance Innovators', description: 'Community for those interested in microfinance innovations.' },
  { id: '2', name: 'Financial Literacy Support', description: 'Focuses on educating members about financial management.' }
];

const initialExperts = [
  { id: '1', name: 'Amit Kumar', expertise: 'Microfinance', contact: 'amit@example.com' },
  { id: '2', name: 'Sita Malhotra', expertise: 'Financial Planning', contact: 'sita@example.com' }
];

const CommunityForum: React.FC = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [formData, setFormData] = useState({ question: '' });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [answerData, setAnswerData] = useState({ answer: '' });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion = {
      id: Date.now().toString(),
      question: formData.question,
      answers: []
    };
    setQuestions([...questions, newQuestion]);
    setShowQuestionForm(false);
    setFormData({ question: '' });
    toast.success('Question asked successfully!');
  };

  const handleAnswerQuestion = (questionId: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [
            ...q.answers,
            { id: Date.now().toString(), text: answerData.answer, author: 'Anonymous' }
          ]
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    setAnswerData({ answer: '' });
    setSelectedQuestionId(null); // Close the answer input after submission
    toast.success('Answer submitted successfully!');
  };

  const handleToggleAnswerBox = (questionId: string) => {
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null); // Close the answer box if the same question is clicked
    } else {
      setSelectedQuestionId(questionId); // Show answer box for the clicked question
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Community Forum</h2>
          <motion.button
            onClick={() => setShowQuestionForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
            whileHover={{ scale: 1.05 }}
          >
            <PlusCircle size={20} />
            Ask a Question
          </motion.button>
        </div>

        {showQuestionForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <textarea
                placeholder="Type your question here..."
                value={formData.question}
                onChange={(e) => setFormData({ question: e.target.value })}
                className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition-all"
                required
              />
              <motion.button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                whileHover={{ scale: 1.05 }}
              >
                Submit Question
              </motion.button>
            </form>
          </motion.div>
        )}

        <div className="grid gap-8">
          {questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white p-6 rounded-lg shadow-md space-y-4 border border-yellow-300"
            >
              <h3 className="text-xl font-semibold text-gray-900">{q.question}</h3>
              {q.answers.length > 0 ? (
                <div className="space-y-2">
                  {q.answers.map((answer) => (
                    <div key={answer.id} className="text-gray-700">
                      <p className="font-medium">{answer.author}</p>
                      <p>{answer.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No answers yet.</p>
              )}
              
              <motion.button
                onClick={() => handleToggleAnswerBox(q.id)}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                whileHover={{ scale: 1.05 }}
              >
                Answer Now
              </motion.button>

              {selectedQuestionId === q.id && (
                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={answerData.answer}
                    onChange={(e) => setAnswerData({ answer: e.target.value })}
                    className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition-all"
                  />
                  <motion.button
                    onClick={() => handleAnswerQuestion(q.id)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                    whileHover={{ scale: 1.05 }}
                  >
                    Submit
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-900">Communities to Join</h3>
          <div className="flex flex-col space-y-2">
            {initialCommunities.map((community) => (
              <div key={community.id} className="p-4 bg-gray-100 rounded-lg border border-yellow-300">
                <h4 className="font-semibold">{community.name}</h4>
                <p className="text-gray-600">{community.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-900">Experts to Connect</h3>
          <div className="flex flex-col space-y-2">
            {initialExperts.map((expert) => (
              <div key={expert.id} className="p-4 bg-gray-100 rounded-lg border border-yellow-300 flex justify-between items-center">
                <div className="flex items-center">
                  <User className="text-yellow-400 h-6 w-6 mr-2" />
                  <div>
                    <h4 className="font-semibold">{expert.name}</h4>
                    <p className="text-gray-600">{expert.expertise}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    const emailUrl = `mailto:${expert.contact}?subject=Connection Request`;
                    window.location.href = emailUrl;
                    toast.success(`Connecting with ${expert.name}`);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-[1.02]"
                  whileHover={{ scale: 1.05 }}
                >
                  Connect
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityForum;
