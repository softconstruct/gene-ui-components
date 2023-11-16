import br from './br.svg';

export const avatarProps = {
    icon: 'bc-icon-user'
};
export const menuOptions = [
    {
        title: 'Menu 1',
        children: [
            {
                title: 'Menu 1-1'
            }
        ]
    },
    {
        title: 'Menu 2',
        children: [
            {
                title: 'Menu 2-1',
                children: [
                    {
                        title: 'Menu 2-1-1',
                        children: [
                            {
                                title: 'Menu 2-1-1-1'
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Menu 2-2'
            }
        ]
    },
    {
        border: 'top',
        title: 'Log Out',
        className: 'color-danger'
    }
];

export const languages = [
    'en',
    'ru',
    'es',
    'tr',
    'zh',
    'ko',
    'de',
    'fr',
    'ro',
    'pt',
    'hi',
    {
        id: 'br',
        title: 'Brazil',
        svgFlag: br
    }
];

export const partners = [
    {
        title: 'Zephyr',
        id: 1
    },
    {
        title: 'Seraphina',
        id: 2
    },
    {
        title: 'Phoenix',
        id: 3
    },
    {
        title: 'Luna',
        id: 4
    },
    {
        title: 'Orion',
        id: 5
    },
    {
        title: 'Ember',
        id: 6
    },
    {
        title: 'Avalon',
        id: 63
    },
    {
        title: 'Xander',
        id: 23
    },
    {
        title: 'Aurora',
        id: 234
    },
    {
        title: 'Atlas',
        id: 468
    },
    {
        title: 'Willow',
        id: 43
    },
    {
        title: 'Jasper',
        id: 2373
    },
    {
        title: 'Nova',
        id: 2663
    },
    {
        title: 'Evangeline',
        id: 5785
    },
    {
        title: 'Griffin',
        id: 8895
    },
    {
        title: 'Celeste',
        id: 3384
    },
    {
        title: 'Asher',
        id: 748
    }
];
