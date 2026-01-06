import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Portfolio from './Portfolio';

function App() {
  // Set browser tab title reliably
  useEffect(() => {
    document.title = "James Ngei Portfolio";
  }, []);

  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
}

export default App;
