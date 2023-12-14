import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { fileSizeDisplay, noop } from 'utils';
import { uploaderConfig } from 'configs';
import { useKeyDown } from 'hooks';

import { BusyLoader, Icon, Image, Button, Tooltip } from 'components';

import Preview from './Preview';

import './index.scss';
import { useImgDownload } from '../../../../hooks';
import { getLastMod } from '../uploadUtils';

function UploadedItem({
    notUploadedFileList,
    uploadErrorText,
    metaDataHeaders,
    customHeaders,
    appearance,
    retryIndex,
    onRemove,
    showTrash,
    onRetry,
    isBusy,
    index,
    file,
    showDownloadButton,
    showRemoveButton,
    showResetButton,
    showPreviewButton,
    additionalContext,
    hideName
}) {
    const [previewImage, setPreviewImage] = useState(null);
    const [lastModifiedDate, setLastModifiedDate] = useState(null);

    const toPreview = useCallback((image) => {
        if (file.blob.type.search('pdf') > -1) {
            const link = document.createElement('a');
            link.href = file.path;
            link.target = '_blank';
            link.click();
        } else {
            setPreviewImage(image);
        }
    }, []);
    const doClosePreview = useCallback(() => setPreviewImage(null), []);

    useKeyDown(doClosePreview, [], { current: window }, ['Escape']);

    const {
        name,
        blob: { size, type },
        path,
        dimensions
    } = file;

    useEffect(() => {
        switch (metaDataHeaders?.type) {
            case 'LAST-MODIFIED':
                if (metaDataHeaders.formatter) {
                    getLastMod(path, (date) => {
                        date
                            ? setLastModifiedDate(metaDataHeaders.formatter(date))
                            : setLastModifiedDate(metaDataHeaders.formatter(new Date(Date.now())));
                    });
                } else {
                    getLastMod(path, (date) => {
                        date
                            ? setLastModifiedDate(new Date(date).toLocaleDateString())
                            : setLastModifiedDate(new Date(Date.now()).toLocaleDateString());
                    });
                }

                break;
            default:
                break;
        }
    }, [file]);

    const uploadedError = notUploadedFileList.find((item) => item && item.file === file);
    const [image, fileExtension] = type.split('/');
    const isImage = image === 'image';

    const renderPreview = () => {
        switch (appearance) {
            case uploaderConfig.uploadedItemsAppearance[0]:
                return <Icon type="bc-icon-attachment" />;
            case uploaderConfig.uploadedItemsAppearance[1]:
                return (
                    <>
                        <Icon type="bc-icon-file-type" />
                        <small>{fileExtension}</small>
                    </>
                );
            case uploaderConfig.uploadedItemsAppearance[2]:
                return isImage ? (
                    <img src={path} alt={name} />
                ) : (
                    <>
                        <Icon type="bc-icon-file-type" />
                        <small>{fileExtension}</small>
                    </>
                );
        }
    };

    const onDownload = useImgDownload();

    return previewImage ? (
        <Preview onClose={doClosePreview} previewImage={previewImage} hideName={hideName} />
    ) : (
        <BusyLoader isBusy={isBusy && retryIndex === index} loadingText="">
            <Tooltip title={uploadedError ? uploadErrorText : ''} text={(uploadedError && uploadedError.error) || ''}>
                {appearance === uploaderConfig.uploadedItemsAppearance[3] && isImage ? (
                    <Image
                        src={path}
                        withBorder
                        isValid={!uploadedError}
                        actions={
                            <>
                                {uploadedError && showResetButton ? (
                                    <Button
                                        icon="bc-icon-reset"
                                        appearance="minimal"
                                        data-index={index}
                                        onClick={onRetry}
                                        type="button"
                                    />
                                ) : (
                                    showPreviewButton && (
                                        <Button
                                            icon="bc-icon-view"
                                            appearance="minimal"
                                            onClick={() => toPreview(file)}
                                            type="button"
                                        />
                                    )
                                )}
                                {showRemoveButton && (
                                    <Button
                                        icon="bc-icon-trash"
                                        data-index={index}
                                        onClick={onRemove}
                                        appearance="minimal"
                                        color="danger"
                                        type="button"
                                    />
                                )}
                            </>
                        }
                    />
                ) : (
                    <ul
                        className={classnames('uploaded-item', `ui-${appearance}`, {
                            error: uploadedError
                        })}
                    >
                        <li className="ui-preview-holder">{renderPreview()}</li>
                        <li className="ui-title">
                            <div className="ellipsis-text">{name}</div>
                        </li>
                        <li className="ui-actions-holder">
                            <small>{lastModifiedDate || fileSizeDisplay(size)}</small>
                            {uploadedError && showResetButton && (
                                <Icon type="bc-icon-upload-reset" data-index={index} onClick={onRetry} />
                            )}
                            {showPreviewButton && (
                                <Icon
                                    type="bc-icon-activate"
                                    appearance="minimal"
                                    data-index={index}
                                    onClick={() => toPreview(file)}
                                />
                            )}
                            {showRemoveButton && (
                                <Icon type="bc-icon-trash" appearance="minimal" data-index={index} onClick={onRemove} />
                            )}
                            {showDownloadButton && (
                                <Icon
                                    type="bc-icon-download"
                                    appearance="minimal"
                                    data-index={index}
                                    onClick={() => onDownload(file.path, file.name, customHeaders)}
                                />
                            )}
                        </li>
                    </ul>
                )}
            </Tooltip>
        </BusyLoader>
    );
}

UploadedItem.propTypes = {
    file: PropTypes.object,
    index: PropTypes.number,
    isBusy: PropTypes.bool,
    showTrash: PropTypes.bool,
    notUploadedFileList: PropTypes.array,
    onRemove: PropTypes.func,
    onRetry: PropTypes.func,
    retryIndex: PropTypes.number,
    uploadErrorText: PropTypes.string,
    appearance: PropTypes.oneOf(uploaderConfig.uploadedItemsAppearance),
    showDownloadButton: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
    showResetButton: PropTypes.bool,
    showPreviewButton: PropTypes.bool
};

UploadedItem.defaultProps = {
    appearance: uploaderConfig.uploadedItemsAppearance[0],
    isBusy: false,
    uploadErrorText: 'Upload Error',
    onRetry: noop,
    onRemove: noop,
    showDownloadButton: true,
    showRemoveButton: true,
    showResetButton: true,
    showPreviewButton: true
};

export default UploadedItem;
