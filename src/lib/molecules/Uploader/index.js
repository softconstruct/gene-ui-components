import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { uploaderConfig } from 'configs';
import { noop, stopEvent } from 'utils';

import { Row, Col, Button, ExtendedInput } from 'components';
import {
    generateFilesByPage,
    removeDragEventListener,
    addDragEventListener,
    maxFileSizeReplacer,
    typeListReplacer,
    getFileByUrl,
    isValidFile,
    toBlobFile
} from './uploadUtils';


import UploadedItem from './uploadedItem';
import UploadView from './uploadView';

import './index.scss';

const lowGrid = 10;
const highGrid = 20;

function Uploader({
    immediatelyUploadAfterSelect,
    uploadedItemsAppearance,
    informationMessage,
    uploaderAppearance,
    inputCornerRadius,
    allTypesAccepted,
    startUploadLabel,
    noFileChosenText,
    chooseFileLabel,
    getInitialState,
    showLocalErrors,
    metaDataHeaders,
    showDownloadButton,
    showResetButton,
    showPreviewButton,
    uploadErrorText,
    uploadingLabel,
    fileChosenText,
    fileAppearance,
    customHeaders,
    isImageUpload,
    dropHereLabel,
    maxFileCount,
    cornerRadius,
    deleteAction,
    sizeErrorMsg,
    typeErrorMsg,
    isActiveDrop,
    loadingLabel,
    browseLabel,
    maxFileSize,
    isDisabled,
    typesList,
    showTrash,
    className,
    draggText,
    onChange,
    required,
    multiple,
    isValid,
    upload,
    icon,
    data,
    initialData,
    images,
    initialImages,
    additionalContext,
    hideName,
    ...restProps
}) {
    const isControlled = useMemo(() => Array.isArray(images), [images]);
    const dropRef = useRef(null);
    const [fileList, setFileList] = useState(generateFilesByPage(initialImages));
    const [deletedFileList, setDeletedFileList] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [notUploadedFileList, setNotUploadedFileList] = useState([]);
    const [draggable, setDraggable] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [refreshIndex, setRefreshIndex] = useState(null);
    const [valid, setValidation] = useState(true);

    useEffect(() => {
        isControlled && setFileList(generateFilesByPage(images));
    }, [isControlled, images]);

    useEffect(() => getInitialState && getInitialState(valid), [getInitialState, valid]);

    useEffect(() => setValidation(required ? !!fileList.length : true), [fileList, required]);

    useEffect(() => {
        if (Array.isArray(data)) {
            if (data && data.length > 0) {
                setIsBusy(true);
                Promise.all([...data.map((file) => getFileByUrl(file.path, file, isImageUpload, customHeaders))])
                    .then((res) => {
                        setFileList(res);
                    })
                    .finally(() => setIsBusy(false));
            } else {
                setFileList([]);
            }
        }
    }, [data, isImageUpload]);

    const startUpload = useCallback(
        (uploadedFiles, deletedFiles) => {
            setIsBusy(true);

            return new Promise((resolve, reject) => {
                upload({ uploadedFiles, deletedFiles })
                    .then(resolve)
                    .catch(reject)
                    .finally(() => setIsBusy(false));
            });
        },
        [upload]
    );

    const fileChangeHandler = useCallback(
        (newList, del) => {
            !isControlled &&
                (!multiple || del) &&
                setFileList((prev) => (maxFileCount >= prev.length ? newList : prev));
            !isControlled &&
                multiple &&
                !del &&
                setFileList((prev) => (maxFileCount > prev.length ? [newList[0], ...prev] : prev));
            onChange({ value: newList });
        },
        [isControlled, onChange]
    );

    const checkFileValidation = useCallback(
        (file) => {
            if (file.size) {
                const { isValidSize, isValidType } = isValidFile({
                    allTypesAccepted,
                    isImageUpload,
                    maxFileSize,
                    typesList,
                    file
                });
                if (showLocalErrors) {
                    const msg = isValidSize
                        ? isValidType
                            ? ''
                            : typeErrorMsg.replace(typeListReplacer, typesList.join(', '))
                        : sizeErrorMsg.replace(maxFileSizeReplacer, maxFileSize);

                    setErrorMsg(msg);
                }

                return isValidSize && isValidType;
            }
        },
        [allTypesAccepted, isImageUpload, maxFileSize, typesList, showLocalErrors, typeErrorMsg, sizeErrorMsg]
    );

    const addFile = useCallback(
        async (file) => {
            if (checkFileValidation(file)) {
                const blobFile = await toBlobFile(file, isImageUpload);
                const newList = maxFileCount ? [blobFile, ...fileList].slice(0, maxFileCount) : [blobFile, ...fileList];
                if (immediatelyUploadAfterSelect && upload) {
                    startUpload(newList, deletedFileList)
                        .catch((error) => {
                            setNotUploadedFileList([{ file: blobFile, error }, ...notUploadedFileList]);
                        })
                        .finally(() => {
                            fileChangeHandler(newList, false);
                        });
                } else {
                    fileChangeHandler(newList, false);
                }
            }
        },
        [
            checkFileValidation,
            isImageUpload,
            maxFileCount,
            fileList.length,
            immediatelyUploadAfterSelect,
            upload,
            startUpload,
            deletedFileList,
            notUploadedFileList,
            fileChangeHandler
        ]
    );

    const handleDrop = useCallback(
        (e) => {
            stopEvent(e, true);
            setDraggable(false);

            const {
                dataTransfer: { files = [] }
            } = e;

            if (isActiveDrop && files.length) {
                addFile(files[0]);
            }
        },
        [isActiveDrop, addFile]
    );

    const handleDragIn = useCallback((e) => {
        stopEvent(e, true);
        e.dataTransfer.items.length && setDraggable(true);
    }, []);

    const handleDragOut = useCallback((e) => {
        stopEvent(e, true);
        setDraggable(false);
    }, []);

    useEffect(() => {
        const div = dropRef.current;

        if (div && !isBusy) {
            addDragEventListener(div, handleDragIn, handleDragOut, handleDrop);

            return () => {
                removeDragEventListener(div, handleDragIn, handleDragOut, handleDrop);
            };
        }
    }, [handleDrop, dropRef.current, isBusy]);

    const onUpload = useCallback(
        (e) => {
            for (const file in e.target.files) addFile(e.target.files[file]);
            e.target.value = null;
        },
        [addFile]
    );

    const doUpload = useCallback(
        (e) => {
            stopEvent(e, true);

            if (upload && fileList.length) {
                setNotUploadedFileList([]);
                startUpload(fileList, deletedFileList)
                    .then(({ fileErrors }) => {
                        fileErrors && setNotUploadedFileList([...fileErrors]);
                    })
                    .catch(() => setNotUploadedFileList([...fileList]));
            }
        },
        [upload, fileList, startUpload, deletedFileList]
    );

    const deleteItemByIndex = useCallback(
        (e) => {
            const { index } = e.currentTarget.dataset;
            const newList = [...fileList];

            newList.splice(index, 1);

            if (data && data.find((file) => file.id === (fileList[index] && fileList[index].id))) {
                setDeletedFileList([...deletedFileList, fileList[index]]);
                if (isImageUpload) {
                    deleteAction(fileList[index]);
                }
            }

            fileChangeHandler(newList, true);
        },
        [fileList, data, fileChangeHandler, deletedFileList, isImageUpload, deleteAction]
    );

    const uploadRefresh = useCallback(
        (e) => {
            const { index } = e.currentTarget.dataset;
            const file = fileList[index];

            if (file && upload) {
                setRefreshIndex(Number(index));
                startUpload(file, deletedFileList)
                    .then(() => {
                        const newList = notUploadedFileList.filter((notUploaded) => notUploaded.file !== file);
                        setNotUploadedFileList(newList);
                    })
                    .finally(() => setRefreshIndex(null));
            }
        },
        [startUpload, notUploadedFileList, fileList, upload, deletedFileList]
    );

    const isBoxApperance = uploaderAppearance === uploaderConfig.uploaderAppearance[3];
    const gridGap = isBoxApperance ? highGrid : lowGrid;
    const isExistFile = !!fileList.length;

    return (
        <div className={classnames('uploader-holder', `ua-${uploaderAppearance}`, className)} {...restProps}>
            {!isBoxApperance && (
                <div
                    className={classnames('uploader-header', {
                        'only-child': !isExistFile
                    })}
                >
                    <UploadView
                        appearance={uploaderAppearance}
                        immediatelyUploadAfterSelect={immediatelyUploadAfterSelect}
                        onUpload={onUpload}
                        ref={dropRef}
                        draggable={draggable}
                        icon={icon}
                        cornerRadius={cornerRadius}
                        isDisabled={isDisabled}
                        isBusy={isBusy}
                        chooseFileLabel={chooseFileLabel}
                        browseLabel={browseLabel}
                        startUploadLabel={startUploadLabel}
                        dropHereLabel={dropHereLabel}
                        loadingLabel={loadingLabel}
                        isValid={isValid}
                        typesList={typesList}
                        multiple={multiple}
                    />
                </div>
            )}
            {(isExistFile || isBoxApperance) && (
                <Row padding={gridGap} gutter={gridGap}>
                    {fileList.map((file, index) => (
                        <Col {...uploaderConfig.gridColumnSize} key={index}>
                            <UploadedItem
                                file={file}
                                index={index}
                                isBusy={isBusy}
                                onRetry={uploadRefresh}
                                retryIndex={refreshIndex}
                                showRemoveButton={showTrash}
                                onRemove={deleteItemByIndex}
                                uploadErrorText={uploadErrorText}
                                showResetButton={showResetButton}
                                metaDataHeaders={metaDataHeaders}
                                appearance={uploadedItemsAppearance}
                                showPreviewButton={showPreviewButton}
                                additionalContext={additionalContext}
                                showDownloadButton={showDownloadButton}
                                notUploadedFileList={notUploadedFileList}
                                customHeaders={customHeaders}
                                hideName={hideName}
                            />
                        </Col>
                    ))}
                    {isBoxApperance && (
                        <Col {...uploaderConfig.gridColumnSize}>
                            <UploadView appearance={uploadedItemsAppearance} />
                        </Col>
                    )}
                </Row>
            )}
            <div className="uploader-footer">
                {(informationMessage || (showLocalErrors && errorMsg)) && (
                    <div
                        className={classnames('information-message', {
                            'color-danger': !!errorMsg
                        })}
                    >
                        {errorMsg || informationMessage}
                    </div>
                )}
                {!immediatelyUploadAfterSelect &&
                    isExistFile &&
                    uploaderAppearance !== uploaderConfig.uploaderAppearance[1] && (
                        <div className="uploader-footer-button">
                            <Button onClick={doUpload} disabled={isDisabled || isBusy} cornerRadius={cornerRadius}>
                                {startUploadLabel}
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    );
}

Uploader.propTypes = {
    /**
     * Disable type check
     */
    allTypesAccepted: PropTypes.bool,
    /**
     * Browse label text
     */
    browseLabel: PropTypes.string,
    /**
     * Choose file label text
     */
    chooseFileLabel: PropTypes.string,
    /**
     * Your custom className, for div
     */
    className: PropTypes.string,
    /**
     * Button corner radius
     */
    cornerRadius: Button.propTypes.cornerRadius,
    /**
     * ExtendedInput corner radius
     */
    inputCornerRadius: ExtendedInput.propTypes.cornerRadius,
    /**
     * Default data for loaded items. The data array should have:
     * path - URL to file/image,
     * name - file/image display name,
     * id - unique identifier,
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string,
            name: PropTypes.string,
            id: PropTypes.number
        })
    ),
    /**
     * Delete action to process delete default data deleteAction((file: deletedFile) => void)
     */
    deleteAction: PropTypes.func,
    /**
     * Drop here label text
     */
    dropHereLabel: PropTypes.string,
    /**
     * Size error message. If in the string you write MAX_FILE_SIZE it will be replaced maxFileSize prop.
     */
    sizeErrorMsg: PropTypes.string,
    /**
     * Type error message. If in the string you write TYPE_LIST it will be replaced typesList prop.
     */
    typeErrorMsg: PropTypes.string,
    getInitialState: PropTypes.func,
    /**
     * Upload holder icon
     */
    icon: PropTypes.string,
    /**
     * Immediate upload after selecting or using the "Start Upload" button.
     */
    immediatelyUploadAfterSelect: PropTypes.bool,
    /**
     * Information message text
     */
    informationMessage: PropTypes.string,
    /**
     * Activation drugover
     */
    isActiveDrop: PropTypes.bool,
    /**
     * Disable uploader
     */
    isDisabled: PropTypes.bool,
    /**
     * Enable image upload mode
     */
    isImageUpload: PropTypes.bool,
    /**
     * Loading label text
     */
    loadingLabel: PropTypes.string,
    /**
     * Max upload file size in bytes
     */
    maxFileSize: PropTypes.number,
    /**
     * File list changes handling onChange((files: fileList) => void);
     */
    onChange: PropTypes.func,
    /**
     * Required file
     */
    required: PropTypes.bool,
    /**
     * Show local validation errors
     */
    showLocalErrors: PropTypes.bool,
    /**
     * Start upload label text
     */
    startUploadLabel: PropTypes.string,
    /**
     * Array of upload item types
     */
    typesList: PropTypes.arrayOf(PropTypes.string),
    /**
     * Upload file function, upload((files: {uploadedFiles, deletedFiles}) => Promise);
     */
    upload: PropTypes.func,
    /**
     * Uploaded items appearance
     */
    uploadedItemsAppearance: PropTypes.oneOf(uploaderConfig.uploadedItemsAppearance),
    /**
     * Uploader appearance
     */
    uploaderAppearance: PropTypes.oneOf(uploaderConfig.uploaderAppearance),
    /**
     * Upload error text showing in tooltip
     */
    uploadErrorText: PropTypes.string,
    /**
     * Maximum upload file count
     */
    maxFileCount: PropTypes.number,
    /**
     * Control Uploader validation.
     */
    isValid: PropTypes.bool,
    /**
     * Show/Hide trash icon
     */
    showTrash: PropTypes.bool,
    /**
     * Show/Hide Reset icon
     */
    showResetButton: PropTypes.bool,
    /**
     * Show/Hide Preview icon
     */
    showPreviewButton: PropTypes.bool,
    /**
     * Show/Hide Download icon
     */
    showDownloadButton: PropTypes.bool,
    /**
     * initialImages - an array of URL strings. Use to specify the initial value of the component.
     *
     * NOTE: previously, data property could be used to handle the component value. Now, instead
     * of using entire image objects, you can use just URL strings with images and initialImages props
     */
    initialImages: PropTypes.arrayOf(PropTypes.string),
    /**
     * images - an array of URL strings; required for a controlled component
     */
    images: PropTypes.arrayOf(PropTypes.string),
    /**
     * change files size with any custom string.
     */
    additionalContext: PropTypes.string,
    /**
     * multi file upload option.
     */
    multiple: PropTypes.bool,
    /**
     * This is for fetch image for example through this prop you can pass token.
     * Provide an Object that will spread in Request Headers:{...customHeaders} in second parameter for fetch function.
     * For example { 'Content-Type': 'application/json'} it will convert fetch(URL,{headers{'Content-Type': 'application/json'}})
     */
    customHeaders: PropTypes.object,
    /**
     * set true to hide image name from preview mode.
     */
    hideName: PropTypes.bool,
    /**
     * metaDataHeaders is an object where type can be "LAST-MODIFIED"  (for future requirement can be added new types) and
     * formatter that returns callback function with 'last modified data string' parameter that can be formatted  and returned.
     * {
     *   type: "LAST-MODIFIED",
     *   formatter:(date)=>{return new Date(date).toLocaleDateString()}
     * }
     */
    metaDataHeaders: PropTypes.shape({
        type: PropTypes.string,
        formatter: PropTypes.func
    })
};

Uploader.defaultProps = {
    allTypesAccepted: true,
    browseLabel: 'Browse',
    chooseFileLabel: 'Upload File',
    cornerRadius: Button.defaultProps.cornerRadius,
    inputCornerRadius: ExtendedInput.defaultProps.cornerRadius,
    dropHereLabel: 'Drop here',
    sizeErrorMsg: `File must be smaller than ${maxFileSizeReplacer} bytes.`,
    typeErrorMsg: `You can only upload ${typeListReplacer} File.`,
    immediatelyUploadAfterSelect: true,
    isActiveDrop: false,
    isDisabled: false,
    isImageUpload: false,
    loadingLabel: 'Uploading...',
    maxFileSize: 5000000,
    required: false,
    showTrash: true,
    showDownloadButton: true,
    showResetButton: true,
    showPreviewButton: true,
    showLocalErrors: false,
    startUploadLabel: 'Start Upload',
    typesList: [],
    uploadedItemsAppearance: uploaderConfig.uploadedItemsAppearance[0],
    uploaderAppearance: uploaderConfig.uploaderAppearance[0],
    uploadErrorText: 'Upload Error',
    onChange: noop,
    isValid: true,
    hideName: false
};

export default Uploader;
