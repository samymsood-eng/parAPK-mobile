
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// تسجيل الـ Service Worker لتحسين تجربة المستخدم على الجوال وجعل التطبيق قابلاً للتثبيت
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Republic Smart System: ServiceWorker registered with scope: ', registration.scope);
    }, err => {
      console.log('Republic Smart System: ServiceWorker registration failed: ', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
