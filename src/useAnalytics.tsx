import * as React from "react";
import ReactGA from "react-ga";

export function useAnalytics() {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (window.location.href.includes('pandagrown.com')) {
      ReactGA.initialize('G-GEJSR7PQPY');
    }
    setInitialized(true);
  }, []);

  return {
    initialized
  }
}