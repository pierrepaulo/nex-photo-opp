import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  startValue: number;
  onComplete: () => void;
}

export function useCountdown({ startValue, onComplete }: UseCountdownOptions) {
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const reset = useCallback(() => {
    setCurrentValue(null);
    setIsActive(false);
    firedRef.current = false;
  }, []);

  const start = useCallback(() => {
    firedRef.current = false;
    setCurrentValue(startValue);
    setIsActive(true);
  }, [startValue]);

  useEffect(() => {
    if (!isActive || currentValue === null) {
      return;
    }

    if (currentValue <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        /* eslint-disable react-hooks/set-state-in-effect -- estado final do countdown */
        setIsActive(false);
        setCurrentValue(null);
        /* eslint-enable react-hooks/set-state-in-effect */
        onCompleteRef.current();
      }
      return;
    }

    const id = window.setTimeout(() => {
      setCurrentValue((v) => (v === null ? null : v - 1));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [isActive, currentValue]);

  return { currentValue, isActive, start, reset };
}
