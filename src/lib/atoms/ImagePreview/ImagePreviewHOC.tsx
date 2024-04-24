import React, { FC } from 'react';

// Components
import Portal from '../Portal';
import ImagePreview, { IImagePreviewProps } from './ImagePreview';

const ImagePreviewHOC: FC<IImagePreviewProps> = ({ withModal, ...restProps }) => {
    return withModal ? (
        // @ts-ignore
        <Portal isOpen>
            <ImagePreview {...restProps} withModal={withModal} />
        </Portal>
    ) : (
        <ImagePreview {...restProps} withModal={withModal} />
    );
};

export { IImagePreviewProps, ImagePreviewHOC as default };
