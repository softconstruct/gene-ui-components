import React, { cloneElement, FC, JSX, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
// components
import { QRCodeSVG } from "qrcode.react";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./QRCode.scss";

interface IQRCodeProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The Error Correction Level to use.
     * @see https://www.qrcode.com/en/about/error_correction.html
     * Default value is `L`
     */
    level?: "L" | "M" | "Q" | "H";
    /**
     * The foreground color used to render the QR Code.<br>
     * Possible values: `magenta | secondary | inverse`;
     * Default value is `magenta`
     */
    appearance?: "magenta" | "secondary" | "inverse";
    /**
     * The value to encode into the QR Code.
     * An array of strings can be passed in to represent multiple segments,
     * allowing for optimization of the QR Code structure.
     */
    value: string;
    /**
     * The JSX element to embed in the center of the QR Code.
     * This can be used for branding, such as a logo or an icon.
     * The size of this element will be calculated relative to the parent element.
     */
    EmbeddedIcon?: JSX.Element;
}

/**
 * A QR code component generates and displays a Quick Response (QR) code, a two-dimensional barcode that can be scanned by mobile devices to quickly access information, websites, or applications
 */
const QRCode: FC<IQRCodeProps> = ({ value, level = "L", appearance = "magenta", EmbeddedIcon, className }) => {
    const qrCodeRef = useRef<HTMLDivElement | null>(null);
    const [qrLogoSize, setQrLogoSize] = useState<number>(0);

    const { tokens } = useContext(GeneUIDesignSystemContext);

    const QRForeground = useMemo(() => {
        return {
            magenta: tokens?.GuitSemColorForegroundAccentMagenta,
            secondary: tokens?.GuitSemColorForegroundNeutral2,
            inverse: tokens?.GuitSemColorForegroundInverseNotheme
        };
    }, []);

    useEffect(() => {
        if (!EmbeddedIcon || !qrCodeRef.current) return;

        const { width } = qrCodeRef.current.getBoundingClientRect();

        setQrLogoSize(width);
    }, [EmbeddedIcon, qrCodeRef.current]);

    return (
        <div ref={qrCodeRef} className={classNames("qRCode", className)}>
            <>
                <QRCodeSVG
                    value={value}
                    bgColor="transparent"
                    fgColor={`${QRForeground[appearance]}`}
                    level={level}
                    className={classNames(`qRCode__svg`)}
                    {...(EmbeddedIcon && level !== "L"
                        ? {
                              imageSettings: {
                                  src: "",
                                  width: qrLogoSize * 0.2,
                                  height: qrLogoSize * 0.2,
                                  opacity: 0,
                                  excavate: true
                              }
                          }
                        : {})}
                />
                {!!EmbeddedIcon && level !== "L" && (
                    <div className="qRCode__logo" style={{ "--qr-code-logo-width": `${qrLogoSize * 0.2}px` }}>
                        {cloneElement(EmbeddedIcon, { className: "qRCode__logoSvg", fill: QRForeground[appearance] })}
                    </div>
                )}
            </>
        </div>
    );
};

export { IQRCodeProps, QRCode as default };
