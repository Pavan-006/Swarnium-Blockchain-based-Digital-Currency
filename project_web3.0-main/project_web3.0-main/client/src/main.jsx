import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TransactionsProvider } from "./context/TransactionContext";
import { BlockchainProvider } from "./context/BlockchainContext";
import "./index.css";

// Add buffer polyfill
import { Buffer } from 'buffer';
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TransactionsProvider>
        <BlockchainProvider>
          <App />
        </BlockchainProvider>
      </TransactionsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
