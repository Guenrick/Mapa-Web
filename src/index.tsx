import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // Mantenha se você usa este arquivo, senão pode apagar.
import App from './App.tsx'; // CORREÇÃO AQUI

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Please check your public/index.html file.");
}