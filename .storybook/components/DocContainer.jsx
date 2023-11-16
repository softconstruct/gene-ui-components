import React, { useMemo } from 'react';
import { DocsContainer as BaseContainer } from '@storybook/addon-docs';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from '@storybook/theming';

export const DocsContainer = ({ children, context }) => {
    const dark = useDarkMode();

    const title = useMemo(
        () =>
            context.title[context.title.length - 2] === '-'
                ? context.title.replace(context.title.slice(-2), '')
                : context.title,
        []
    );

    return (
        <BaseContainer
            context={{
                ...context,
                title,
                storyById: (id) => {
                    const storyContext = context.storyById(id);
                    return {
                        ...storyContext,
                        parameters: {
                            ...storyContext?.parameters,
                            docs: {
                                ...storyContext?.parameters?.docs,
                                theme: dark ? themes.dark : themes.light
                            }
                        }
                    };
                }
            }}
        >
            {children}
        </BaseContainer>
    );
};
