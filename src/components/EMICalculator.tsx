import React, { useState } from 'react';
import { FaMoneyBillWave, FaChartPie, FaRegClock } from 'react-icons/fa';
const EMICalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [emi, setEMI] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const calculateEMI = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const principalAmount = parseFloat(principal);
            const interest = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
            const numberOfPayments = parseFloat(loanTerm) * 12; // Total number of payments
            const emiValue =
                (principalAmount * interest * Math.pow(1 + interest, numberOfPayments)) /
                (Math.pow(1 + interest, numberOfPayments) - 1);
            setEMI(emiValue.toFixed(2));
        } catch (err) {
            setError('Error calculating EMI. Please ensure all fields are filled correctly.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-yellow-300 to-yellow-500 animate-gradient p-6">
            <h1 className="text-5xl font-bold mb-6 text-white opacity-90">EMI Calculator</h1>
            <form onSubmit={calculateEMI} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                    <FaMoneyBillWave className="text-yellow-500 mr-3" size={24} />
                    <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        placeholder="Principal Amount (₹)"
                        className="border-none w-full bg-gray-100 focus:bg-yellow-50 p-2 rounded-lg placeholder-gray-400"
                        required
                    />
                </div>
                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                    <FaChartPie className="text-yellow-500 mr-3" size={24} />
                    <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="Annual Interest Rate (%)"
                        className="border-none w-full bg-gray-100 focus:bg-yellow-50 p-2 rounded-lg placeholder-gray-400"
                        required
                    />
                </div>
                <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                    <FaRegClock className="text-yellow-500 mr-3" size={24} />
                    <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        placeholder="Loan Term (in years)"
                        className="border-none w-full bg-gray-100 focus:bg-yellow-50 p-2 rounded-lg placeholder-gray-400"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-yellow-500 text-white rounded-lg py-2 hover:bg-yellow-600 transition duration-300">
                    {loading ? 'Calculating...' : 'Calculate EMI'}
                </button>
            </form>
            {emi && (
                <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold">Monthly EMI</h2>
                    <p className="text-lg text-gray-700">₹ {emi}</p>
                </div>
            )}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
};
export default EMICalculator;
