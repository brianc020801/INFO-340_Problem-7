import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

import './style.css'; //import css file!

import FIFA_MATCHES_2018 from './data/fifa-matches-2018.json'; //the data to display

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App gameData={FIFA_MATCHES_2018} />
  </React.StrictMode>  
);