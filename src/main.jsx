import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// This script finds the 'root' div in your index.html and injects the React app into it.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
