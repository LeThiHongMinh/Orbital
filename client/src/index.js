import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { image2vector } from './assets/images';
import './index.css';

import { store } from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
