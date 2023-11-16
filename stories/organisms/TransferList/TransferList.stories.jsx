import React, { useEffect, useState } from 'react';

import TransferListComponent from 'src/lib/organisms/TransferList/';
import ModuleTitle from 'src/lib/atoms/ModuleTitle';
import Button from 'src/lib/atoms/Button';
import { args, category, componentStage } from '../../assets/storybook.globals';

const gen = (pref) =>
    Array.from({ length: 50 }, (v, k) => k).map((k) => {
        const custom = {
            id: `${pref}${k}`,
            title: `List ${pref} Item ${k + 1}`,
            disabled: k === 3
        };

        return custom;
    });

const tMessages = {
    titles: {
        list1: 'Tasks',
        list2: 'Done',
        list3: 'Title 3'
    },
    countTitle: {
        list1: 'Possible',
        list2: 'Current'
    },
    empty: 'No data',
    dropHere: 'Drop Element Here'
};

const getData = async () => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                list1: gen('1'),
                list2: gen('2')
            });
        }, 0);
    });
};

export default {
    title: 'Organisms/TransferList-d',
    component: TransferListComponent,
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        defaultData: args({ control: 'object', category: category.content }),
        translateMessages: args({ control: 'object', category: category.others }),
        isEditable: args({ control: 'boolean', category: category.functionality })
    },
    args: {
        componentStage: {
            type: componentStage.deprecated
        },
        isEditable: false
    }
};

export const TransferList = (args) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [changedData, setChangedData] = useState();
    const [defaultData, setDefaultData] = useState({
        list1: [],
        list2: []
    });

    const fetchDefaultData = async () => {
        setIsLoading(true);
        const res = await getData();
        setDefaultData(res);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDefaultData();
    }, []);

    const handleEditClick = () => setIsEdit(true);

    const handleCancelClick = () => {
        setIsEdit(false);
        setChangedData();
    };

    const handleSaveClick = () => {
        setIsEdit(false);
        // save request
        setChangedData();
        setDefaultData(changedData);
    };

    return (
        <>
            <ModuleTitle title="Example">
                {isEdit ? (
                    <>
                        <Button
                            color="default"
                            appearance="minimal"
                            flexibility="content-size"
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </Button>
                        <Button flexibility="content-size" onClick={handleSaveClick}>
                            Save
                        </Button>
                    </>
                ) : (
                    <Button
                        disabled={isLoading}
                        appearance="minimal"
                        flexibility="content-size"
                        onClick={handleEditClick}
                    >
                        Edit
                    </Button>
                )}
            </ModuleTitle>
            <TransferListComponent
                {...args}
                isEditable={!isEdit}
                defaultData={defaultData}
                onChange={setChangedData}
                translateMessages={tMessages}
            />
        </>
    );
};

TransferList.args = {};
