import React, { useState } from 'react';

import OverspreadComponent from 'src/lib/organisms/Overspread';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';

const optionData = [{ title: 'Action 1' }, { title: 'Action 2' }, { title: 'Action 3' }];

const dataForTitleWithOptions = [
    { label: 'Title 1', value: 1 },
    { label: 'Title 2', value: 2 },
    { label: 'Title 3', value: 3 }
];

export default {
    title: 'Organisms/Overspread',
    component: OverspreadComponent,
    argTypes: {
        onDone: args({ control: false, category: category.action }),
        onBack: args({ control: false, category: category.action }),
        title: args({ control: 'text', category: category.content }),
        onClose: args({ control: false, category: category.action }),
        opened: args({ control: 'boolean', category: category.states }),
        doneText: args({ control: 'text', category: category.content }),
        backText: args({ control: 'text', category: category.content }),
        children: args({ control: 'text', category: category.content }),
        searchOutput: args({ control: false, category: category.action }),
        hasSearch: args({ control: 'boolean', category: category.action }),
        onAnimationEnd: args({ control: false, category: category.action }),
        disabledDone: args({ control: 'boolean', category: category.states }),
        onSelectingOption: args({ control: false, category: category.action }),
        hasBack: args({ control: 'boolean', category: category.functionality }),
        hasDone: args({ control: 'boolean', category: category.functionality }),
        dataForOptions: args({ control: 'object', category: category.content }),
        backWithIcon: args({ control: 'boolean', category: category.appearance }),
        doneWithIcon: args({ control: 'boolean', category: category.appearance }),
        hasOptions: args({ control: 'boolean', category: category.functionality }),
        onSelectingTitleOption: args({ control: false, category: category.action }),
        titleHasOptions: args({ control: 'boolean', category: category.functionality }),
        dataForTitleWithOptions: args({ control: 'object', category: category.content }),
        defaultValueForTitleWithOptions: args({ control: 'object', category: category.content })
    },
    args: {
        hasDone: true,
        hasBack: false,
        title: 'Title',
        hasSearch: true,
        doneText: 'Done',
        backText: 'Back',
        hasOptions: true,
        disabledDone: false,
        doneWithIcon: false,
        backWithIcon: false,
        titleHasOptions: true,
        dataForOptions: optionData,
        dataForTitleWithOptions: dataForTitleWithOptions,
        defaultValueForTitleWithOptions: dataForTitleWithOptions[0]
    }
};

export const Overspread = ({ ...args }) => {
    const [title, setTitle] = useState(dataForTitleWithOptions[0]);
    const [opened, setOpened] = useState(false);

    const toggleOverSpread = () => {
        setOpened((prev) => !prev);
    };
    const handleTitleChange = (e) => {
        setTitle(e);
    };

    return (
        <>
            <Button onClick={toggleOverSpread}> Open overspread </Button>
            <OverspreadComponent
                opened={opened}
                defaultValueForTitleWithOptions={title}
                onSelectingTitleOption={handleTitleChange}
                {...args}
                onDone={toggleOverSpread}
                onClose={toggleOverSpread}
            >
                Your content goes here...
            </OverspreadComponent>
        </>
    );
};
