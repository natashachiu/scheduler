import { useState } from "react";

// a custom hook to manage the visual mode of any component
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);


  const transition = (newMode, replace = false) => {
    setHistory(replace ?
      prev => [...prev.slice(0, -1), newMode] :
      prev => [...prev, newMode]);
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => [...prev.slice(0, -1)]);
    }
  };

  return { mode: history[history.length - 1], transition, back };
}