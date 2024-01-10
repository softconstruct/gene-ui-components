import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Divider, Option, Scrollbar, Empty, Search } from 'components';

import { toLowerCaseString } from '../../../utils';

function Partners({ partners }) {
    const [partnersData, setPartnersData] = useState([]);
    const [partnersForSearch, setPartnersForSearch] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const listRef = useRef(null);
    const activeElementRef = useRef(null);

    useEffect(() => {
        setPartnersData(Array.isArray(partners?.data) ? [...partners.data] : []);
    }, [partners.data]);

    useEffect(() => {
        setPartnersForSearch([...partnersData]);
    }, []);

    useEffect(() => {
        setPartnersForSearch(
            searchValue.length > 0
                ? partnersData.filter(
                      (partner) =>
                          toLowerCaseString(partner.title).includes(searchValue) ||
                          toLowerCaseString(partner.id).includes(searchValue)
                  )
                : partnersData
        );
    }, [partnersData, searchValue]);

    const partnersSearchHandler = useCallback(
        (e) => {
            setSearchValue(toLowerCaseString(e.target.value));
        },
        [partnersData]
    );

    const selectPartnerHandler = (partner) => {
        setPartnersData((prev) => prev.map((p) => ({ ...p, active: p.id === partner.id })));
        partners.onSelectHandler(partner);
    };

    // Scroll to active element
    const [activeElementTop, setActiveElementTop] = useState(null);
    const [allowScroll, setAllowScroll] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (allowScroll) {
            setActiveElementTop(activeElementRef?.current?.offsetTop);
            setAllowScroll(false);
        }
    }, [allowScroll]);

    useEffect(() => {
        if (!isScrolled && listRef?.current?.container.firstChild.children.length === partnersForSearch?.length) {
            setAllowScroll(true);
            setIsScrolled(true);
        }
    });

    return (
        <div className="partners">
            <Search
                canClear
                onChange={partnersSearchHandler}
                placeholder={partners?.searchPlaceholder}
                className="partners__row partners__search"
            />
            <Divider size="100%" type="horizontal" withSpace={false} className="partners__divider" />
            <Scrollbar
                ref={listRef}
                autoHeightMax={500}
                style={{
                    height: '300px'
                }}
                scrollTop={activeElementTop}
            >
                {partnersForSearch.length ? (
                    partnersForSearch.map((partner) => {
                        const { id, active, title } = partner;
                        return (
                            <Option
                                key={id}
                                checkMark
                                active={active}
                                onClick={() => {
                                    selectPartnerHandler(partner);
                                }}
                                {...(active ? { forwardedRef: activeElementRef } : {})}
                                title={`${title} (${id})`}
                                className="partners__row"
                            />
                        );
                    })
                ) : (
                    <Empty
                        size="small"
                        {...(partners.noDataText ? { title: partners.noDataText } : {})}
                        className="partners__empty"
                    />
                )}
            </Scrollbar>
        </div>
    );
}

export default Partners;
