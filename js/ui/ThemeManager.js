// Theme Management
import { CONFIG } from '../config.js';

export class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    loadTheme() {
        const saved = localStorage.getItem(CONFIG.THEME_KEY);
        return saved || CONFIG.DEFAULT_THEME;
    }

    saveTheme(theme) {
        localStorage.setItem(CONFIG.THEME_KEY, theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.saveTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    getTheme() {
        return this.currentTheme;
    }
}
