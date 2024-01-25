import React, { useMemo, forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Helpers
import { uploaderConfig } from 'configs';

// Components
import Button from '../../../atoms/Button';
import Icon from '../../../atoms/Icon';
import BusyLoader from '../../../atoms/BusyLoader';
import ExtendedInput from '../../ExtendedInput';

// Styles
import './index.scss';

const UploadView = forwardRef(
    (
        {
            immediatelyUploadAfterSelect,
            inputCornerRadius,
            startUploadLabel,
            chooseFileLabel,
            dropHereLabel,
            cornerRadius,
            loadingLabel,
            browseLabel,
            appearance,
            isDisabled,
            className,
            draggable,
            typesList,
            onUpload,
            multiple,
            isValid,
            isBusy,
            icon,
            ...restProps
        },
        ref
    ) => {
        const handleChange = useCallback(
            (e) => {
                onUpload && onUpload(e);
                e.target.value = '';
            },
            [onUpload]
        );

        const acceptTypes = useMemo(() => typesList.map((type) => `.${type}`).toString(), [typesList]);

        const dirty = false;

        const renderUploadHolder = () => {
            const placeholder = isBusy ? loadingLabel : chooseFileLabel;

            switch (appearance) {
                case uploaderConfig.uploaderAppearance[0]:
                    return (
                        <Button
                            appearance="outline"
                            cornerRadius={cornerRadius}
                            color={isValid ? '' : 'danger'}
                            icon={isBusy ? 'bc-icon-loader' : icon}
                        >
                            {placeholder}
                        </Button>
                    );
                case uploaderConfig.uploaderAppearance[1]:
                    return (
                        <>
                            <ExtendedInput
                                cornerRadius={inputCornerRadius}
                                placeholder={placeholder}
                                inputSize="big"
                                writeProtected
                                colorBorderOnError
                                isValid={isValid}
                            />
                            {dirty && immediatelyUploadAfterSelect ? (
                                <Button
                                    cornerRadius={cornerRadius}
                                    size="big"
                                    icon={isBusy ? 'bc-icon-loader' : ''}
                                    color={isValid ? '' : 'danger'}
                                >
                                    {startUploadLabel}
                                </Button>
                            ) : (
                                <Button
                                    cornerRadius={cornerRadius}
                                    size="big"
                                    icon={isBusy ? 'bc-icon-loader' : ''}
                                    color={isValid ? 'confirm' : 'danger'}
                                >
                                    {browseLabel}
                                </Button>
                            )}
                        </>
                    );
                case uploaderConfig.uploaderAppearance[2]:
                    return (
                        <div
                            className={classnames('cloud-box-uploader', {
                                error: !isValid
                            })}
                        >
                            {isBusy ? (
                                <p>{loadingLabel}</p>
                            ) : (
                                <>
                                    <Icon type={icon || 'bc-icon-cloud-upload'} />
                                    <h5>{chooseFileLabel}</h5>
                                    <small>or</small>
                                    <Button cornerRadius={cornerRadius} color={isValid ? '' : 'danger'}>
                                        {browseLabel}
                                    </Button>
                                </>
                            )}
                        </div>
                    );
                case uploaderConfig.uploaderAppearance[3]:
                    return (
                        <div
                            className={classnames('box-uploader', {
                                error: !isValid
                            })}
                        >
                            <BusyLoader isBusy={isBusy} loadingText={loadingLabel} className="p-absolute">
                                <div className="responsive-plus-icon-holder">
                                    <div className="responsive-plus-icon" />
                                </div>
                                <h5>{chooseFileLabel}</h5>
                            </BusyLoader>
                        </div>
                    );
            }
        };

        return (
            <ul
                className={classnames('drop-area-holder', className, `ua-${appearance}`, {
                    active: draggable,
                    disabled: isDisabled,
                    'pointer-events-none s-uploading': isBusy
                })}
                ref={ref}
                {...restProps}
            >
                <label
                    className={classnames('uploader-chooser-holder', {
                        dirty
                    })}
                >
                    {renderUploadHolder()}
                    <input
                        type="file"
                        onChange={handleChange}
                        disabled={isDisabled}
                        accept={acceptTypes}
                        title=""
                        multiple={multiple}
                    />
                </label>
                {!isDisabled && (
                    <div className={classnames('drop-here-element', `cr-${cornerRadius}`)}>
                        <p className="ellipsis-text">{dropHereLabel}</p>
                    </div>
                )}
            </ul>
        );
    }
);

UploadView.propTypes = {
    appearance: PropTypes.oneOf(uploaderConfig.uploaderAppearance),
    immediatelyUploadAfterSelect: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
    draggable: PropTypes.bool,
    icon: PropTypes.string,
    cornerRadius: Button.propTypes.cornerRadius,
    inputCornerRadius: ExtendedInput.propTypes.cornerRadius,
    isDisabled: PropTypes.bool,
    isBusy: PropTypes.bool,
    chooseFileLabel: PropTypes.string,
    browseLabel: PropTypes.string,
    startUploadLabel: PropTypes.string,
    dropHereLabel: PropTypes.string,
    loadingLabel: PropTypes.string,
    className: PropTypes.string,
    isValid: PropTypes.bool,
    typesList: PropTypes.arrayOf(PropTypes.string)
};

UploadView.defaultProps = {
    appearance: uploaderConfig.uploaderAppearance[0],
    immediatelyUploadAfterSelect: true,
    draggable: false,
    cornerRadius: Button.defaultProps.cornerRadius,
    inputCornerRadius: ExtendedInput.defaultProps.cornerRadius,
    isDisabled: false,
    isBusy: false,
    chooseFileLabel: 'Upload File',
    browseLabel: 'Browse',
    startUploadLabel: 'Start Upload',
    dropHereLabel: 'Drop here',
    loadingLabel: 'Uploading...',
    typesList: [],
    isValid: true,
    multiple: false
};

export default UploadView;
