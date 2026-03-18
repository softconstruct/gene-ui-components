import { useEffect, useRef, useState } from "react";

interface IUseCountdownOptions {
    /** Duration in seconds to count down from. */
    duration: number;
    /** Callback fired when countdown reaches zero. */
    onExpire?: () => void;
}

interface IUseCountdownReturn {
    /** Remaining seconds. */
    remaining: number;
    /** Formatted time string as `MM:SS`. */
    formatted: string;
    /** Whether the countdown has expired (reached zero). */
    isExpired: boolean;
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const useCountdown = ({ duration, onExpire }: IUseCountdownOptions): IUseCountdownReturn => {
    const [remaining, setRemaining] = useState(duration);
    const onExpireRef = useRef(onExpire);

    onExpireRef.current = onExpire;

    useEffect(() => {
        setRemaining(duration);
    }, [duration]);

    /* eslint consistent-return: off */
    useEffect(() => {
        if (remaining <= 0) {
            onExpireRef.current?.();
            return;
        }

        const intervalId = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [remaining, duration]);

    return {
        remaining,
        formatted: formatTime(remaining),
        isExpired: remaining <= 0
    };
};

export default useCountdown;
