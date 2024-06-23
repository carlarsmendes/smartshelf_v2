import React from 'react';
//import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './assets/css/fonts.css';

import registerServiceWorker from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Router><App tab="home" /></Router>);
//ReactDOM.render(<Router><App /></Router>, root);
registerServiceWorker();
