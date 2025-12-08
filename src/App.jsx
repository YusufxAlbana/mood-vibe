import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { initTheme } from './utils/storage';
import './App.css';

function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className="app-container">
      <HomePage />
    </div>
  );
}

export default App;
