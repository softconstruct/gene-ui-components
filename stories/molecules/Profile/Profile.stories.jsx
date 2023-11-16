import React, { useCallback, useEffect, useState } from 'react';

import ProfileComponent from 'src/lib/molecules/Profile';
import { avatarProps, menuOptions, languages, partners } from './data';
import { args, category } from '../../assets/storybook.globals';

const screenTypes = ['desktop', 'mobile'];

export default {
    title: 'Molecules/Profile',
    component: ProfileComponent,
    argTypes: {
        email: args({ control: 'text', category: category.content }),
        username: args({ control: 'text', category: category.content }),
        isOpen: args({ control: 'boolean', category: category.states }),
        tabIndex: args({ control: 'number', category: category.others }),
        showIcon: args({ control: 'boolean', category: category.states }),
        menuProps: args({ control: 'object', category: category.content }),
        languages: args({ control: 'object', category: category.content }),
        partners: args({ control: 'object', category: category.content }),
        tooltipText: args({ control: 'text', category: category.content }),
        tooltipTitle: args({ control: 'text', category: category.content }),
        padding: args({ control: 'number', category: category.appearance }),
        userSelect: args({ control: 'boolean', category: category.states }),
        avatarProps: args({ control: 'object', category: category.content }),
        tooltipProps: args({ control: 'object', category: category.content }),
        popoverClassName: args({ control: false, category: category.others }),
        containerParent: args({ control: false, category: category.appearance }),
        screenType: args({ control: 'select', options: screenTypes, category: category.appearance }),
        toggleHandler: args({ control: false, action: 'toggleHandler', category: category.action }),
        onOutsideClick: args({ control: false, action: 'onOutsideClick', category: category.action })
    },
    args: {
        showIcon: true,
        userSelect: false,
        email: 'example@mail.com',
        tooltipTitle: 'Some title',
        screenType: screenTypes[0],
        tooltipText: 'Some tooltip text',
        username: 'username@username.com'
    }
};

export const Profile = ({ ...args }) => {
    const [activeLanguage, setActiveLanguage] = useState('ru');
    const [activePartner, setActivePartner] = useState('1');

    const languageChangeHandler = (id) => {
        setActiveLanguage(id);
    };
    const partnerChangeHandler = (id) => {
        setActivePartner(id);
    };

    return (
        <div style={{ width: 'fit-content' }}>
            <ProfileComponent
                menuProps={{ data: menuOptions }}
                username={args.username}
                email={args.email}
                showIcon={args.showIcon}
                avatarProps={avatarProps}
                tooltipProps={
                    (args.tooltipText &&
                        args.tooltipTitle && {
                            title: args.tooltipTitle,
                            text: args.tooltipText
                        }) ||
                    {}
                }
                languages={{
                    title: 'Languages',
                    maxHeight: 300,
                    data: languages,
                    active: activeLanguage,
                    onSelect: languageChangeHandler
                }}
                partners={{
                    title: 'Partners',
                    maxHeight: 300,
                    data: partners,
                    active: activePartner,
                    noDataText: 'No data to display',
                    onSelect: partnerChangeHandler
                }}
                {...args}
            />
        </div>
    );
};
