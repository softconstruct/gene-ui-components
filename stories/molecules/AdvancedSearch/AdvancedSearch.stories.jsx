import React, { useCallback, useEffect, useState } from 'react';

// Helpers
import { args, propCategory } from '../../assets/storybook.globals';

// Data
import { typeFilterData, userFilterData, data } from './data';

// Components
import AdvancedSearchComponent from 'src/lib/molecules/AdvancedSearch';
import Icon from 'src/lib/atoms/Icon';
import Avatar from 'src/lib/atoms/Avatar';
import Divider from 'src/lib/atoms/Divider';
import NavigationMenu from 'src/lib/molecules/NavigationMenu';

// Configs
import { advancedSearchConfig } from '../../../src/configs';

export default {
    title: 'Molecules/AdvancedSearch',
    component: AdvancedSearchComponent,
    argTypes: {
        data: args({ control: 'object', ...propCategory.content }),
        onSearch: args({ control: false, ...propCategory.action }),
        noDataText: args({ control: 'text', ...propCategory.content }),
        showMoreText: args({ control: 'text', ...propCategory.content }),
        totalCount: args({ control: 'number', ...propCategory.content }),
        onOutsideClick: args({ control: false, ...propCategory.action }),
        initialData: args({ control: 'object', ...propCategory.content }),
        onShowMoreClick: args({ control: false, ...propCategory.action }),
        totalCountText: args({ control: 'text', ...propCategory.content }),
        showMoreIsLoading: args({ control: false, ...propCategory.states }),
        isOpen: args({ control: 'boolean', ...propCategory.functionality }),
        primaryFilterData: args({ control: 'object', ...propCategory.content }),
        closedInputWidth: args({ control: 'number', ...propCategory.appearance }),
        openedInputWidth: args({ control: 'number', ...propCategory.appearance }),
        extendedInputConfigs: args({ control: 'object', ...propCategory.others }),
        totalCountMax: args({ control: 'number', ...propCategory.functionality }),
        secondaryFilterData: args({ control: 'object', ...propCategory.content }),
        initialDataDescription: args({ control: 'text', ...propCategory.content }),
        isSearchLoading: args({ control: 'boolean', ...propCategory.functionality }),
        hasActiveShowMore: args({ control: 'boolean', ...propCategory.functionality }),
        position: args({
            control: 'select',
            options: Object.values(advancedSearchConfig.positions),
            ...propCategory.appearance
        })
    },
    args: {}
};

