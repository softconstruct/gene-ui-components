import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { Angry, Annoyed, Smile, Laugh, Meh, Star, Circle } from 'lucide-react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Rating, { IRatingProps } from '.';
import Label from '../Label';

const icons = [Angry, Annoyed, Meh, Smile, Laugh];

const primitive = ['A', 'B', 'C', 'D', 'E'];

const meta: Meta<typeof Rating> = {
    title: 'Atoms/Rating',
    component: Rating,
    argTypes: {
        size: args({ control: 'select', defaultValue: 'small', ...propCategory.appearance }),
        defaultValue: args({ control: 'number', defaultValue: 0, ...propCategory.content }),
        value: args({ control: 'false', ...propCategory.content }),
        color: args({ control: 'color', defaultValue: 'var(--hero)', ...propCategory.appearance }),
        bgColor: args({ control: 'color', defaultValue: 'rgba(var(--hero-rgb), 0.3)', ...propCategory.appearance }),
        count: args({ control: 'number', defaultValue: 5, ...propCategory.appearance }),
        readonly: args({ control: 'boolean', defaultValue: false, ...propCategory.states }),
        character: args({ control: 'text', defaultValue: `SvgSquareIcon`, ...propCategory.appearance }),
        halfAllow: args({ control: 'boolean', defaultValue: false, ...propCategory.states })
    },
    args: {
        count: 5,
        defaultValue: 0
    } as IRatingProps
};
export default meta;

const Template: FC<IRatingProps> = ({ ...args }) => {
    return <Rating {...args} />;
};

const TemplateControlled: FC<IRatingProps> = ({ ...args }) => {
    const [rating, setRating] = useState(0);
    const recall = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    const [recallState, setRecallState] = useState<null | number>(null);

    const onChangeHandler = (value: number) => {
        setRecallState(Math.ceil(value));
        setRating((prev) => (prev === value ? 2 : value));
    };

    return (
        <div>
            <Rating {...args} onChange={onChangeHandler} value={rating} />
            {/* @ts-ignore */}
            <Label size={'headingBig'}>
                {recallState && recall[recallState - 1 > recall.length - 1 ? recall.length - 1 : recallState - 1]}
            </Label>
        </div>
    );
};

export const Default = Template.bind({});

export const Controlled = TemplateControlled.bind({});

Controlled.args = {
    character: () => <Circle stroke="0" />,
    halfAllow: true
} as IRatingProps;

Controlled.argTypes = {
    value: args({ control: 'number', ...propCategory.appearance })
};

export const Stars = Template.bind({});

Stars.args = {
    character: () => <Star stroke="0" />,
    count: 10,
    color: '#fadb13',
    halfAllow: true
} as IRatingProps;

export const WithCustomIcons = Template.bind({});

WithCustomIcons.args = {
    character: (i: number) => {
        const Icon = icons[i];
        return <Icon />;
    },
    color: '#fadb13',
    bgColor: 'var(--background)'
} as IRatingProps;

export const WithCharacter = Template.bind({});

WithCharacter.args = {
    character: (i: number) => {
        const PrimitiveValue = primitive[i];
        return <div>{PrimitiveValue} </div>;
    },
    count: primitive.length
};

WithCharacter.argTypes = {
    character: args({ control: 'text', ...propCategory.appearance })
};
