import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import ClientLogin from "./components/ClientLogin";
import ClientDashboard from "./components/ClientDashboard";
import GovernmentLogin from "./components/GovernmentLogin";
import GovernmentDashboard from "./components/GovernmentDashboard";
import Market from "./components/Market";
import Exchange from "./components/Exchange";
import home from "./components/home"
import Implementations from "./components/Implementations";
import CurrencyConverter from "./components/CurrencyConverter";
import { BlockchainProvider } from "./context/BlockchainContext";
import { TransactionsProvider } from "./context/TransactionContext";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('clientLoggedIn') || localStorage.getItem('govLoggedIn');
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <BlockchainProvider>
          <TransactionsProvider>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/market" element={<Market />} />
              <Route path="/services" element={<Services />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/client-login" element={<ClientLogin />} />
              <Route path="/currency-converter" element={<CurrencyConverter />} />
              <Route path="/Exchange"element={<Exchange/>}/>
              <Route path="/Implementations"element={<Implementations/>}/> 
              <Route path="/home"element={<home/>}/> 
              <Route 
                path="/client-dashboard" 
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/gov-login" element={<GovernmentLogin />} />
              <Route 
                path="/government-dashboard" 
                element={
                  <ProtectedRoute>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </TransactionsProvider>
        </BlockchainProvider>
      </div>
      <Footer />
    </div>
  );
};

export default App;