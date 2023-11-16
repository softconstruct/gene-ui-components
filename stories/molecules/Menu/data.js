export const data = [
    {
        title: 'Stack 1',
        color: 'hero',
        icon: 'bc-icon-blocks',
        children: [
            {
                title: 'Stack 1.1',
                children: [
                    {
                        title: 'Stack 1.1.1',
                        children: [
                            {
                                title: 'Stack 1.1.1.1'
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Stack 1.2'
            }
        ]
    },
    {
        title: 'Stack 2',
        color: 'hero',
        icon: 'bc-icon-blocks',
        children: [
            {
                title: 'Stack 2.1'
            },
            {
                title: 'Stack 2.2'
            }
        ]
    },
    {
        title: 'Group 1',
        disabled: true,
        border: 'top'
    },
    {
        title: 'Item 1',
        icon: 'bc-icon-template',
        color: 'hero'
    },
    {
        title: 'Item 2',
        icon: 'bc-icon-template',
        color: 'hero'
    },
    {
        title: 'Group 2',
        disabled: true,
        border: 'top'
    },
    {
        title: 'Item 1',
        icon: 'bc-icon-template',
        color: 'hero'
    },
    {
        title: 'Item 2',
        icon: 'bc-icon-template',
        color: 'hero'
    },
    {
        title: 'Scrollable List with autoScroll',
        maxHeight: 120,
        color: 'default',
        icon: 'bc-icon-list-border',
        children: [
            { id: 'en', title: 'English', active: false, checkMark: true },
            { id: 'ru', title: 'Russian', active: false, checkMark: true },
            { id: 'es', title: 'Spanish', active: false, checkMark: true },
            { id: 'tr', title: 'Turkish', active: false, checkMark: true },
            { id: 'de', title: 'German', active: false, checkMark: true },
            { id: 'fr', title: 'French', active: false, checkMark: true },
            { id: 'it', title: 'Italian', active: false, checkMark: true },
            { id: 'pt', title: 'Portuguese', active: false, checkMark: true },
            { id: 'nl', title: 'Dutch', active: true, checkMark: true },
            { id: 'sv', title: 'Swedish', active: false, checkMark: true },
            { id: 'pl', title: 'Polish', active: false, checkMark: true },
            { id: 'fi', title: 'Finnish', active: false, checkMark: true },
            { id: 'hu', title: 'Hungarian', active: false, checkMark: true },
            { id: 'da', title: 'Danish', active: false, checkMark: true },
            { id: 'cs', title: 'Czech', active: false, checkMark: true }
        ]
    },
    {
        title: 'Cancel',
        icon: 'bc-icon-cancel',
        border: 'top'
    }
];
