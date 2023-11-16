export const menuData = [
    {
        icon: 'bc-icon-crm-standart-report',
        id: 'item-1',
        title: 'Menu Item 1'
    },
    {
        id: 'item-2',
        icon: 'bc-icon-test-48',
        title: 'Menu Item 2',
        disabled: true
    },
    {
        id: 'item-3',
        icon: 'bc-icon-sent-outline',
        title: 'Menu Item 3'
    },
    {
        id: 'item-4',
        icon: 'bc-icon-list-border',
        title: 'Menu Item 4',
        nested: [
            {
                id: 'section-1',
                title: 'Section 1'
            },
            {
                id: 'section-2',
                title: 'Section 2'
            }
        ]
    },
    {
        id: 'item-5',
        icon: 'bc-icon-pages',
        title: 'Menu Item 5',
        nested: [
            {
                id: 'section-3',
                title: 'Section 3'
            },
            {
                id: 'section-4',
                title: 'Section 4'
            }
        ]
    }
];
