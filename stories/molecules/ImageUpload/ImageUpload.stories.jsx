import React, { useState } from 'react';

import UploaderComponent from 'src/lib/molecules/Uploader';
import Tabs from 'src/lib/molecules/Tabs/Tabs';
import Tab from 'src/lib/molecules/Tabs/Tab';
import { uploaderConfig } from '../../../src/configs';
import { args, category } from '../../assets/storybook.globals';

const action = { category: category.action };
const states = { category: category.states };
const others = { category: category.others };
const content = { category: category.content };
const validation = { category: category.validation };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

const configs = {
    cornerRadius: ['round', 'smooth'],
    inputCornerRadius: ['full-radius', 'smooth-radius']
};

export default {
    title: 'Molecules/ImageUpload',
    component: UploaderComponent,
    argTypes: {
        upload: args({ control: false, ...action }),
        icon: args({ control: 'text', ...content }),
        data: args({ control: 'object', ...content }),
        onChange: args({ control: false, ...action }),
        images: args({ control: 'array', ...content }),
        className: args({ control: false, ...others }),
        typesList: args({ control: 'array', ...states }),
        required: args({ control: 'boolean', ...states }),
        deleteAction: args({ control: false, ...action }),
        browseLabel: args({ control: 'text', ...content }),
        maxFileSize: args({ control: 'number', ...states }),
        loadingLabel: args({ control: 'text', ...content }),
        isDisabled: args({ control: 'boolean', ...states }),
        isValid: args({ control: 'boolean', ...validation }),
        maxFileCount: args({ control: 'number', ...states }),
        dropHereLabel: args({ control: 'text', ...content }),
        getInitialState: args({ control: false, ...action }),
        initialImages: args({ control: 'array', ...content }),
        chooseFileLabel: args({ control: 'text', ...content }),
        isImageUpload: args({ control: 'boolean', ...states }),
        customHeaders: args({ control: 'object', ...content }),
        sizeErrorMsg: args({ control: 'text', ...validation }),
        typeErrorMsg: args({ control: 'text', ...validation }),
        startUploadLabel: args({ control: 'text', ...content }),
        multiple: args({ control: 'boolean', ...functionality }),
        additionalContext: args({ control: 'text', ...content }),
        hideName: args({ control: 'boolean', ...functionality }),
        allTypesAccepted: args({ control: 'boolean', ...states }),
        uploadErrorText: args({ control: 'text', ...validation }),
        informationMessage: args({ control: 'text', ...content }),
        showTrash: args({ control: 'boolean', ...functionality }),
        isActiveDrop: args({ control: 'boolean', ...functionality }),
        showLocalErrors: args({ control: 'boolean', ...validation }),
        metaDataHeaders: args({ control: 'object', ...functionality }),
        showResetButton: args({ control: 'boolean', ...functionality }),
        showPreviewButton: args({ control: 'boolean', ...functionality }),
        showDownloadButton: args({ control: 'boolean', ...functionality }),
        immediatelyUploadAfterSelect: args({ control: 'boolean', ...functionality }),
        cornerRadius: args({ control: 'select', options: configs.inputCornerRadius, ...appearance }),
        inputCornerRadius: args({ control: 'select', options: configs.inputCornerRadius, ...appearance }),
        uploaderAppearance: args({ control: 'select', options: uploaderConfig.uploaderAppearance, ...appearance }),
        uploadedItemsAppearance: args({
            control: 'select',
            options: uploaderConfig.uploadedItemsAppearance,
            ...appearance
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
        initialImages: ['https://picsum.photos/800/1200', 'https://picsum.photos/200/300']
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
