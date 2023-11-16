import React from 'react';

import UploaderComponent from 'src/lib/molecules/Uploader';
import { inputConfig, uploaderConfig } from '../../../src/configs';
import { args, category } from '../../assets/storybook.globals';

const uploadConfig = {
    appearance: ['appearance-1', 'appearance-2', 'appearance-3'],
    types: [
        ['png', 'jpg', 'jpeg'],
        ['jpg', 'jpeg']
    ]
};

const ButtonConfig = {
    itemsDirection: ['start', 'end'],
    cornerRadius: ['round', 'smooth'],
    size: ['default', 'medium', 'big'],
    color: ['primary', 'confirm', 'danger', 'default'],
    flexibility: ['default', 'content-size', 'full-width'],
    appearance: ['default', 'outline', 'minimal', 'grayscale', 'clean']
};

const action = { category: category.action };
const states = { category: category.states };
const others = { category: category.others };
const content = { category: category.content };
const appearance = { category: category.appearance };
const validation = { category: category.validation };
const functionality = { category: category.functionality };
const startUpload = ({ uploadedFiles }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() >= 0.5
                ? resolve({
                      fileErrors: [
                          {
                              file: uploadedFiles[1] || uploadedFiles[0],
                              error: 'File must be smaller than 4MB.'
                          }
                      ]
                  })
                : reject();
        }, 3000);
    });
};
export default {
    title: 'Molecules/FileUploader',
    component: UploaderComponent,
    argTypes: {
        icon: args({ control: 'text', ...content }),
        data: args({ control: 'object', ...content }),
        images: args({ control: 'array', ...content }),
        className: args({ control: false, ...others }),
        draggText: args({ control: 'text', ...content }),
        multiple: args({ control: 'boolean', ...states }),
        typesList: args({ control: 'object', ...states }),
        required: args({ control: 'boolean', ...states }),
        hideName: args({ control: 'boolean', ...states }),
        browseLabel: args({ control: 'text', ...content }),
        typeErrorMsg: args({ control: 'text', ...content }),
        loadingLabel: args({ control: 'text', ...content }),
        isValid: args({ control: 'boolean', ...validation }),
        customHeaders: args({ control: 'text', ...content }),
        dropHereLabel: args({ control: 'text', ...content }),
        fileChosenText: args({ control: 'text', ...content }),
        uploadingLabel: args({ control: 'text', ...content }),
        initialImages: args({ control: 'array', ...content }),
        chooseFileLabel: args({ control: 'text', ...content }),
        sizeErrorMsg: args({ control: 'text', ...validation }),
        noFileChosenText: args({ control: 'text', ...content }),
        startUploadLabel: args({ control: 'text', ...content }),
        additionalContext: args({ control: 'text', ...content }),
        informationMessage: args({ control: 'text', ...content }),
        showTrash: args({ control: 'boolean', ...functionality }),
        uploadErrorText: args({ control: 'text', ...validation }),
        maxFileSize: args({ control: 'number', ...functionality }),
        isDisabled: args({ control: 'boolean', ...functionality }),
        getInitialState: args({ control: false, ...functionality }),
        maxFileCount: args({ control: 'number', ...functionality }),
        showLocalErrors: args({ control: 'boolean', ...validation }),
        isActiveDrop: args({ control: 'boolean', ...functionality }),
        upload: args({ control: false, action: 'upload', ...action }),
        isImageUpload: args({ control: 'boolean', ...functionality }),
        showResetButton: args({ control: 'boolean', ...functionality }),
        allTypesAccepted: args({ control: 'boolean', ...functionality }),
        onChange: args({ control: false, action: 'onChange', ...action }),
        showPreviewButton: args({ control: 'boolean', ...functionality }),
        showDownloadButton: args({ control: 'boolean', ...functionality }),
        deleteAction: args({ control: false, action: 'deleteAction', ...action }),
        immediatelyUploadAfterSelect: args({ control: 'boolean', ...functionality }),
        cornerRadius: args({ control: 'select', options: ButtonConfig.cornerRadius, ...appearance }),
        inputCornerRadius: args({ control: 'select', options: inputConfig.cornerRadius, ...appearance }),
        uploaderAppearance: args({ control: 'select', options: uploaderConfig.uploaderAppearance, ...appearance }),
        uploadedItemsAppearance: args({ control: 'select', options: uploaderConfig.uploaderAppearance, ...appearance })
    },
    args: {
        icon: '',
        maxFileCount: 2,
        showTrash: true,
        isDisabled: false,
        isActiveDrop: true,
        upload: startUpload,
        maxFileSize: 5000000,
        browseLabel: 'Browse',
        showResetButton: true,
        showLocalErrors: true,
        allTypesAccepted: true,
        showDownloadButton: true,
        showPreviewButton: true,
        deleteAction: startUpload,
        dropHereLabel: 'Drop here',
        loadingLabel: 'Uploading...',
        fileChosenText: 'File chosen',
        uploadingLabel: 'Uploading...',
        chooseFileLabel: 'Upload File',
        uploadErrorText: 'Upload Error',
        startUploadLabel: 'Start Upload',
        typesList: uploadConfig.types[0],
        draggText: 'Drag and Drop a file.',
        noFileChosenText: 'No file chosen',
        immediatelyUploadAfterSelect: true,
        informationMessage: 'Core File Uploader',
        cornerRadius: ButtonConfig.cornerRadius[0],
        typeErrorMsg: 'You can only upload TYPE_LIST.',
        inputCornerRadius: inputConfig.cornerRadius[0],
        uploaderAppearance: uploaderConfig.uploaderAppearance[0],
        sizeErrorMsg: 'Must be smaller than MAX_FILE_SIZE bytes.',
        uploadedItemsAppearance: uploaderConfig.uploadedItemsAppearance[0]
    }
};

export const FileUploader = ({ ...args }) => <UploaderComponent {...args} />;
