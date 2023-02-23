import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App.js';
import Senators from './data/senators.json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App senatorsList = {Senators}/>
    </React.StrictMode>
);