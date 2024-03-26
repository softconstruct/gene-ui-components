import React, { useState, FC } from 'react';
import { Meta } from '@storybook/react';

//helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import ImagePreviewComponent, { IImagePreviewProps } from './index';
//@ts-ignore
import ButtonComponent from 'src/lib/atoms/Button/index';

const meta: Meta<typeof ImagePreviewComponent> = {
    title: 'Atoms/ImagePreview',
    component: ImagePreviewComponent,
    argTypes: {
        onClose: args({ control: false, ...propCategory.action }),
        name: args({ control: 'text', ...propCategory.content }),
        path: args({ control: 'text', ...propCategory.content }),
        showSize: args({ control: 'boolean', defaultValue: true, ...propCategory.functionality }),
        showDownload: args({ control: 'boolean', defaultValue: true, ...propCategory.functionality }),
        showRotate: args({ control: 'boolean', defaultValue: true, ...propCategory.functionality }),
        showDimensions: args({ control: 'boolean', defaultValue: true, ...propCategory.functionality }),
        withMagnifier: args({ control: 'boolean', defaultValue: false, ...propCategory.functionality }),
        withModal: args({ control: 'boolean', defaultValue: true, ...propCategory.functionality }),
        magnifierDefaultValue: args({ control: 'boolean', defaultValue: false, ...propCategory.states }),
        isMobile: args({ control: 'boolean', defaultValue: false, ...propCategory.appearance }),
        customHeaders: args({ control: false, ...propCategory.content })
    },
    args: {
        name: 'Hand',
        showSize: true,
        isMobile: false,
        withModal: true,
        showRotate: true,
        showDownload: true,
        withMagnifier: true,
        showDimensions: true,
        path: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80'
    }
};

export default meta;

const Template: FC<IImagePreviewProps> = (args) => {
    let [show, setShow] = useState(true);

    return show ? (
        <ImagePreviewComponent {...args} onClose={() => setShow(false)} />
    ) : (
        <div>
            <span style={{ textAlign: 'center', margin: '15px' }}>no image to show</span>
            <ButtonComponent onClick={() => setShow(true)} style={{ marginTop: '15px' }}>
                Show image modal
            </ButtonComponent>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    withModal: false
};

export const WithModal = Template.bind({});
