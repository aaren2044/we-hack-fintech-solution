import React, { useState } from 'react';
import { FaFileExcel, FaChartBar, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UploadPage: React.FC = () => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    // Predefined summary data
    const predefinedSummary = {
        earnings: 20000,
        expenditure: 15000,
        profit: 5000,
    };

    // Predefined summary paragraph
    const summaryParagraph = `
        Your earnings this month were ₹20,000, which is a 10% increase compared to last month. 
        Your expenditure was ₹15,000, showing a 5% decrease from the previous month. 
        This indicates a positive trend in managing your finances. 
        You are on track to meet your annual savings goal, but consider reducing discretionary spending 
        to further improve your profit margin. Keep up the good work!
    `;

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileUploaded(true);
        }
    };

    const handleSubmit = () => {
        setShowSummary(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 p-6">
            <div className="container mx-auto px-4 space-y-6">
                <h1 className="text-3xl font-bold text-center mb-6">Upload Your Excel File</h1>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
                    <div className="flex items-center justify-center border-2 border-dashed border-yellow-500 p-6 rounded-lg">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <FaFileExcel className="text-yellow-500 text-4xl mx-auto" />
                            <p className="text-gray-700 mt-2">
                                {fileUploaded ? "File Uploaded!" : "Click to upload your Excel file"}
                            </p>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <motion.button
                        onClick={handleSubmit}
                        className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                        whileHover={{ scale: 1.05 }}
                        disabled={!fileUploaded}
                    >
                        Submit
                    </motion.button>
                </div>

                {/* Summary Section */}
                {showSummary && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                        <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <motion.div className="bg-yellow-100 p-4 rounded-lg flex items-center">
                                <FaMoneyBillWave className="text-yellow-500 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold">Earnings</h3>
                                    <p className="text-gray-700">₹{predefinedSummary.earnings.toLocaleString()}</p>
                                </div>
                            </motion.div>
                            <motion.div className="bg-yellow-100 p-4 rounded-lg flex items-center">
                                <FaMoneyBillWave className="text-yellow-500 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold">Expenditure</h3>
                                    <p className="text-gray-700">₹{predefinedSummary.expenditure.toLocaleString()}</p>
                                </div>
                            </motion.div>
                            <motion.div className="bg-yellow-100 p-4 rounded-lg flex items-center">
                                <FaChartBar className="text-yellow-500 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold">Profit</h3>
                                    <p className="text-gray-700">₹{predefinedSummary.profit.toLocaleString()}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Summary Paragraph */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Trends and Insights</h3>
                            <p className="text-gray-700">{summaryParagraph}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;