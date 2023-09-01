import React from 'react';
import { ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const theme = {
        palette: {
            primary: {
                main: '#1976d2',
            },
            // Add more colors and properties
        },
    };

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
