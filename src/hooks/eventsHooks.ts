import { useCallback, useEffect, useRef } from "react";

// Saves incoming handler to the ref in order to avoid "useCallback hell"
export function useEventCallback<T, K>(handler?: (value: T, event: K) => void): (value: T, event: K) => void {
  const callbackRef = useRef(handler);

  useEffect(() => {
    callbackRef.current = handler;
  });

  return useCallback((value: T, event: K) => callbackRef.current && callbackRef.current(value, event), []);
}