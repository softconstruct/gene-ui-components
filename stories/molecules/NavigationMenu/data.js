/* eslint-disable no-script-url */
/* eslint-disable react/jsx-no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

export const data = [
    {
        title: <a href="javascript:void(0)">Link</a>,
        id: '111',
        icon: 'bc-icon-custom-link'
    },
    {
        id: '2',
        title: 'Section 2',
        icon: 'bc-icon-send-pop-up-block',
        data: [
            {
                id: '2.1',
                title: 'Section 2.1',
                data: [
                    {
                        id: '2.1.1',
                        title: 'Section 2.1.1'
                    },
                    {
                        id: '2.1.2',
                        title: 'Section 2.1.2'
                    },
                    {
                        id: '2.1.3',
                        title: 'Section 2.1.3',
                        data: [
                            {
                                id: '2.1.3.1',
                                title: 'Section 2.1.3.1'
                            }
                        ]
                    }
                ]
            },
            {
                id: '2.2',
                title: 'Section 2.2',
                data: [
                    {
                        id: '2.2.1',
                        title: 'Section 2.2.1'
                    },
                    {
                        id: '2.2.2',
                        title: 'Section 2.2.2'
                    },
                    {
                        id: '2.2.3',
                        title: 'Section 2.2.3'
                    }
                ]
            },
            {
                id: '2.3',
                title: 'Section 2.3',
                data: [
                    {
                        id: '2.3.1',
                        title: 'Section 2.3.1'
                    },
                    {
                        id: '2.3.2',
                        title: 'Section 2.3.2'
                    },
                    {
                        id: '2.3.3',
                        title: 'Section 2.3.3'
                    }
                ]
            },
            {
                id: '2.4',
                title: 'Section 2.4'
            }
        ]
    },
    {
        id: '3',
        title: 'Section 3',
        icon: 'bc-icon-send-pop-up-block'
    }
];
