import { useGameReducer } from "./hooks/useGameReducer";
import { I18nProvider } from "./i18n/context";
import { StartScreen } from "./components/StartScreen";
import { PlayScreen } from "./components/PlayScreen";
import { ResultScreen } from "./components/ResultScreen";

function App() {
  const [state, dispatch] = useGameReducer();

  return (
    <I18nProvider>
      <div className="w-full h-full relative overflow-hidden bg-warm-bg">
        {state.screen === "start" && <StartScreen dispatch={dispatch} />}
        {state.screen === "play" && (
          <PlayScreen state={state} dispatch={dispatch} />
        )}
        {state.screen === "result" && (
          <ResultScreen state={state} dispatch={dispatch} />
        )}
      </div>
    </I18nProvider>
  );
}

export default App;
