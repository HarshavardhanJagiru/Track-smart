import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {darkMode ? (
                <Sun size={20} className="animate-in spin-in-180 duration-500" />
            ) : (
                <Moon size={20} className="animate-in spin-in-180 duration-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
