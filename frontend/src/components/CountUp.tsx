import { useEffect, useState, useRef } from "react";

interface CountUpProps {
  value: string | number;
  duration?: number; // duration in ms
}

export default function CountUp({ value, duration = 800 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    const valStr = String(value);
    
    // Parse prefix (e.g., $, +, -, +$)
    const prefixMatch = valStr.match(/^[^0-9.]+/);
    const prefix = prefixMatch ? prefixMatch[0] : "";
    
    // Parse suffix (e.g., %, m, k, " people")
    const suffixMatch = valStr.match(/[^0-9.]+$/);
    const suffix = suffixMatch ? suffixMatch[0] : "";
    
    // Extract core numeric string
    const coreStr = valStr.slice(prefix.length, valStr.length - suffix.length).replace(/,/g, "");
    const targetNum = parseFloat(coreStr);

    if (isNaN(targetNum)) {
      setDisplayValue(valStr);
      return;
    }

    // Detect decimal places
    const decimalIndex = coreStr.indexOf(".");
    const decimals = decimalIndex !== -1 ? coreStr.length - decimalIndex - 1 : 0;

    let startTimestamp: number | null = null;
    const startNum = previousValueRef.current;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const progressPercentage = Math.min(progress / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progressPercentage, 3);
      const currentNum = startNum + easeProgress * (targetNum - startNum);

      // Format the number
      const formattedNum = currentNum.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        const finalFormatted = targetNum.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        setDisplayValue(`${prefix}${finalFormatted}${suffix}`);
        previousValueRef.current = targetNum;
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}
