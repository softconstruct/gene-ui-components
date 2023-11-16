import React from 'react';

import Button from 'src/lib/atoms/Button/index';
import ToasterComponent from 'src/lib/organisms/Toaster';
import { args, category } from '../../assets/storybook.globals';

const toasterPositions = ['top', 'bottom', 'center', 'left-top', 'left-bottom', 'right-top', 'right-bottom'];

export default {
    title: 'Organisms/Toaster',
    component: ToasterComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        heading: args({ control: 'text', category: category.content }),
        message: args({ control: 'text', category: category.content }),
        description: args({ control: 'text', category: category.content }),
        defaultDuration: args({ control: 'number', category: category.states }),
        iconExists: args({ control: 'boolean', category: category.appearance }),
        additionalHeading: args({ control: 'text', category: category.content }),
        notificationIcon: args({ control: 'text', category: category.appearance }),
        additionalDescription: args({ control: 'text', category: category.content }),
        alertIconIsFilled: args({ control: 'boolean', category: category.appearance }),
        toasterPosition: args({ control: 'select', options: toasterPositions, category: category.appearance }),
        notificationPosition: args({ control: 'select', options: toasterPositions, category: category.appearance })
    },
    args: {
        title: 'title',
        iconExists: true,
        heading: 'heading',
        message: 'message',
        defaultDuration: 2000,
        alertIconIsFilled: false,
        description: 'description',
        toasterPosition: toasterPositions[0],
        additionalHeading: 'Additional Heading',
        notificationPosition: toasterPositions[0],
        additionalDescription: 'Additional Description',
        notificationIcon: 'bc-icon-send-push-notification-block'
    }
};

export let Types = ({
    title,
    message,
    iconExists,
    defaultDuration,
    toasterPosition,
    alertIconIsFilled,
    notificationPosition,
    ...args
}) => {
    return (
        <div>
            <div className="sb-card">
                <div className="sb-c-body">
                    {['warning', 'success', 'info', 'error'].map((item) => (
                        <Button
                            appearance="minimal"
                            size="medium"
                            cornerRadius="smooth"
                            key={item}
                            className="capitalize-text"
                            onClick={() =>
                                ToasterComponent[item]({
                                    title,
                                    message,
                                    duration: defaultDuration,
                                    iconProps: iconExists && {
                                        isFilled: alertIconIsFilled
                                    },
                                    ...args
                                })
                            }
                        >
                            {item}
                        </Button>
                    ))}
                    <ToasterComponent toasterPosition={toasterPosition} notificationPosition={notificationPosition} />
                </div>
            </div>
        </div>
    );
};
Types.argTypes = {
    heading: { table: { disable: true } },
    description: { table: { disable: true } },
    notificationIcon: { table: { disable: true } },
    additionalHeading: { table: { disable: true } },
    notificationPosition: { table: { disable: true } },
    additionalDescription: { table: { disable: true } }
};

export const Notifier = ({ toasterPosition, notificationPosition, defaultDuration, ...args }) => {
    return (
        <div>
            <Button
                appearance="minimal"
                size="medium"
                cornerRadius="smooth"
                onClick={() =>
                    ToasterComponent.notify({
                        duration: defaultDuration,
                        description: 'Notification toaster example',
                        ...args
                    })
                }
            >
                Open notifier
            </Button>
            <ToasterComponent toasterPosition={toasterPosition} notificationPosition={notificationPosition} />
        </div>
    );
};

Notifier.argTypes = {
    message: { table: { disable: true } },
    iconExists: { table: { disable: true } },
    toasterPosition: { table: { disable: true } },
    alertIconIsFilled: { table: { disable: true } }
};
export const WithNoIcon = ({ toasterPosition, notificationPosition, defaultDuration, ...args }) => {
    return (
        <div>
            <Button
                appearance="minimal"
                size="medium"
                cornerRadius="smooth"
                onClick={() =>
                    ToasterComponent.success({
                        title: 'Success',
                        duration: defaultDuration,
                        message: 'Success toaster example',
                        ...args
                    })
                }
            >
                Open success toaster
            </Button>
            <ToasterComponent toasterPosition={toasterPosition} notificationPosition={notificationPosition} />
        </div>
    );
};
WithNoIcon.argTypes = {
    heading: { table: { disable: true } },
    iconExists: { table: { disable: true } },
    description: { table: { disable: true } },
    notificationIcon: { table: { disable: true } },
    alertIconIsFilled: { table: { disable: true } },
    additionalHeading: { table: { disable: true } },
    notificationPosition: { table: { disable: true } },
    additionalDescription: { table: { disable: true } }
};
