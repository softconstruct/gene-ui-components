import React, { useState } from 'react';

//Helpers
import { args, propCategory } from '../../assets/storybook.globals';

// Components
import UploaderComponent from 'src/lib/molecules/Uploader';
import Tabs from 'src/lib/molecules/Tabs/Tabs';
import Tab from 'src/lib/molecules/Tabs/Tab';

// Configs
import { uploaderConfig } from '../../../src/configs';
const configs = {
    cornerRadius: ['round', 'smooth'],
    inputCornerRadius: ['full-radius', 'smooth-radius']
};

export default {
    title: 'Molecules/ImageUpload',
    component: UploaderComponent,
    argTypes: {
        upload: args({ control: false, ...propCategory.action }),
        icon: args({ control: 'text', ...propCategory.content }),
        data: args({ control: 'object', ...propCategory.content }),
        onChange: args({ control: false, ...propCategory.action }),
        images: args({ control: 'array', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        typesList: args({ control: 'array', ...propCategory.states }),
        required: args({ control: 'boolean', ...propCategory.states }),
        deleteAction: args({ control: false, ...propCategory.action }),
        browseLabel: args({ control: 'text', ...propCategory.content }),
        maxFileSize: args({ control: 'number', ...propCategory.states }),
        loadingLabel: args({ control: 'text', ...propCategory.content }),
        isDisabled: args({ control: 'boolean', ...propCategory.states }),
        isValid: args({ control: 'boolean', ...propCategory.validation }),
        maxFileCount: args({ control: 'number', ...propCategory.states }),
        dropHereLabel: args({ control: 'text', ...propCategory.content }),
        getInitialState: args({ control: false, ...propCategory.action }),
        initialImages: args({ control: 'array', ...propCategory.content }),
        chooseFileLabel: args({ control: 'text', ...propCategory.content }),
        isImageUpload: args({ control: 'boolean', ...propCategory.states }),
        customHeaders: args({ control: 'object', ...propCategory.content }),
        sizeErrorMsg: args({ control: 'text', ...propCategory.validation }),
        typeErrorMsg: args({ control: 'text', ...propCategory.validation }),
        startUploadLabel: args({ control: 'text', ...propCategory.content }),
        multiple: args({ control: 'boolean', ...propCategory.functionality }),
        additionalContext: args({ control: 'text', ...propCategory.content }),
        hideName: args({ control: 'boolean', ...propCategory.functionality }),
        allTypesAccepted: args({ control: 'boolean', ...propCategory.states }),
        uploadErrorText: args({ control: 'text', ...propCategory.validation }),
        informationMessage: args({ control: 'text', ...propCategory.content }),
        showTrash: args({ control: 'boolean', ...propCategory.functionality }),
        isActiveDrop: args({ control: 'boolean', ...propCategory.functionality }),
        showLocalErrors: args({ control: 'boolean', ...propCategory.validation }),
        metaDataHeaders: args({ control: 'object', ...propCategory.functionality }),
        showResetButton: args({ control: 'boolean', ...propCategory.functionality }),
        showPreviewButton: args({ control: 'boolean', ...propCategory.functionality }),
        showDownloadButton: args({ control: 'boolean', ...propCategory.functionality }),
        immediatelyUploadAfterSelect: args({ control: 'boolean', ...propCategory.functionality }),
        cornerRadius: args({ control: 'select', options: configs.inputCornerRadius, ...propCategory.appearance }),
        inputCornerRadius: args({ control: 'select', options: configs.inputCornerRadius, ...propCategory.appearance }),
        uploaderAppearance: args({
            control: 'select',
            options: uploaderConfig.uploaderAppearance,
            ...propCategory.appearance
        }),
        uploadedItemsAppearance: args({
            control: 'select',
            options: uploaderConfig.uploadedItemsAppearance,
            ...propCategory.appearance
        })
    },
    args: {
        className: '',
        isValid: true,
        multiple: true,
        required: false,
        hideName: false,
        showTrash: true,
        maxFileCount: 5,
        isDisabled: false,
        isActiveDrop: true,
        maxFileSize: 3000000,
        isImageUpload: false,
        showLocalErrors: true,
        showResetButton: true,
        icon: 'bc-icon-upload1',
        allTypesAccepted: false,
        showPreviewButton: true,
        showDownloadButton: true,
        browseLabel: 'browseLabel',
        loadingLabel: 'loadingLabel',
        sizeErrorMsg: 'sizeErrorMsg',
        typeErrorMsg: 'typeErrorMsg',
        dropHereLabel: 'dropHereLabel',
        typesList: ['png', 'jpg', 'jpeg'],
        chooseFileLabel: 'chooseFileLabel',
        uploadErrorText: 'uploadErrorText',
        immediatelyUploadAfterSelect: false,
        startUploadLabel: 'startUploadLabel',
        cornerRadius: configs.cornerRadius[0],
        informationMessage: 'informationMessage',
        inputCornerRadius: configs.inputCornerRadius[0],
        uploaderAppearance: uploaderConfig.uploaderAppearance[0],
        uploadedItemsAppearance: uploaderConfig.uploadedItemsAppearance[2],
        initialImages: ['https://picsum.photos/id/237/800/1200', 'https://picsum.photos/id/236/200/300']
    }
};

export const Default = ({ ...args }) => <UploaderComponent {...args} />;
export const ControlledUploader = ({ ...args }) => {
    let [images, setImages] = useState({
        first: [],
        second: [],
        third: []
    });
    return (
        <>
            <Tabs type="box" position="left" defaultActiveKey="first">
                <Tab key="first" title="First">
                    <UploaderComponent
                        uploaderAppearance="cloud"
                        uploadedItemsAppearance="box"
                        data={images.first}
                        onChange={({ value }) => setImages((prev) => ({ ...prev, first: value }))}
                        {...args}
                    />
                </Tab>
                <Tab key="second" title="Second">
                    <UploaderComponent
                        uploaderAppearance="cloud"
                        uploadedItemsAppearance="box"
                        data={images.second}
                        onChange={({ value }) => setImages((prev) => ({ ...prev, second: value }))}
                        {...args}
                    />
                </Tab>
                <Tab key="third" title="Third">
                    <UploaderComponent
                        uploaderAppearance="cloud"
                        uploadedItemsAppearance="box"
                        images={images.third}
                        onChange={({ value }) =>
                            setImages((prev) => ({ ...prev, third: value.map(({ path }) => path) }))
                        }
                        {...args}
                    />
                </Tab>
            </Tabs>
        </>
    );
};
ControlledUploader.args = {
    uploaderAppearance: 'cloud',
    uploadedItemsAppearance: 'box'
};
