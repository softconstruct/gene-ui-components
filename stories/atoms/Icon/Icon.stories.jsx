import React, { useEffect, useState, createRef } from 'react';

import IconComponent from 'src/lib/atoms/Icon/index';
import ToasterComponent from 'src/lib/organisms/Toaster/index';
import './Icon.stories.scss';

import { args, category } from '../../assets/storybook.globals';
import { BusyLoader, Empty, ExtendedInput, Tooltip } from '../../../src';

const ICONS = 'https://sharedassets.namerandomness.com/betcore-icons/selection.json';

function copyName(name) {
    const el = document.createElement('textarea');
    el.value = name;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    ToasterComponent.success({ title: 'Icon copied', message: `${name}` });
}

export default {
    title: 'Atoms/Icons',
    component: IconComponent,
    argTypes: {
        type: args({ control: 'text', category: category.content }),
        disabled: args({ control: 'boolean', category: category.states }),
        isFilled: args({ control: 'boolean', category: category.appearance }),
        className: args({ control: false, category: category.others })
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

export const Catalog = () => {
    const [searchValue, setSearchValue] = useState(null);
    const [fetchedData, setFetchedData] = useState(null);
    const [iconFilteredList, setIconFilteredList] = useState({});
    const [iconRefs, setIconRefs] = useState([]);

    //fetch icons
    useEffect(() => {
        fetch(ICONS)
            .then((response) => response.json())
            .then((data) => setFetchedData(data));
    }, []);
    //search icon
    useEffect(() => {
        if (searchValue) {
            setIconFilteredList({
                ...fetchedData,
                icons: structuredClone(fetchedData)?.icons?.filter((icon) => {
                    return `bc-icon-${icon.properties.name}`.includes(searchValue.toString());
                })
            });
        } else {
            setIconFilteredList(fetchedData);
        }
    }, [searchValue, fetchedData]);

    // create refs for each icon
    useEffect(() => {
        if (fetchedData) {
            setIconRefs((iconRefs) =>
                Array(iconFilteredList?.icons?.length)
                    .fill()
                    .map((_, i) => iconRefs[i] || createRef())
            );
        }
    }, [fetchedData, iconFilteredList?.icons?.length]);
    //adding showTooltip prom on filteredList.icons
    useEffect(() => {
        iconRefs.forEach(({ current }, index) => {
            setIconFilteredList((prevState) => {
                prevState.icons[index].showTooltip = current?.scrollWidth > current?.clientWidth;
                return { ...prevState };
            });
        });
    }, [iconRefs]);

    const searchHandler = (e) => setSearchValue(e?.currentTarget?.value || null);

    return (
        <>
            <ToasterComponent />
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
                        iconFilteredList.icons.map(({ properties: { name }, showTooltip }, index) => {
                            const iconRef = iconRefs[index];
                            if (showTooltip) {
                                return (
                                    <Tooltip padding={2} text={`bc-icon-${name}`} key={name}>
                                        <div className="iconButton" onClick={() => copyName(`bc-icon-${name}`)}>
                                            <div className="iconButton_svg">
                                                <IconComponent type={`bc-icon-${name}`} />
                                            </div>

                                            <p
                                                ref={iconRef}
                                                className="ellipsis-text iconButton_name"
                                            >{`bc-icon-${name}`}</p>
                                        </div>
                                    </Tooltip>
                                );
                            } else {
                                return (
                                    <div key={name} className="iconButton" onClick={() => copyName(`bc-icon-${name}`)}>
                                        <div className="iconButton_svg">
                                            <IconComponent type={`bc-icon-${name}`} />
                                        </div>

                                        <p
                                            ref={iconRef}
                                            className="ellipsis-text iconButton_name"
                                        >{`bc-icon-${name}`}</p>
                                    </div>
                                );
                            }
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
