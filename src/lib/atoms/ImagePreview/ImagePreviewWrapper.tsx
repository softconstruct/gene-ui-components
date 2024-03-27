import React, { FC } from 'react';

// Components
import Portal from '../Portal';
import ImagePreview from './ImagePreview';

//Types
import { IImagePreviewProps } from './ImagePreview';

const ImagePreviewWrapper: FC<IImagePreviewProps> = ({ withModal, ...restProps }) => {
    return withModal ? (
        <Portal isOpen>
            <ImagePreview {...restProps} withModal={withModal} />
        </Portal>
    ) : (
        <ImagePreview {...restProps} withModal={withModal} />
    );
};

export { IImagePreviewProps, ImagePreviewWrapper as default };
