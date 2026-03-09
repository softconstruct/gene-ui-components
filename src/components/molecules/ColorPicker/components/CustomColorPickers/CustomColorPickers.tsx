import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { hexToRgb, rgbToHex } from "../../utils";
import type { RGBA } from "../../ColorPicker";

// Styles
import './CustomColorPickers.scss';

type HexColorPickerProps = {
    color: string;
    onChange: (color: string) => void;
};

type RgbaColorPickerProps = {
    color: RGBA;
    onChange: (color: RGBA) => void;
};

interface HsvColor {
    h: number; // 0 - 360
    s: number; // 0 - 1
    v: number; // 0 - 1
}

const rgbToHsv = (r: number, g: number, b: number): HsvColor => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;

    if (delta !== 0) {
        if (max === rNorm) {
            h = 60 * (((gNorm - bNorm) / delta) % 6);
        } else if (max === gNorm) {
            h = 60 * ((bNorm - rNorm) / delta + 2);
        } else {
            h = 60 * ((rNorm - gNorm) / delta + 4);
        }
    }

    if (h < 0) h += 360;

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h, s, v };
};

const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let rPrime = 0;
    let gPrime = 0;
    let bPrime = 0;

    if (h >= 0 && h < 60) {
        rPrime = c;
        gPrime = x;
    } else if (h >= 60 && h < 120) {
        rPrime = x;
        gPrime = c;
    } else if (h >= 120 && h < 180) {
        gPrime = c;
        bPrime = x;
    } else if (h >= 180 && h < 240) {
        gPrime = x;
        bPrime = c;
    } else if (h >= 240 && h < 300) {
        rPrime = x;
        bPrime = c;
    } else {
        rPrime = c;
        bPrime = x;
    }

    const r = Math.round((rPrime + m) * 255);
    const g = Math.round((gPrime + m) * 255);
    const b = Math.round((bPrime + m) * 255);

    return { r, g, b };
};

const useElementSize = (ref: React.RefObject<HTMLElement>) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const update = () => {
            const rect = element.getBoundingClientRect();
            setSize({
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            });
        };

        update();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }

        const ro = new ResizeObserver(() => update());
        ro.observe(element);
        return () => ro.disconnect();
    }, [ref]);

    return size;
};

const useDrag = (
    ref: React.RefObject<HTMLElement>,
    onChange: (relativeX: number, relativeY?: number) => void
) => {
    const handlePointerDown = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            event.preventDefault();

            const element = ref.current;
            if (!element) return;

            const getPos = (clientX: number, clientY: number) => {
                const rect = element.getBoundingClientRect();
                const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
                const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);

                const relativeX = rect.width === 0 ? 0 : x / rect.width;
                const relativeY = rect.height === 0 ? 0 : y / rect.height;

                onChange(relativeX, relativeY);
            };

            const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
                if ("touches" in moveEvent) {
                    const touch = moveEvent.touches[0];
                    if (!touch) return;
                    getPos(touch.clientX, touch.clientY);
                } else {
                    getPos(moveEvent.clientX, moveEvent.clientY);
                }
            };

            const handleUp = () => {
                window.removeEventListener("mousemove", handleMove as any);
                window.removeEventListener("touchmove", handleMove as any);
                window.removeEventListener("mouseup", handleUp);
                window.removeEventListener("touchend", handleUp);
            };

            window.addEventListener("mousemove", handleMove as any);
            window.addEventListener("touchmove", handleMove as any, { passive: false });
            window.addEventListener("mouseup", handleUp);
            window.addEventListener("touchend", handleUp);

            if ("touches" in event) {
                const touch = event.touches[0];
                if (touch) {
                    getPos(touch.clientX, touch.clientY);
                }
            } else {
                getPos(event.clientX, event.clientY);
            }
        },
        [onChange, ref]
    );

    return handlePointerDown;
};

