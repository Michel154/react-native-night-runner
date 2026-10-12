export interface Theme {
  mode: 'light' | 'dark';
  background: string;
  cardBackground: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  isDark: boolean;
}

export const darkTheme: Theme = {
  mode: "dark",
  background: "#000000",
  cardBackground: "#09090b",
  border: "#27272a",
  textPrimary: "#ffffff",
  textSecondary: "#71717a",
  accent: "#2e0bf5",
  isDark: true,
};

export const lightTheme: Theme = {
  mode: "light",
  background: "#f4f4f5",
  cardBackground: "#ffffff",
  border: "#e4e4e7",
  textPrimary: "#09090b",
  textSecondary: "#71717a",
  accent: "#2e0bf5",
  isDark: false,
};