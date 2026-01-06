import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Portfolio from './Portfolio';

function App() {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
}

export default App;