const HexColorPicker: FC<HexColorPickerProps> = ({ color, onChange }) => {
    const initialRgb = hexToRgb(color) ?? { r: 255, g: 255, b: 255 };
    const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);

    const [hsv, setHsv] = useState<HsvColor>(initialHsv);

    useEffect(() => {
        const rgb = hexToRgb(color);
        if (!rgb) return;
        setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    }, [color]);

    const saturationRef = useRef<HTMLDivElement | null>(null);
    const hueRef = useRef<HTMLDivElement | null>(null);
    const saturationSize = useElementSize(saturationRef);
    const hueSize = useElementSize(hueRef);

    const updateColorFromHsv = (next: HsvColor) => {
        setHsv(next);
        const rgb = hsvToRgb(next.h, next.s, next.v);
        onChange(rgbToHex(rgb));
    };

    const handleSaturationStart = useDrag(saturationRef, (x, y = 0) => {
        const s = Math.min(Math.max(x, 0), 1);
        const v = Math.min(Math.max(1 - y, 0), 1);
        updateColorFromHsv({ ...hsv, s, v });
    });

    const handleHueStart = useDrag(hueRef, (x) => {
        const h = Math.min(Math.max(x, 0), 1) * 360;
        updateColorFromHsv({ ...hsv, h });
    });

    const { h, s, v } = hsv;
    const saturationPointerRadiusPx = 7; // 14px pointer
    const huePointerRadiusPx = 5; // 10px pointer

    const pointerLeft =
        saturationSize.width > 0
            ? `${saturationPointerRadiusPx + s * (saturationSize.width - 2 * saturationPointerRadiusPx)}px`
            : `${s * 100}%`;
    const pointerTop =
        saturationSize.height > 0
            ? `${saturationPointerRadiusPx + (1 - v) * (saturationSize.height - 2 * saturationPointerRadiusPx)}px`
            : `${(1 - v) * 100}%`;
    const huePointerLeft =
        hueSize.width > 0
            ? `${huePointerRadiusPx + (h / 360) * (hueSize.width - 2 * huePointerRadiusPx)}px`
            : `${(h / 360) * 100}%`;

    const hueBackground =
        "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)";

    const saturationBackground = {
        backgroundImage: `
            linear-gradient(0deg, #000, transparent),
            linear-gradient(90deg, #fff, hsl(${h}, 100%, 50%))
        `
    };

    return (
        <div className="colorPalette">
            <div
                className="colorPalette__saturation"
                ref={saturationRef}
                onMouseDown={handleSaturationStart}
                onTouchStart={handleSaturationStart}
                style={saturationBackground}
            >
                <div
                    className="colorPalette__saturation-pointer"
                    style={{
                        left: pointerLeft,
                        top: pointerTop
                    }}
                />
            </div>
            <div
                className="colorPalette__hue"
                ref={hueRef}
                onMouseDown={handleHueStart}
                onTouchStart={handleHueStart}
                style={{ backgroundImage: hueBackground }}
            >
                <div
                    className="colorPalette__hue-pointer"
                    style={{
                        left: huePointerLeft
                    }}
                />
            </div>
        </div>
    );
};

