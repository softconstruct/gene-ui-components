import React, { useEffect, useState, useRef } from 'react';

import { args, propCategory } from '../../assets/storybook.globals';
import {
    BusyLoader,
    Empty,
    ExtendedInput,
    Tooltip,
    useEllipsisDetection,
    Toaster,
    Icon as IconComponent
} from '../../../src';
import './Icon.stories.scss';

const ICONS = 'https://sharedassets.namerandomness.com/betcore-icons/selection.json';

const copyContent = (contentRef, name) => {
    const content = contentRef?.current?.innerText || value;
    if (!content) return;
    navigator.clipboard
        .writeText(content)
        .then(() => Toaster.success({ title: 'Icon copied', message: `bc-icon-${name}` }))
        .catch((error) => console.error('Failed to copy:', error));
};

export default {
    title: 'Atoms/Icons',
    component: IconComponent,
    argTypes: {
        type: args({ control: 'text', ...propCategory.content }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        isFilled: args({ control: 'boolean', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others })
    }
};

export const Icon = ({ ...args }) => {
    const [fetchedData, setFetchedData] = useState({});
    const [filedMode, setFiledMode] = useState(false);
    const [noIconFound, setNoIconFound] = useState(false);

    useEffect(() => {
        fetch(ICONS)
            .then((response) => response.json())
            .then((data) => setFetchedData(data));
    }, []);

    useEffect(() => {
        const found =
            fetchedData.icons &&
            fetchedData.icons.find((icon) => `${args.type}-filled` === `bc-icon-${icon.properties.name}`);
        const isThereIcon =
            fetchedData.icons && fetchedData.icons.find((icon) => `${args.type}` === `bc-icon-${icon.properties.name}`);
        setFiledMode(!!found);
        setNoIconFound(!isThereIcon);
    }, [fetchedData, args.type, window.onresize]);

    if (!!fetchedData?.icons) {
        if (noIconFound) {
            return (
                <p>
                    There is no <span style={{ textDecoration: 'underline' }}>{args.type}</span> icon
                </p>
            );
        } else if (args.isFilled && args.type.endsWith('-filled')) {
            return (
                <>
                    <IconComponent
                        {...args}
                        type={
                            args.type.length &&
                            `${args.type}${args.isFilled && !args.type.endsWith('-filled') ? '-filled' : ''}`
                        }
                    />
                    <p>
                        The <span style={{ textDecoration: 'underline' }}>{args.type}</span> icon is already filled
                    </p>
                </>
            );
        } else if ((args.isFilled && filedMode) || !args.isFilled) {
            return (
                <IconComponent
                    {...args}
                    type={
                        args.type.length &&
                        `${args.type}${args.isFilled && !args.type.endsWith('-filled') ? '-filled' : ''}`
                    }
                />
            );
        } else if (args.isFilled && !filedMode) {
            return (
                <>
                    <IconComponent {...args} type={args.type.length && args.type} />
                    <p>
                        There is no <span style={{ textDecoration: 'underline' }}>{args.type}</span> filled mode
                    </p>
                </>
            );
        }
    } else {
        return <BusyLoader loadingText="" spinnerSize="small" isBusy={true} className="icon_loader" />;
    }
};
Icon.args = {
    isFilled: false,
    disabled: false,
    type: 'bc-icon-sound'
};

const IconCard = ({ name, copyContent }) => {
    const iconRef = useRef(null);
    const isTruncated = useEllipsisDetection(iconRef);

    return (
        <Tooltip padding={2} text={`bc-icon-${name}`} key={name} isVisible={isTruncated}>
            <div className="iconButton" onClick={() => copyContent(iconRef, name)}>
                <div className="iconButton_svg">
                    <IconComponent type={`bc-icon-${name}`} />
                </div>
                <p ref={iconRef} className="ellipsis-text iconButton_name">{`bc-icon-${name}`}</p>
            </div>
        </Tooltip>
    );
};

export const Catalog = () => {
    const [fetchedData, setFetchedData] = useState(null);
    const [iconFilteredList, setIconFilteredList] = useState({});

    useEffect(() => {
        fetch(ICONS)
            .then((response) => response.json())
            .then((data) => {
                setFetchedData(data);
                setIconFilteredList(data);
            });
    }, []);

    const searchHandler = (e) => {
        const searchValue = e?.currentTarget?.value;
        if (searchValue) {
            setIconFilteredList({
                ...fetchedData,
                icons: structuredClone(fetchedData)?.icons?.filter((icon) => {
                    return `bc-icon-${icon.properties.name.toLowerCase()}`.includes(
                        searchValue.toString().toLowerCase()
                    );
                })
            });
        } else {
            setIconFilteredList(fetchedData);
        }
    };

    return (
        <>
            <Toaster />
            <div className="iconsSearch">
                <ExtendedInput
                    className="iconsSearch_input"
                    placeholder={'Search icons'}
                    canClear
                    onChange={searchHandler}
                />
            </div>
            <BusyLoader loadingText="" spinnerSize="small" isBusy={!fetchedData} className={'icons_loader'}>
                <div className="iconsWrapper">
                    {iconFilteredList?.icons?.length ? (
                        iconFilteredList.icons.map(({ properties: { name } }) => {
                            return <IconCard name={name} key={name} copyContent={copyContent} />;
                        })
                    ) : (
                        <Empty
                            appearance="without-circles"
                            size="medium"
                            subTitle=""
                            title="No matching icons found"
                            type="search"
                            className={'noData_empty'}
                        />
                    )}
                </div>
            </BusyLoader>
        </>
    );
};

Catalog.argTypes = {
    type: args({ table: { disable: true } }),
    className: args({ table: { disable: true } }),
    disabled: args({ table: { disable: true } }),
    isFilled: args({ table: { disable: true } })
};
