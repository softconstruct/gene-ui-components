import React, { useCallback, useEffect, useState } from 'react';

import AdvancedSearchComponent from 'src/lib/molecules/AdvancedSearch';
import Icon from 'src/lib/atoms/Icon';
import Divider from 'src/lib/atoms/Divider';
import NavigationMenu from 'src/lib/molecules/NavigationMenu';
import { args, category } from '../../assets/storybook.globals';
import { typeFilterData, userFilterData, data } from './data';
import { advancedSearchConfig } from '../../../src/configs';
import Time from '../../../src/lib/atoms/Time';

export default {
    title: 'Molecules/AdvancedSearch',
    component: AdvancedSearchComponent,
    argTypes: {
        data: args({ control: 'object', category: category.content }),
        onSearch: args({ control: false, category: category.action }),
        noDataText: args({ control: 'text', category: category.content }),
        showMoreText: args({ control: 'text', category: category.content }),
        totalCount: args({ control: 'number', category: category.content }),
        onOutsideClick: args({ control: false, category: category.action }),
        initialData: args({ control: 'object', category: category.content }),
        onShowMoreClick: args({ control: false, category: category.action }),
        totalCountText: args({ control: 'text', category: category.content }),
        showMoreIsLoading: args({ control: false, category: category.states }),
        isOpen: args({ control: 'boolean', category: category.functionality }),
        primaryFilterData: args({ control: 'object', category: category.content }),
        closedInputWidth: args({ control: 'number', category: category.appearance }),
        openedInputWidth: args({ control: 'number', category: category.appearance }),
        extendedInputConfigs: args({ control: 'object', category: category.others }),
        totalCountMax: args({ control: 'number', category: category.functionality }),
        secondaryFilterData: args({ control: 'object', category: category.content }),
        initialDataDescription: args({ control: 'text', category: category.content }),
        isSearchLoading: args({ control: 'boolean', category: category.functionality }),
        hasActiveShowMore: args({ control: 'boolean', category: category.functionality }),
        position: args({
            control: 'select',
            options: Object.values(advancedSearchConfig.positions),
            category: category.appearance
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
            <Time style={{ marginLeft: '10px' }} />
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
            <Time style={{ marginLeft: '10px' }} />
        </header>
    );
};
