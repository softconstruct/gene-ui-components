import React, { useState } from 'react';

import ImagePreviewComponent from 'src/lib/atoms/ImagePreview/index';
import ButtonComponent from 'src/lib/atoms/Button/index';

import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/ImagePreview',
    component: ImagePreviewComponent,
    argTypes: {
        onClose: args({ control: false, category: category.action }),
        name: args({ control: 'text', category: category.content }),
        path: args({ control: 'text', category: category.content }),
        showSize: args({ control: 'boolean', category: category.functionality }),
        showDownload: args({ control: 'boolean', category: category.functionality }),
        showRotate: args({ control: 'boolean', category: category.functionality }),
        showDimensions: args({ control: 'boolean', category: category.functionality }),
        withMagnifier: args({ control: 'boolean', category: category.functionality }),
        withModal: args({ control: 'boolean', category: category.functionality }),
        magnifierDefaultValue: args({ control: 'boolean', category: category.states }),
        isMobile: args({ control: 'boolean', category: category.appearance }),
        customHeaders: args({ control: false, category: category.content })
    },
    args: {
        name: 'Hand',
        showSize: true,
        isMobile: false,
        showRotate: true,
        showDownload: true,
        withMagnifier: true,
        showDimensions: true,
        path: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80'
    }
};

const Template = ({ ...args }) => {
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
    withModal: false,
    magnifierDefaultValue: true
};

export const WithModal = Template.bind({});
WithModal.args = {
    withModal: true
};
