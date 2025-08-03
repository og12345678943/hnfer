import '../app/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import EnhancedNavbar from '../components/EnhancedNavbar';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <EnhancedNavbar />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}