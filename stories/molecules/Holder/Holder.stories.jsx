import React, { useEffect, useRef } from 'react';

import HolderComponent from 'src/lib/molecules/Holder';
import Time from 'src/lib/atoms/Time';
import ExtendedInput from 'src/lib/molecules/ExtendedInput/index';
import Dropdown from 'src/lib/organisms/Dropdown/index';
import './index.scss';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Holder',
    component: HolderComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        onApply: args({ control: false, category: category.action }),
        onReset: args({ control: false, category: category.action }),
        footer: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content }),
        opened: args({ control: 'boolean', category: category.states }),
        resetText: args({ control: 'text', category: category.content }),
        applyText: args({ control: 'text', category: category.content }),
        expandText: args({ control: 'text', category: category.content }),
        disabled: args({ control: 'boolean', category: category.states }),
        withPortal: args({ control: 'boolean', category: category.states }),
        leftIconType: args({ control: 'text', category: category.content }),
        collapseText: args({ control: 'text', category: category.content }),
        rightIconType: args({ control: 'text', category: category.content }),
        position: args({ control: 'select', category: category.appearance }),
        filterIconType: args({ control: 'text', category: category.content }),
        portalContainer: args({ control: false, category: category.content }),
        openedWidth: args({ control: 'text', category: category.appearance }),
        defaultOpened: args({ control: 'boolean', category: category.states }),
        applyDisabled: args({ control: 'boolean', category: category.states }),
        resetDisabled: args({ control: 'boolean', category: category.states }),
        disableOnHover: args({ control: 'boolean', category: category.states })
    },
    args: {
        title: 'Title',
        position: 'left',
        disabled: false,
        withPortal: false,
        defaultOpened: true,
        expandText: 'Expand',
        applyDisabled: false,
        resetDisabled: false,
        disableOnHover: false,
        resetText: 'reset Text',
        applyText: 'Apply text',
        collapseText: 'Collapse',
        filterIconType: 'bc-icon-filter',
        leftIconType: 'bc-icon-arrow-left',
        rightIconType: 'bc-icon-arrow-right',
        children: 'Content of holder, any Valid React element'
    }
};

export const Default = ({ children, ...args }) => {
    return (
        <HolderComponent {...args}>
            {children}
            <Time />
        </HolderComponent>
    );
};
export const FilterHolder = ({ ...args }) => {
    let holRef = useRef(null);
    useEffect(() => {
        console.log(holRef);
    }, []);

    return (
        <HolderComponent {...args}>
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <Dropdown
                checkAllText="Check all"
                clearable
                data={[
                    {
                        label: 'England football clubs',
                        tooltip: {
                            text: 'tooltip Text',
                            title: 'tooltip title'
                        },
                        value: [
                            {
                                label: 'Arsenal',
                                value: 'Arsenal'
                            },
                            {
                                label: 'Chelsea',
                                value: 'Chelsea'
                            }
                        ]
                    },
                    {
                        label: 'Zimbabwe football clubs',
                        value: []
                    },
                    {
                        label: 'single data 01',
                        value: 'single data 01'
                    },
                    {
                        label: 'Italian football clubs',
                        tooltip: {
                            text: 'tooltip Text',
                            title: 'tooltip title'
                        },
                        value: [
                            {
                                label: 'Juventus',
                                value: 'Juventus'
                            },
                            {
                                disabled: true,
                                label: 'Inter',
                                value: 'Inter'
                            },
                            {
                                label: 'Milan',
                                value: 'Milan'
                            }
                        ]
                    },
                    {
                        label: 'single data 02',
                        value: 'single data 02'
                    },
                    {
                        disabled: true,
                        label: 'single data 03',
                        value: 'single data 03'
                    },
                    {
                        label: 'Spain football clubs',
                        value: [
                            {
                                label: 'Real Madrid',
                                value: 'Real Madrid'
                            },
                            {
                                label: 'FC Barcelona',
                                value: 'FC Barcelona'
                            }
                        ]
                    },
                    {
                        label: 'Product0',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value0'
                    },
                    {
                        label: 'Product1',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value1'
                    },
                    {
                        label: 'Product2',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value2'
                    },
                    {
                        label: 'Product3',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value3'
                    },
                    {
                        label: 'Product4',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value4'
                    },
                    {
                        label: 'Product5',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value5'
                    },
                    {
                        label: 'Product6',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value6'
                    },
                    {
                        label: 'Product7',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value7'
                    },
                    {
                        label: 'Product8',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value8'
                    },
                    {
                        label: 'Product9',
                        tag: {
                            appearance: 'light',
                            color: '#47b4a9',
                            cornerRadius: 'smooth-radius',
                            name: 'Hello',
                            size: 'small'
                        },
                        value: 'value9'
                    },
                    {
                        label: 'France football clubs',
                        value: [
                            {
                                label: 'Paris Saint-Germain',
                                value: 'Paris Saint-Germain'
                            }
                        ]
                    }
                ]}
                icon="bc-icon-apps"
                label="Label"
                extendParentScope
                multiSelectCount={5}
                onChange={() => {}}
                onClose={function noRefCheck() {}}
                onOpen={function noRefCheck() {}}
                onScroll={function noRefCheck() {}}
                onScrollEnd={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onSwipedDown={function noRefCheck() {}}
                placeholder="Dropdown title"
                showIconOnValid
                tooltipText="test tooltip"
                unCheckAllText="Uncheck all"
            />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
            <ExtendedInput showIconOnValid={false} colorOnValid={false} placeholder="Simple filter" size="big" />
        </HolderComponent>
    );
};
