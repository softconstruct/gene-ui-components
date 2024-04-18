import React, { useState, useEffect } from 'react';
import customDecorators from './decorators';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { DocsContainer } from './components/DocContainer';
import { themes } from '@storybook/theming';
import { softConstructThem } from './softConstructThem';

import { Title, Subtitle, Description, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/blocks';
import { withTests } from '@storybook/addon-jest';
import results from '../coverage/.jest-test-results.json';

export const decorators = [
    (Story, context) => {
        const { RTL } = context.globals;

        const [dir, setDir] = useState(RTL || 'ltr');
        useEffect(() => {
            setDir(RTL);
        }, [RTL]);
        document.documentElement.dir = dir.toString();
        return customDecorators(Story);
    },
    withTests({ results })
];

export const parameters = {
    docs: {
        container: DocsContainer,
        page: () => (
            <>
                <Title />
                <Subtitle />
                <Description />
                <ArgsTable story={PRIMARY_STORY} />
                <Stories includePrimary />
            </>
        )
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        },
        sort: 'requiredFirst', // 👈 sort type
        hideNoControlsWarning: false
    },
    actions: { argTypesRegex: '^on.*' }, // 👈 The following configuration automatically creates actions for each on argType (which you can either specify manually
    viewport: {
        viewports: INITIAL_VIEWPORTS
    },
    backgrounds: {
        disable: true,
        grid: {
            // Grid control
            cellSize: 20,
            opacity: 1,
            cellAmount: 5,
            offsetX: 10, // default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
            offsetY: 10 // default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
        }
    },
    darkMode: {
        dark: {
            ...themes.dark,
            ...softConstructThem.dark
        },
        light: {
            ...themes.light,
            ...softConstructThem.light
        }
    },
    options: {
        storySort: {
            order: [
                'Introduction',
                'Changelog',
                'Getting started',
                'Atoms',
                'Molecules',
                'Organisms',
                'Charts',
                'Hooks'
            ]
        }
    }
};

export const globalTypes = {
    RTL: {
        name: 'RTL',
        description: 'Controls RTL mode',
        defaultValue: 'LRT',
        toolbar: {
            icon: 'transfer',
            dynamicTitle: true,
            items: [
                { value: 'ltr', right: '⇒', title: 'LTR' },
                { value: 'rtl', right: '⇐', title: 'RTL' }
            ]
        }
    }
};

export const argTypes = {
    componentStage: {
        table: {
            disable: true
        }
    }
};
