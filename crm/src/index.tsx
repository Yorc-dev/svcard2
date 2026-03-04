import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'core-js';
import 'font-awesome/css/font-awesome.min.css';
import "./i18n";

import App from './App';
import { store } from './store/configureStore';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
