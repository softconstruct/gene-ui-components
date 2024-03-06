import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, category } from '../../../../stories/assets/storybook.globals';

//@ts-ignore
import Icon from 'src/lib/atoms/Icon/index';

//@ts-ignore
//Components
import Label from 'src/lib/atoms/Label/index';
import PopoverComponent, { IPopoverProps } from './Popover';

//@ts-ignore
import Empty from 'src/lib/atoms/Empty/index';

//@ts-ignore
//Cpnfigs
import { screenTypes, popoverConfig } from 'configs';

//Styles
import './Popover.stories.scss';

const meta: Meta<typeof PopoverComponent> = {
    title: 'Atoms/Popover',
    component: PopoverComponent,
    argTypes: {
        Content: args({ control: false, category: category.content }),
        children: args({ control: false, category: category.content }),
        screenType: args({ control: 'select', options: screenTypes, category: category.appearance }),
        behave: args({
            control: 'select',
            options: popoverConfig.behave,
            defaultValue: popoverConfig.behave[0],
            category: category.functionality
        }),
        Header: args({ control: 'text', category: category.content }),
        Footer: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        extendTargetWidth: args({ control: 'boolean', category: category.appearance }),
        disabled: args({ control: 'boolean', category: category.states }),
        disableReposition: args({ control: false, category: category.states }),
        scrollbarNeeded: args({ control: false, category: category.functionality }),
        position: args({
            control: 'select',
            options: popoverConfig.position,
            defaultValue: popoverConfig.position[0],
            category: category.appearance
        }),
        minHeight: args({ control: 'number', category: category.appearance }),
        maxHeight: args({ control: 'number', category: category.appearance }),
        padding: args({ control: 'number', category: category.appearance }),
        align: args({
            control: 'select',
            options: popoverConfig.align,
            defaultValue: popoverConfig.align[7],
            category: category.appearance
        }),
        cornerRadius: args({
            control: 'select',
            options: popoverConfig.cornerRadius,
            defaultValue: popoverConfig.cornerRadius[0],
            category: category.appearance
        }),
        toggleHandler: { action: 'toggleHandler', ...args({ control: false, category: category.action }) },
        getScrollRef: args({ control: false, category: category.others }),
        contentRef: args({ control: false, category: category.others }),
        isOpen: args({ control: 'boolean', category: category.states }),
        swipeable: args({ control: false, category: category.functionality }),
        onSwipedDown: args({ control: false, category: category.action }),
        scrollbarProps: args({ control: false, category: category.others }),
        fullHeight: args({ control: 'boolean', category: category.appearance })
    },
    args: {
        Header: <Label children="Header text" font="semiBold" size="heading" />,
        Footer: <Label children="Footer text" font="semiBold" size="heading" />,
        Content: <Empty withImage={true} />,
        className: '',
        extendTargetWidth: true,
        fullHeight: false,
        disableReposition: true,
        scrollbarNeeded: true,
        minHeight: 40,
        maxHeight: 650,
        padding: 10,
        disabled: false,
        position: popoverConfig.position[0],
        align: popoverConfig.align[7],
        cornerRadius: popoverConfig.cornerRadius[0],
        behave: popoverConfig.behave[0]
    }
};

const Template: FC<IPopoverProps> = ({ ...args }) => (
    <div className="popoverWrapper">
        <PopoverComponent {...args} extendTargetWidth={false}>
            <Icon type="bc-icon-apps" />
        </PopoverComponent>{' '}
    </div>
);

export const Default = Template.bind({});
Default.args = {
    screenType: screenTypes[0]
};

export const Mobile = Template.bind({});
Mobile.args = {
    screenType: screenTypes[1]
};

export default meta;
