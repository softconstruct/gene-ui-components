import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { fileSizeDisplay, noop } from 'utils';
import { useImgDownload } from 'hooks';

import classnames from 'classnames';

import './index.scss';
import { Tooltip, Icon, Switcher } from 'components';
import useEllipsisDetection from '../../../hooks/useEllipsisDetection';

import Magnifier from './Magnifier';

function ImagePreview({
    name,
    path,
    onClose,
    showSize,
    isMobile,
    withModal,
    showRotate,
    showDownload,
    customHeaders,
    showDimensions,
    withMagnifier,
    magnifierDefaultValue,
    ...rest
}) {
    const magnifierRef = useRef();
    const downloadImg = useImgDownload();

    const [meta, setMeta] = useState({
        size: 0,
        width: 0,
        height: 0
    });

    const [isMagnifierOn, setIsMagnifierOn] = useState(magnifierDefaultValue);
    const [imageData, setImageData] = useState('');
    const nameRef = useRef(null);
    const isTruncated = useEllipsisDetection(nameRef);

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

    return (
        <div className={classnames('imagePreview', { 'modal-view': withModal, 'mobile-view': isMobile })} {...rest}>
            <div className="imagePreview__header">
                <div className="imagePreview__infoWrapper">
                    <Icon type="bc-icon-Image" className="imagePreview__icon imagePreview__imgIcon" />
                    <div
                        className={classnames('imagePreview__info', {
                            'imagePreview__info-center': !showSize && !showDimensions
                        })}
                    >
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
                                defaultChecked={magnifierDefaultValue}
                                value={isMagnifierOn}
                                onChange={(e) => setIsMagnifierOn(e.currentTarget.checked)}
                                labelPosition="left"
                                label="Magnifier"
                            />
                        </div>
                    )}
                    {showRotate && (
                        <div className="imagePreview__rotate">
                            <Icon
                                type="bc-icon-rotate-left"
                                className="imagePreview__icon"
                                onClick={() => magnifierRef.current.rotate(-90)}
                            />
                            <Icon
                                type="bc-icon-rotate-right"
                                className="imagePreview__icon"
                                onClick={() => magnifierRef.current.rotate(90)}
                            />
                        </div>
                    )}
                    {showDownload && (
                        <div className="imagePreview__download">
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
                            <Icon type="bc-icon-close" className="imagePreview__icon" onClick={onClose} />
                        </div>
                    )}
                </div>
            </div>
            <div className="imagePreview__content">
                {withModal ? (
                    <>
                        <div className="imagePreview__background" onClick={onClose} />
                        {imageData && (
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
                        )}
                    </>
                ) : (
                    imageData && (
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
                    )
                )}
            </div>
        </div>
    );
}

ImagePreview.defaultProps = {
    onClose: noop,
    showSize: true,
    isMobile: false,
    withModal: true,
    showRotate: true,
    showDownload: true,
    withMagnifier: false,
    showDimensions: true,
    magnifierDefaultValue: false
};

ImagePreview.propTypes = {
    /**
     * Image file display name
     */
    name: PropTypes.string,
    /**
     * Image path to display
     */
    path: PropTypes.string.isRequired,
    /**
     * Event fires when click on close button
     */
    onClose: PropTypes.func,
    /**
     * Need to size or not
     */
    showSize: PropTypes.bool,
    /**
     * Need to download or not
     */
    showDownload: PropTypes.bool,
    /**
     * Need to rotate or not
     */
    showRotate: PropTypes.bool,
    /**
     * Need to dimensions or not
     */
    showDimensions: PropTypes.bool,
    /**
     * With magnifier functionality
     */
    withMagnifier: PropTypes.bool,
    /**
     * modal mode
     */
    withModal: PropTypes.bool,
    /**
     * Default magnifier Value switched On
     */
    magnifierDefaultValue: PropTypes.bool,
    /**
     * This is for fetch image for example through this prop you can pass token.
     * Provide an Object that will spread in Request Headers:{...customHeaders} in second parameter for fetch function.
     * For example { 'Content-Type': 'application/json'} it will convert fetch(URL,{headers{'Content-Type': 'application/json'}})
     */
    customHeaders: PropTypes.object,
    /**
     * The prop is responsible for header view and alignment for mobile device
     */
    isMobile: PropTypes.bool
};

export default ImagePreview;
