import { useCallback, useEffect, useState } from "preact/hooks";

/**
 * useProgressiveNumber — animates a numeric value toward a target over time.
 *
 * Works like a tweened store: each tick advances `current` by `step` until it
 * reaches `target`. The animation reruns whenever `target` changes, smoothly
 * transitioning from whatever the current value is.
 *
 * Closure note: `target` is captured inside the `setValue` callback via the
 * dependency array. When `setValue` is called with a function updater
 * `(prevTarget) => newTarget`, the closure always refers to the most recent
 * `target` at call time — not a stale snapshot.
 *
 * Why `step` is derived: rather than using a fixed increment, `step` is
 * recalculated on each `setValue` call as `|diff| / steps` where
 * `steps = duration / delay`. This keeps the animation duration constant
 * regardless of the magnitude of the change.
 *
 * @param initialValue — starting number (or a lazy initializer function)
 * @param duration     — total animation duration in milliseconds (default 1500)
 * @param decimals     — number of decimal places to round to (default 0)
 * @param delay        — interval tick length in ms (default 50)
 * @returns [current, setValue] — current display value and setter
 */
export const useProgressiveNumber = (
  initialValue: number | (() => number),
  duration = 1500,
  decimals = 0,
  delay = 50,
): [number, (value: number | ((prevTarget: number) => number)) => void] => {
  const [target, setTarget] = useState(initialValue);
  const [current, setCurrent] = useState(initialValue);
  const [step, setStep] = useState(0);

  const setValue = useCallback(
    (value: number | ((prevTarget: number) => number)) => {
      setCurrent((prevCurrent) => {
        const nextTarget = typeof value === "function" ? value(target) : value;
        const diff = Math.abs(prevCurrent - nextTarget);
        const steps = Math.max(duration / delay, 1);
        const nextStep = diff / steps;

        setStep(nextStep);
        setTarget(nextTarget);

        return prevCurrent + (prevCurrent < nextTarget ? nextStep : -nextStep);
      });
    },
    [delay, duration, target],
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrent((prevCurrent) => {
          if (Math.abs(target - prevCurrent) < step) {
            clearInterval(interval);
            return target;
          }
          return prevCurrent + (prevCurrent < target ? step : -step);
        }),
      delay,
    );

    return () => clearInterval(interval);
  }, [delay, step, target]);

  const value = Number(current.toFixed(decimals));

  return [value, setValue];
};
