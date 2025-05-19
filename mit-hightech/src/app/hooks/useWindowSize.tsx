import { useCallback, useState } from "react";
import useEventListener from "./useEventListener";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const handleSize = useCallback(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEventListener("resize", handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize(); // Initial size set
  }, [handleSize]);

  return windowSize;
}

export default useWindowSize;
