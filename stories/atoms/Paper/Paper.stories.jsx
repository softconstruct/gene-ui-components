import React from 'react';
import './index.scss';

import { paperWraps, alignItems, justifyContents, paperDirections, cornersRadius } from 'src/lib/atoms/Paper/index';

import PaperComponent from 'src/lib/atoms/Paper/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Paper',
    component: PaperComponent,
    argTypes: {
        padding: args({ control: 'number', category: category.appearance }),
        paperDirection: args({ control: 'select', defaultValue: paperDirections[0], category: category.appearance }),
        paperWrap: args({ control: 'select', defaultValue: paperWraps[0], category: category.appearance }),
        justifyContent: args({ control: 'select', defaultValue: justifyContents[0], category: category.appearance }),
        cornerRadius: args({ control: 'select', defaultValue: cornersRadius[0], category: category.appearance }),
        children: args({ control: false, category: category.content }),
        className: args({ control: false, category: category.others }),
        alignItems: args({ control: 'select', defaultValue: alignItems[0], category: category.appearance }),
        shadow: args({ control: 'boolean', category: category.appearance }),
        border: args({ control: 'boolean', category: category.appearance }),
        isTransparent: args({ control: 'boolean', category: category.appearance })
    }
};

const Template = ({ ...args }) => (
    <PaperComponent {...args}>
        <div className="fake-paper-placeholder">Item 1</div>
        <div className="fake-paper-placeholder">Item 2</div>
    </PaperComponent>
);

export const Paper = Template.bind({});
Paper.args = {
    padding: 0,
    paperDirection: paperDirections[0],
    paperWrap: paperWraps[0],
    justifyContent: justifyContents[0],
    alignItems: alignItems[0],
    cornerRadius: cornersRadius[0],
    shadow: false,
    border: false,
    isTransparent: false
};