const RgbaColorPicker: FC<RgbaColorPickerProps> = ({ color, onChange }) => {
    const { r, g, b, a } = color;
    const initialHsv = rgbToHsv(r, g, b);

    const [hsv, setHsv] = useState<HsvColor>(initialHsv);
    const [alpha, setAlpha] = useState<number>(a ?? 1);

    useEffect(() => {
        setHsv(rgbToHsv(color.r, color.g, color.b));
        setAlpha(color.a ?? 1);
    }, [color]);

    const saturationRef = useRef<HTMLDivElement | null>(null);
    const hueRef = useRef<HTMLDivElement | null>(null);
    const alphaRef = useRef<HTMLDivElement | null>(null);
    const saturationSize = useElementSize(saturationRef);
    const hueSize = useElementSize(hueRef);
    const alphaSize = useElementSize(alphaRef);

    const emitChange = (nextHsv: HsvColor, nextAlpha: number) => {
        const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
        onChange({ ...rgb, a: nextAlpha });
    };

    const updateHsv = (updater: (prev: HsvColor) => HsvColor) => {
        setHsv((prev) => {
            const next = updater(prev);
            emitChange(next, alpha);
            return next;
        });
    };

    const updateAlpha = (nextAlpha: number) => {
        const clamped = Math.min(Math.max(nextAlpha, 0), 1);
        setAlpha(clamped);
        emitChange(hsv, clamped);
    };

    const handleSaturationStart = useDrag(saturationRef, (x, y = 0) => {
        const s = Math.min(Math.max(x, 0), 1);
        const v = Math.min(Math.max(1 - y, 0), 1);
        updateHsv((prev) => ({ ...prev, s, v }));
    });

    const handleHueStart = useDrag(hueRef, (x) => {
        const h = Math.min(Math.max(x, 0), 1) * 360;
        updateHsv((prev) => ({ ...prev, h }));
    });

    const handleAlphaStart = useDrag(alphaRef, (x) => {
        updateAlpha(Math.min(Math.max(x, 0), 1));
    });

    const { h, s, v } = hsv;

    const saturationPointerRadiusPx = 7; // 14px pointer
    const huePointerRadiusPx = 5; // 10px pointer
    const alphaPointerRadiusPx = 5; // 10px pointer

    const pointerLeft =
        saturationSize.width > 0
            ? `${saturationPointerRadiusPx + s * (saturationSize.width - 2 * saturationPointerRadiusPx)}px`
            : `${s * 100}%`;
    const pointerTop =
        saturationSize.height > 0
            ? `${saturationPointerRadiusPx + (1 - v) * (saturationSize.height - 2 * saturationPointerRadiusPx)}px`
            : `${(1 - v) * 100}%`;
    const huePointerLeft =
        hueSize.width > 0
            ? `${huePointerRadiusPx + (h / 360) * (hueSize.width - 2 * huePointerRadiusPx)}px`
            : `${(h / 360) * 100}%`;
    const alphaPointerLeft =
        alphaSize.width > 0
            ? `${alphaPointerRadiusPx + alpha * (alphaSize.width - 2 * alphaPointerRadiusPx)}px`
            : `${alpha * 100}%`;

    const hueBackground =
        "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)";

    const saturationBackground = {
        backgroundImage: `
            linear-gradient(0deg, #000, transparent),
            linear-gradient(90deg, #fff, hsl(${h}, 100%, 50%))
        `
    };

    const rgbForAlpha = hsvToRgb(h, s, v);
    const alphaGradient = `linear-gradient(90deg, rgba(${rgbForAlpha.r}, ${rgbForAlpha.g}, ${rgbForAlpha.b}, 0) 0%, rgba(${rgbForAlpha.r}, ${rgbForAlpha.g}, ${rgbForAlpha.b}, 1) 100%)`;

    return (
        <div className="colorPalette">
            <div
                className="colorPalette__saturation"
                ref={saturationRef}
                onMouseDown={handleSaturationStart}
                onTouchStart={handleSaturationStart}
                style={saturationBackground}
            >
                <div
                    className="colorPalette__saturation-pointer"
                    style={{
                        left: pointerLeft,
                        top: pointerTop
                    }}
                />
            </div>
            <div
                className="colorPalette__hue"
                ref={hueRef}
                onMouseDown={handleHueStart}
                onTouchStart={handleHueStart}
                style={{ backgroundImage: hueBackground }}
            >
                <div
                    className="colorPalette__hue-pointer"
                    style={{
                        left: huePointerLeft
                    }}
                />
            </div>
            <div
                className="colorPalette__alpha"
                ref={alphaRef}
                onMouseDown={handleAlphaStart}
                onTouchStart={handleAlphaStart}
            >
                <div
                    className="colorPalette__alpha-gradient"
                    style={{ backgroundImage: alphaGradient }}
                />
                <div
                    className="colorPalette__alpha-pointer"
                    style={{
                        left: alphaPointerLeft
                    }}
                />
            </div>
        </div>
    );
};

export { HexColorPicker, RgbaColorPicker };

