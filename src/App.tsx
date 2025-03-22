import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MicrofinanceInfo from './components/MicrofinanceInfo';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ToolsPage from './components/ToolsPage.tsx'; // Import the ToolsPage component
import LoanEligibility from './components/LoanEligibility'; // Import individual calculator components
import EMICalculator from './components/EMICalculator'; 
import BudgetPlanning from './components/BudgetPlanning'; 
import FinStartAI from './components/FinStartAI'; 
import BusinessGrowth from './components/BusinessGrowth'; 
import { CurrencyProvider } from './context/CurrencyContext';
import CommunityForum from './components/CommunityForum.tsx';
import GovernmentSchemes from './components/GovernmentSchemes'; 
import NewsPage from './components/NewsPage'; 
import CoursesPage from './components/Courses'; 
import ModuleDetailPage from './components/Intro'; 
import MicrofinanceLocator from './components/MicrofinanceLocator'; 
import UploadPage from './components/Report'; 
function App() {
  return (
    <CurrencyProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<><Hero /><MicrofinanceInfo /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tools" element={<ToolsPage />} /> {/* Route for tools page */}
            <Route path="/tools/loan-eligibility" element={<LoanEligibility />} /> {/* Route for Loan Eligibility */}
            <Route path="/tools/emi-calculator" element={<EMICalculator />} /> {/* Route for EMI Calculator */}
            <Route path="/tools/budget-planning" element={<BudgetPlanning />} /> {/* Route for Budget Planning */}
            <Route path="/tools/business-growth" element={<BusinessGrowth />} /> {/* Route for Business Growth */}
            <Route path="/community" element={<CommunityForum />} />
            <Route path="/finstart-ai" element={<FinStartAI />} />
            <Route path="/government-schemes" element={<GovernmentSchemes />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/banks-nearby" element={<MicrofinanceLocator />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/introduction-to-microfinance" element={<ModuleDetailPage />} />
            <Route path="/report-summary" element={<UploadPage />} />
          </Routes>
        </div>
      </Router>
    </CurrencyProvider>
  );
}
export default App;
