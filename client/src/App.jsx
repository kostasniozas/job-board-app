// App.jsx - Main application file with enhanced structure

import { useState } from 'react';
import './App.css'
import AuthContainer from './components/Auth/AuthContainer'

function App() {
  const [appError, setAppError] = useState(null);

  // Error boundary functionality
  const handleAppError = (error) => {
    console.error('App Error:', error);
    setAppError(error.message);
  };

  if (appError) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{appError}</p>
        <button onClick={() => setAppError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="App">
      <AuthContainer onError={handleAppError} />
    </div>
  )
}

export default App