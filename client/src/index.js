import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ToastContainer position="top-right" autoClose={5000} />
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
