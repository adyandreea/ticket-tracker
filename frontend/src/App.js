import AppRouter from "./routes/AppRouter";
import { LanguageProvider } from "./i18n/LanguageContext.js";
import { AppThemeProvider } from "./theme/ThemeContext.js";

function App() {
  return (
    <LanguageProvider>
      <AppThemeProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AppThemeProvider>
    </LanguageProvider>
  );
}

export default App;
