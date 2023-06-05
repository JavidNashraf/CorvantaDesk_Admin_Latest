import React from 'react';
import { ToastContainer } from 'react-toastify';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/index';
import './lang/i18n';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
