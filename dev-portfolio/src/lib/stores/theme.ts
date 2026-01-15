// src/lib/stores/theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

// Initialize with stored preference or default to dark
const storedTheme = browser ? (localStorage.getItem('theme') as Theme) : null;
const initialTheme: Theme = storedTheme || 'light';

export const theme = writable<Theme>(initialTheme);

// Apply theme to document on change
if (browser) {
    theme.subscribe((value) => {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
    });
}

export function toggleTheme(): void {
    theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
}
