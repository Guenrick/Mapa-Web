
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'ol/ol.css'; 
import './App.css';
import App from './App.tsx';

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