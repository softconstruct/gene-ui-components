import React, { FC, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

// Helpers
//@ts-ignore
import { fileSizeDisplay, noop } from 'utils';
//@ts-ignore
import { useImgDownload, useEllipsisDetection } from 'hooks';

// Components
import Icon from '../Icon';
import Switcher from '../Switcher';
import Tooltip from '../../molecules/Tooltip';
import Magnifier from './Magnifier';

// Styles
import './ImagePreview.scss';

//Types
import { IMagnifierForwardRef } from './Magnifier';

interface IImagePreviewProps {
    /**
     * Image file display name. <span style="color: red">( Required )</span>
     */
    name?: string;
    /**
     * Image path to display
     */
    path: string;
    /**
     * Event fires when click on close button
     */
    onClose?: (event: MouseEvent) => void;
    /**
     * Need to size or not
     */
    showSize?: boolean;
    /**
     * Need to download or not
     */
    showDownload?: boolean;
    /**
     * Need to rotate or not
     */
    showRotate?: boolean;
    /**
     * Need to dimensions or not
     */
    showDimensions?: boolean;
    /**
     * With magnifier functionality
     */
    withMagnifier?: boolean;
    /**
     * modal mode
     */
    withModal?: boolean;
    /**
     * Default magnifier Value switched On
     */
    magnifierDefaultValue?: boolean;
    /**
     * This is for fetch image for example through this prop you can pass token.
     * Provide an Object that will spread in Request Headers:{...customHeaders} in second parameter for fetch function.
     * For example { 'Content-Type': 'application/json'} it will convert fetch(URL,{headers{'Content-Type': 'application/json'}})
     */
    customHeaders?: HeadersInit;
    /**
     * The prop is responsible for header view and alignment for mobile device
     */
    isMobile?: boolean;
}

const ImagePreview: FC<IImagePreviewProps> = ({
    name,
    path,
    onClose = noop,
    showSize = true,
    isMobile = false,
    withModal = true,
    showRotate = true,
    showDownload = true,
    customHeaders,
    showDimensions = true,
    withMagnifier = false,
    magnifierDefaultValue = true,
    ...rest
}) => {
    const [isMagnifierOn, setIsMagnifierOn] = useState(magnifierDefaultValue);
    const [imageData, setImageData] = useState('');
    const [meta, setMeta] = useState({
        size: 0,
        width: 0,
        height: 0
    });

    const nameRef = useRef<HTMLSpanElement | null>(null);
    const magnifierRef = useRef<IMagnifierForwardRef | null>(null);

    const isTruncated = useEllipsisDetection(nameRef);
    const downloadImg = useImgDownload();

    useEffect(() => {
        !!path &&
            fetch(path, { headers: { ...customHeaders } })
                .then((r) => r.arrayBuffer())
                .then((buffer) => {
                    const img = new Image();
                    const blob = new Blob([buffer], { type: 'image/jpeg' });
                    img.src = URL.createObjectURL(blob);
                    img.onload = () =>
                        setMeta((val) => ({
                            ...val,
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        }));
                    setMeta((val) => ({
                        ...val,
                        size: buffer.byteLength
                    }));
                    setImageData(img.src);
                });
    }, [path]);

    const MagnifierWrapper = imageData && (
        <Magnifier
            ref={magnifierRef}
            imgUrl={imageData}
            name={name}
            zoom={2}
            showMagnifier={isMagnifierOn}
            className="imagePreview__img"
            withRotation
            withMagnifier
        />
    );

    return (
        <div className={classnames('imagePreview', { 'modal-view': withModal, 'mobile-view': isMobile })} {...rest}>
            <div className="imagePreview__header">
                <div className="imagePreview__infoWrapper">
                    {/*@ts-ignore*/}
                    <Icon type="bc-icon-Image" className="imagePreview__icon imagePreview__imgIcon" />
                    <div
                        className={classnames('imagePreview__info', {
                            'imagePreview__info-center': !showSize && !showDimensions
                        })}
                    >
                        {/*@ts-ignore*/}
                        <Tooltip text={name} isVisible={isTruncated}>
                            <span className="imagePreview__name ellipsis-text" ref={nameRef}>
                                {name}
                            </span>
                        </Tooltip>
                        <div className="imagePreview__sizes">
                            {showSize && <span className="imagePreview__weight">{fileSizeDisplay(meta.size)}</span>}
                            {showSize && showDimensions && <div className="imagePreview__divider-small" />}
                            {showDimensions && (
                                <span
                                    className={classnames('imagePreview__resolution', {
                                        'imagePreview__resolution--divider': !showSize
                                    })}
                                >
                                    <span>{meta.width}</span>
                                    <span className="imagePreview__resolution--separate">x</span>
                                    <span>{meta.height}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="imagePreview__options">
                    {withMagnifier && (
                        <div className="imagePreview__magnifier">
                            <Switcher
                                /*@ts-ignore*/
                                defaultChecked={magnifierDefaultValue}
                                value={isMagnifierOn}
                                onChange={(e: FormEvent<HTMLInputElement>) => setIsMagnifierOn(e.currentTarget.checked)}
                                labelPosition="left"
                                label="Magnifier"
                                className="imagePreview__switcher"
                            />
                        </div>
                    )}
                    {showRotate && (
                        <div className="imagePreview__rotate">
                            {/*@ts-ignore*/}
                            <Icon
                                type="bc-icon-rotate-left"
                                className="imagePreview__icon"
                                onClick={() => {
                                    if (!magnifierRef.current?.rotate) return;
                                    magnifierRef.current.rotate(-90);
                                }}
                            />
                            {/*@ts-ignore*/}
                            <Icon
                                type="bc-icon-rotate-right"
                                className="imagePreview__icon"
                                onClick={() => {
                                    if (!magnifierRef.current?.rotate) return;
                                    magnifierRef.current.rotate(90);
                                }}
                            />
                        </div>
                    )}
                    {showDownload && (
                        <div className="imagePreview__download">
                            {/*@ts-ignore*/}
                            <Icon
                                type="bc-icon-download"
                                className="imagePreview__icon"
                                onClick={() => downloadImg(path, name, customHeaders)}
                            />
                        </div>
                    )}
                    {withModal && (
                        <div className="imagePreview__close">
                            <div className="imagePreview__divider" />
                            {/*@ts-ignore*/}
                            <Icon type="bc-icon-close" className="imagePreview__icon" onClick={onClose} />
                        </div>
                    )}
                </div>
            </div>
            <div className="imagePreview__content">
                {withModal ? (
                    <>
                        <div className="imagePreview__background" onClick={onClose} />
                        {MagnifierWrapper}
                    </>
                ) : (
                    MagnifierWrapper
                )}
            </div>
        </div>
    );
};

export { IImagePreviewProps, ImagePreview as default };
