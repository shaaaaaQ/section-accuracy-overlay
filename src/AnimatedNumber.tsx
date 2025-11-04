import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

type Props = {
    value: number;
    className?: string;
    decimalPlaces?: number;
};

export default function AnimatedNumber({ value, className, decimalPlaces = 0 }: Props) {
    const motionValue = useMotionValue(value);
    const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });

    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            const fixed = Number(latest.toFixed(decimalPlaces));
            setDisplayValue(Math.round(fixed));
        });
    }, [springValue, decimalPlaces]);

    return (
        <span className={className}>
            {displayValue
                .toLocaleString("en-US", {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                })
                .split("")
                .map((char, i) => (
                    <span
                        key={i}
                        className={/\d/.test(char) ? "font-[KodeMono]" : ""}
                    >
                        {char}
                    </span>
                ))}
        </span>
    );
}