export const Default = ({ ...args }) => {
    const twoDimensionalFilterData = [
        userFilterData.slice(0, 4),
        userFilterData.slice(4, 8),
        userFilterData.slice(8, userFilterData.length)
    ];
    const [loading, setLoading] = useState(true);

    const userFilterObjectDataSetter = useCallback(() => {
        setUserFilterObject((prev) => {
            return {
                ...prev,
                isLoading: true,
                hasActiveShowMore: false
            };
        });
        setTimeout(() => {
            setUserFilterObject((prev) => {
                return {
                    ...prev,
                    isLoading: false,
                    hasActiveShowMore: prev.data.length < 8,
                    data:
                        prev.data.length < 5
                            ? [...prev.data, ...twoDimensionalFilterData[1]]
                            : [...prev.data, ...twoDimensionalFilterData[2]]
                };
            });
        }, 2000);
    }, []);

    const [currentData, setCurrentData] = useState([]);
    const [typesForFilter, setTypesForFilter] = useState([]);
    const [usersForFilter, setUsersForFilter] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [hasActiveShowMoreState, setHasActiveShowMoreState] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [splittedData, setSplittedData] = useState([]);
    const [showMoreCounter, setShowMoreCounter] = useState(8);
    const [byObjectTypeFiltered, setByObjectTypeFiltered] = useState([]);
    const [byUserFiltered, setByUserFiltered] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [searchCharacter, setSearchCharacter] = useState('');

    setTimeout(() => setLoading(false), 3000);

    const typeFilterOnChange = useCallback(
        (e) => {
            setTypesForFilter(e.filter((elem) => elem.checked).map((el) => el.value));
        },
        [typesForFilter, usersForFilter]
    );

    const userFilterOnChange = useCallback(
        (e) => {
            setUserFilterObject((prev) => {
                return {
                    ...prev,
                    data: [...e]
                };
            });
            setUsersForFilter(e.filter((elem) => elem.checked).map((el) => el.value));
        },
        [typesForFilter, usersForFilter]
    );

    const [typeFilterObject, setTypeFilterObject] = useState({
        hasActiveShowMore: false,
        sectionNameText: 'Filter by object type',
        showMoreText: 'Show more',
        onChange: typeFilterOnChange,
        onShowMoreClick: (e) => () => {},
        isLoading: loading,
        data: []
    });

    const [userFilterObject, setUserFilterObject] = useState({
        hasActiveShowMore: true,
        sectionNameText: 'Filter by user',
        showMoreText: 'Show more',
        onChange: userFilterOnChange,
        onShowMoreClick: userFilterObjectDataSetter,
        isLoading: loading,
        data: []
    });

    //setTypeFilterObject
    useEffect(() => {
        setTypeFilterObject((prev) => {
            return {
                ...prev,
                isLoading: loading,
                data: typeFilterData
            };
        });
    }, [typeFilterData, loading]);

    //setUserFilterObject
    useEffect(() => {
        setUserFilterObject((prev) => {
            return {
                ...prev,
                isLoading: loading,
                data: twoDimensionalFilterData[0]
            };
        });
    }, [loading]);

    const mapToComponentModel = useCallback(() => {
        return structuredClone(data).map((elem) => {
            return {
                ...elem,
                actions: [
                    {
                        name: 'name1',
                        icon: 'bc-icon-archive',
                        onClick: () => {},
                        description: 'description 1'
                    },
                    {
                        name: 'name2',
                        icon: 'bc-icon-convert-to-report',
                        onClick: () => {},
                        description: 'description 2'
                    },
                    {
                        name: 'name3',
                        icon: 'bc-icon-info',
                        onClick: () => {},
                        description: 'description 3'
                    }
                ]
            };
        });
    }, [data]);

    const onSearchHandler = useCallback(
        (e) => {
            if (!e.length) setShowMoreCounter(8);
            setSearchCharacter(e);
            setIsSearchLoading(true);
            setCurrentData(
                mapToComponentModel().filter((elem) => {
                    if (!!e.toString().length) {
                        return (
                            elem?.title?.toLowerCase().includes(e?.toLowerCase()) ||
                            elem?.name?.toLowerCase().includes(e?.toLowerCase()) ||
                            elem?.id?.includes(e)
                        );
                    } else {
                        return false;
                    }
                })
            );

            setTimeout(() => {
                setIsSearchLoading(false);
            }, 2000);
        },
        [mapToComponentModel, currentData]
    );

    //setByObjectTypeFiltered
    useEffect(() => {
        typesForFilter.length > 0
            ? setByObjectTypeFiltered(currentData.filter((elem) => typesForFilter.indexOf(elem.type) >= 0))
            : setByObjectTypeFiltered(currentData);
    }, [typeFilterOnChange, currentData, onSearchHandler, userFilterOnChange]);
    //setByUserFiltered
    useEffect(() => {
        usersForFilter.length > 0
            ? setByUserFiltered(byObjectTypeFiltered.filter((elem) => usersForFilter.indexOf(elem.name) >= 0))
            : setByUserFiltered(byObjectTypeFiltered);
    }, [typeFilterOnChange, currentData, onSearchHandler, userFilterOnChange, byObjectTypeFiltered]);

    //setHasActiveShowMoreState
    useEffect(() => {
        setTotalCount(byUserFiltered.length);
        if (showMoreCounter >= byUserFiltered.length) {
            setHasActiveShowMoreState(false);
        } else {
            setHasActiveShowMoreState(byUserFiltered.length > 8);
        }
    }, [onSearchHandler, hasActiveShowMoreState, showMoreCounter, byUserFiltered]);

    //slicing for show More
    useEffect(() => {
        setSplittedData(byUserFiltered);
        if (byUserFiltered.length <= 8) {
            setSplittedData(byUserFiltered);
        } else {
            setIsSearchLoading(true);
            setSplittedData(byUserFiltered.slice(0, showMoreCounter));
            setTimeout(() => {
                setIsSearchLoading(false);
            }, Math.floor(Math.random() * (1000 - 500 + 1)) + 500);
        }
    }, [onSearchHandler, showMoreCounter, byUserFiltered]);

    //setting initial data
    useEffect(() => {
        setInitialData(mapToComponentModel().slice(0, 5));
    }, [mapToComponentModel]);

    const showMoreHandler = useCallback(() => setShowMoreCounter((prev) => prev + 9), []);
    return (
        <header
            style={{
                alignItems: 'center',
                backgroundColor: '#3d3d5f',
                color: '#ffffff',
                display: 'flex',
                height: 56,
                padding: '0 20px',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}
        >
            <Icon type="bc-icon-publish" />
            <Divider size={32} />
            <NavigationMenu
                data={[
                    {
                        icon: 'bc-icon-send-pop-up-block',
                        id: '1',
                        title: 'Section 1'
                    }
                ]}
                onChange={() => {}}
                value="1/8"
            />
            <AdvancedSearchComponent
                data={splittedData}
                totalCountMax={1000}
                totalCount={totalCount}
                totalCountText={'Result'}
                initialData={initialData}
                showMoreText={'Show More'}
                isSearchLoading={isSearchLoading}
                {...((splittedData.length || searchCharacter.length) && { primaryFilterData: typeFilterObject })}
                {...((splittedData.length || searchCharacter.length) && { secondaryFilterData: userFilterObject })}
                hasActiveShowMore={hasActiveShowMoreState}
                initialDataDescription={'Initial Data Description...'}
                {...args}
                onShowMoreClick={showMoreHandler}
                onSearch={onSearchHandler}
            />
            <Divider size={32} />
            <Avatar>A S</Avatar>
        </header>
    );
};
export const OpenStateControlled = ({ ...args }) => {
    const twoDimensionalFilterData = [
        userFilterData.slice(0, 4),
        userFilterData.slice(4, 8),
        userFilterData.slice(8, userFilterData.length)
    ];
    const [loading, setLoading] = useState(true);

    const userFilterObjectDataSetter = useCallback(() => {
        setUserFilterObject((prev) => {
            return {
                ...prev,
                isLoading: true,
                hasActiveShowMore: false
            };
        });
        setTimeout(() => {
            setUserFilterObject((prev) => {
                return {
                    ...prev,
                    isLoading: false,
                    hasActiveShowMore: prev.data.length < 8,
                    data:
                        prev.data.length < 5
                            ? [...prev.data, ...twoDimensionalFilterData[1]]
                            : [...prev.data, ...twoDimensionalFilterData[2]]
                };
            });
        }, 2000);
    }, []);

    const [currentData, setCurrentData] = useState([]);
    const [typesForFilter, setTypesForFilter] = useState([]);
    const [usersForFilter, setUsersForFilter] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [hasActiveShowMoreState, setHasActiveShowMoreState] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [splittedData, setSplittedData] = useState([]);
    const [showMoreCounter, setShowMoreCounter] = useState(8);
    const [byObjectTypeFiltered, setByObjectTypeFiltered] = useState([]);
    const [byUserFiltered, setByUserFiltered] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [searchCharacter, setSearchCharacter] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    setTimeout(() => setLoading(false), 3000);

    const typeFilterOnChange = useCallback(
        (e) => {
            setTypesForFilter(e.filter((elem) => elem.checked).map((el) => el.value));
        },
        [typesForFilter, usersForFilter]
    );

    const userFilterOnChange = useCallback(
        (e) => {
            setUserFilterObject((prev) => {
                return {
                    ...prev,
                    data: [...e]
                };
            });
            setUsersForFilter(e.filter((elem) => elem.checked).map((el) => el.value));
        },
        [typesForFilter, usersForFilter]
    );

    const [typeFilterObject, setTypeFilterObject] = useState({
        hasActiveShowMore: false,
        sectionNameText: 'Filter by object type',
        showMoreText: 'Show more',
        onChange: typeFilterOnChange,
        onShowMoreClick: (e) => () => {},
        isLoading: loading,
        data: []
    });

    const [userFilterObject, setUserFilterObject] = useState({
        hasActiveShowMore: true,
        sectionNameText: 'Filter by user',
        showMoreText: 'Show more',
        onChange: userFilterOnChange,
        onShowMoreClick: userFilterObjectDataSetter,
        isLoading: loading,
        data: []
    });

    //setTypeFilterObject
    useEffect(() => {
        setTypeFilterObject((prev) => {
            return {
                ...prev,
                isLoading: loading,
                data: typeFilterData
            };
        });
    }, [typeFilterData, loading]);

    //setUserFilterObject
    useEffect(() => {
        setUserFilterObject((prev) => {
            return {
                ...prev,
                isLoading: loading,
                data: twoDimensionalFilterData[0]
            };
        });
    }, [loading]);

    const mapToComponentModel = useCallback(() => {
        return structuredClone(data).map((elem) => {
            return {
                ...elem,
                actions: [
                    {
                        name: 'name1',
                        icon: 'bc-icon-archive',
                        onClick: () => {},
                        description: 'description 1'
                    },
                    {
                        name: 'name2',
                        icon: 'bc-icon-convert-to-report',
                        onClick: () => {},
                        description: 'description 2'
                    },
                    {
                        name: 'name3',
                        icon: 'bc-icon-info',
                        onClick: () => {},
                        description: 'description 3'
                    }
                ]
            };
        });
    }, [data]);

    const onSearchHandler = useCallback(
        (e) => {
            if (!e.length) setShowMoreCounter(8);
            setSearchCharacter(e);
            setIsSearchLoading(true);
            setCurrentData(
                mapToComponentModel().filter((elem) => {
                    if (!!e.toString().length) {
                        return (
                            elem?.title?.toLowerCase().includes(e?.toLowerCase()) ||
                            elem?.name?.toLowerCase().includes(e?.toLowerCase()) ||
                            elem?.id?.includes(e)
                        );
                    } else {
                        return false;
                    }
                })
            );

            setTimeout(() => {
                setIsSearchLoading(false);
            }, 2000);
        },
        [mapToComponentModel, currentData]
    );

    //setByObjectTypeFiltered
    useEffect(() => {
        typesForFilter.length > 0
            ? setByObjectTypeFiltered(currentData.filter((elem) => typesForFilter.indexOf(elem.type) >= 0))
            : setByObjectTypeFiltered(currentData);
    }, [typeFilterOnChange, currentData, onSearchHandler, userFilterOnChange]);
    //setByUserFiltered
    useEffect(() => {
        usersForFilter.length > 0
            ? setByUserFiltered(byObjectTypeFiltered.filter((elem) => usersForFilter.indexOf(elem.name) >= 0))
            : setByUserFiltered(byObjectTypeFiltered);
    }, [typeFilterOnChange, currentData, onSearchHandler, userFilterOnChange, byObjectTypeFiltered]);

    //setHasActiveShowMoreState
    useEffect(() => {
        setTotalCount(byUserFiltered.length);
        if (showMoreCounter >= byUserFiltered.length) {
            setHasActiveShowMoreState(false);
        } else {
            setHasActiveShowMoreState(byUserFiltered.length > 8);
        }
    }, [onSearchHandler, hasActiveShowMoreState, showMoreCounter, byUserFiltered]);

    //slicing for show More
    useEffect(() => {
        setSplittedData(byUserFiltered);
        if (byUserFiltered.length <= 8) {
            setSplittedData(byUserFiltered);
        } else {
            setIsSearchLoading(true);
            setSplittedData(byUserFiltered.slice(0, showMoreCounter));
            setTimeout(() => {
                setIsSearchLoading(false);
            }, Math.floor(Math.random() * (1000 - 500 + 1)) + 500);
        }
    }, [onSearchHandler, showMoreCounter, byUserFiltered]);

    //setting initial data
    useEffect(() => {
        setInitialData(mapToComponentModel().slice(0, 5));
    }, [mapToComponentModel]);

    const showMoreHandler = useCallback(() => setShowMoreCounter((prev) => prev + 9), []);
    return (
        <header
            style={{
                alignItems: 'center',
                backgroundColor: '#3d3d5f',
                color: '#ffffff',
                display: 'flex',
                height: 56,
                padding: '0 20px',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}
        >
            <Icon type="bc-icon-publish" />
            <Divider size={32} />
            <NavigationMenu
                data={[
                    {
                        icon: 'bc-icon-send-pop-up-block',
                        id: '1',
                        title: 'Section 1'
                    }
                ]}
                onChange={() => {}}
                value="1/8"
            />
            <AdvancedSearchComponent
                data={splittedData}
                totalCountMax={1000}
                totalCount={totalCount}
                totalCountText={'Result'}
                initialData={initialData}
                showMoreText={'Show More'}
                isSearchLoading={isSearchLoading}
                {...((splittedData.length || searchCharacter.length) && { primaryFilterData: typeFilterObject })}
                {...((splittedData.length || searchCharacter.length) && { secondaryFilterData: userFilterObject })}
                hasActiveShowMore={hasActiveShowMoreState}
                initialDataDescription={'Initial Data Description...'}
                {...args}
                onShowMoreClick={showMoreHandler}
                onSearch={onSearchHandler}
                isOpen={isOpen}
                extendedInputConfigs={{
                    onFocus: () => setIsOpen(true),
                    onIconClick: () => setIsOpen(true)
                }}
                onOutsideClick={() => setIsOpen(false)}
            />
            <Divider size={32} />
            <Avatar>A S</Avatar>
        </header>
    );
};
