import React, { useState } from 'react';
import { FaMoneyBillWave, FaRegFileAlt, FaUserShield, FaWallet, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
const LoanEligibility = () => {
    const [income, setIncome] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [creditScore, setCreditScore] = useState(700); // Default credit score
    const [loanTerm, setLoanTerm] = useState('');
    const [existingDebt, setExistingDebt] = useState('');
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const calculateEligibility = () => {
        const incomeThreshold = 30000;
        const minCreditScore = 650;
        const debtToIncomeRatio = existingDebt / income;
        if (income < incomeThreshold) {
            return 'Income too low for loan approval.';
        } else if (creditScore < minCreditScore) {
            return 'Credit score too low for loan approval.';
        } else if (debtToIncomeRatio > 0.4) {
            return 'Existing debt is too high for loan approval.';
        } else {
            const monthlyIncome = parseFloat(income);
            const maxEMI = (monthlyIncome - existingDebt) * 0.5; // 50% of disposable income
            
            let interestRate = 0.12; // 12% annual interest
            let tenure = loanTerm * 12; // Monthly tenure
            const monthlyRate = interestRate / 12;
            const maxLoanAmount = (maxEMI * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
                                  (monthlyRate * Math.pow(1 + monthlyRate, tenure));
            
            const monthlyEMI = (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                                (Math.pow(1 + monthlyRate, tenure) - 1);
            const totalPayment = monthlyEMI * tenure;
            const totalInterest = totalPayment - maxLoanAmount;
            let chancesOfGettingLoan;
            if (creditScore >= 800) {
                chancesOfGettingLoan = "Very High";
            } else if (creditScore >= 750) {
                chancesOfGettingLoan = "High";
            } else if (creditScore >= 700) {
                chancesOfGettingLoan = "Good";
            } else {
                chancesOfGettingLoan = "Low";
            }
            return {
                maxLoanAmount: Math.round(maxLoanAmount),
                maxEMI: Math.round(monthlyEMI),
                interestRate: interestRate * 100,
                tenure: loanTerm,
                chances: chancesOfGettingLoan
            };
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setEligibility(null);
        setError('');
        try {
            const result = calculateEligibility();
            setEligibility(result);
        } catch (err) {
            setError('Error calculating eligibility. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-400 to-white p-6">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Loan Eligibility Calculator</h1>
                <div className="flex w-full max-w-5xl">
                    <div className="w-full max-w-md mr-10">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                            <div className="mb-4 flex items-center">
                                <FaMoneyBillWave className="text-yellow-500 mr-3" />
                                <input 
                                    type="number" 
                                    value={income} 
                                    onChange={(e) => setIncome(e.target.value)} 
                                    placeholder="Monthly Income (₹)" 
                                    className="border rounded w-full p-2" 
                                    required 
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <FaWallet className="text-yellow-500 mr-3" />
                                <input 
                                    type="number" 
                                    value={loanAmount} 
                                    onChange={(e) => setLoanAmount(e.target.value)} 
                                    placeholder="Loan Amount Requested (₹)" 
                                    className="border rounded w-full p-2" 
                                    required 
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <FaUserShield className="text-yellow-500 mr-3" />
                                <input
                                    type="range"
                                    min="300"
                                    max="850"
                                    value={creditScore}
                                    onChange={(e) => setCreditScore(Number(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-center mt-2">{creditScore}</p>
                            </div>
                            <div className="mb-4 flex items-center">
                                <FaRegFileAlt className="text-yellow-500 mr-3" />
                                <input 
                                    type="number" 
                                    value={loanTerm} 
                                    onChange={(e) => setLoanTerm(e.target.value)} 
                                    placeholder="Loan Term (in years)" 
                                    className="border rounded w-full p-2" 
                                    required 
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <FaClipboardList className="text-yellow-500 mr-3" />
                                <input 
                                    type="number" 
                                    value={existingDebt} 
                                    onChange={(e) => setExistingDebt(e.target.value)} 
                                    placeholder="Existing Monthly Loan Payments (₹)" 
                                    className="border rounded w-full p-2" 
                                    required 
                                />
                            </div>
                            <button type="submit" className="bg-yellow-500 text-white rounded-lg py-2 w-full hover:bg-yellow-600 transition duration-300">
                                {loading ? 'Calculating...' : 'Calculate Eligibility'}
                            </button>
                        </form>
                    </div>
                    <div className="flex-1">
                        {eligibility && (
                            <motion.div 
                                className="mt-6 p-6 bg-white rounded-lg shadow-lg"
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-xl font-bold mb-4">Loan Eligibility Results</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Maximum Loan Amount:</span>
                                    <span className="font-bold">₹{eligibility.maxLoanAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Maximum EMI:</span>
                                    <span className="font-bold text-yellow-500">₹{eligibility.maxEMI.toLocaleString()}/month</span> {/* Highlighted in yellow */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Interest Rate:</span>
                                    <span>{eligibility.interestRate}% p.a.</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Loan Tenure:</span>
                                    <span>{eligibility.tenure} years</span>
                                </div>
                            </motion.div>
                        )}
                        {error && <p className="text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoanEligibility;
