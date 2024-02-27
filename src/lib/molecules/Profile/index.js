import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { screenTypes } from 'configs';
import { noop, childrenOf } from 'utils';
import { useClickOutside, useDeviceType, useToggle } from 'hooks';

// Components
import Empty from '../../atoms/Empty';
import Icon from '../../atoms/Icon';
import Popover from '../../atoms/Popover';
import Avatar from '../../atoms/Avatar';
import Tooltip from '../Tooltip';
import Menu from '../Menu';
import Search from '../Search';

// Local components
import ProfileModule from './ProfileModule';
import flagSVGs from './Languages/flags/flagsIcons';
import languagesDataModel from './Languages/languagesDataModel';

// Styles
import './index.scss';

function Profile(props) {
    const {
        username,
        tooltipProps,
        showIcon,
        menuProps,
        avatarProps,
        screenType,
        email,
        isOpen,
        toggleHandler,
        onOutsideClick,
        containerParent,
        padding,
        popoverClassName,
        tabIndex,
        userSelect,
        languages,
        partners,
        customAvatar
    } = props;

    const [opened, toggle] = useToggle(false);
    const isControlled = 'isOpen' in props;
    const menuVisibleState = isControlled ? isOpen : opened;
    const menuExists = !!Object.keys(menuProps).length;
    const { isMobile } = useDeviceType(screenType);
    const profileRef = useRef(null);
    const [languagesMappedData, setLanguagesMappedData] = useState(null);
    const [partnersMappedData, setPartnersMappedData] = useState(null);
    const [processedMenuProps, setProcessedMenuProps] = useState(null);
    const [searchedPartners, setSearchedPartners] = useState([]);

    useEffect(() => {
        setSearchedPartners(partners?.data ? partners?.data : []);
    }, []);

    const activeLanguageTitle = useMemo(
        () => languagesMappedData?.children.find((el) => el.active)?.title,
        [languages?.active, languagesMappedData?.children]
    );

    useEffect(() => {
        if (languages) {
            setLanguagesMappedData(() => ({
                title: (
                    <div className="languages__title">
                        <span className="ellipsis-text"> {languages?.title}:</span>
                        <span className="languages__selectedTitle"> {activeLanguageTitle}</span>
                        <div className="languages__titleImgContainer">
                            <img
                                src={
                                    flagSVGs[languages.active] ||
                                    languages.data.find((el) => typeof el === 'object' && languages.active === el.id)
                                        .svgFlag
                                }
                                alt={`lang-${languages.active}`}
                                className="languages__titleImg"
                            />
                        </div>
                    </div>
                ),
                maxHeight: languages?.maxHeight,
                children: languages.data.map((language) => {
                    if (typeof language === 'object') {
                        return {
                            id: language.id,
                            title: language.title,
                            active: language.id === languages?.active,
                            checkMark: true,
                            onClick: () => {
                                languages.onSelect(language.id);
                                toggle(false);
                            },
                            leftCustomElement: (
                                <div className="languages__imgWrapper">
                                    <img
                                        src={language.svgFlag}
                                        alt={`lang-${language.svgFlag}`}
                                        className="languages__flagImg"
                                    />
                                </div>
                            )
                        };
                    }
                    if (languagesDataModel[language]) {
                        return {
                            ...languagesDataModel[language],
                            active: language === languages?.active,
                            checkMark: true,
                            onClick: () => {
                                languages.onSelect(language);
                                toggle(false);
                            },
                            leftCustomElement: (
                                <div className="languages__imgWrapper">
                                    <img
                                        src={flagSVGs[language]}
                                        alt={`lang-${flagSVGs[language]}`}
                                        className="languages__flagImg"
                                    />
                                </div>
                            )
                        };
                    }
                    return null;
                })
            }));
        }
    }, [languages, activeLanguageTitle]);

    const [searchValue, setSearchValue] = useState('');
    const searchRef = useRef(null);
    const partnerSearchHandler = (e, val) => {
        setSearchValue(val);
    };

    const partnerSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchRef.current.blur();
            menuRef.current.focus();
        }
    };

    const onBackHandler = () => {
        if (partners) setSearchValue('');
    };

    useEffect(() => {
        setSearchedPartners(() => {
            if (searchValue.length) {
                return partners?.data.filter(
                    (partner) =>
                        partner?.title.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
                        partner?.id.toString().toLowerCase().includes(searchValue.toLowerCase())
                );
            }
            return partners?.data;
        });
        !opened && setSearchValue('');
    }, [searchValue.length, opened]);

    const partnersSearch = (
        <div className="partners__searchHolder">
            <Search
                canClear
                className="partners__search"
                onChange={partnerSearchHandler}
                onKeyDown={partnerSearchKeyDown}
                placeholder="Some placeholder"
                ref={searchRef}
            />
        </div>
    );
    useEffect(() => {
        if (partners) {
            const activePartner = partners.data.find((p) => p.id.toString() === partners.active.toString());
            setPartnersMappedData({
                title: (
                    <div className="partners__title">
                        <span>{partners?.title}:</span>&nbsp;<span>{activePartner.title}</span>&nbsp;({activePartner.id}
                        )
                    </div>
                ),
                children: [
                    { component: partnersSearch },
                    ...searchedPartners.map((partner) => ({
                        title: (
                            <div className="partners__title">
                                <span>{partner?.title}</span>&nbsp;<span>({partner.id})</span>
                            </div>
                        ),
                        active: partner.id.toString() === partners.active.toString(),
                        checkMark: true,
                        onClick: () => {
                            partners.onSelect(partner.id.toString());
                            toggle(false);
                        }
                    })),
                    ...(searchedPartners.length
                        ? []
                        : [
                              {
                                  component: (
                                      <Empty
                                          title={partners.noDataText}
                                          className="partners__emptyTitle"
                                          size="small"
                                      />
                                  )
                              }
                          ])
                ],
                maxHeight: partners.maxHeight,
                scrollTopGap: 54
            });
        }
    }, [partners, partners?.active, searchedPartners, searchValue]);

    useEffect(() => {
        setProcessedMenuProps(() => {
            if (languagesMappedData || partnersMappedData) {
                return {
                    data: [
                        languagesMappedData && languagesMappedData,
                        partnersMappedData && partnersMappedData,
                        ...menuProps.data
                    ],
                    scrollToActiveElement: true
                };
            }
            return menuProps;
        });
    }, [languagesMappedData, partnersMappedData, menuProps]);

    const handleMenuStateChange = useCallback(
        (e) => {
            setSearchValue('');
            if (isControlled) {
                toggleHandler(e, isOpen);
            } else {
                toggle(!opened);
                toggleHandler(e, !opened);
            }
        },
        [opened, isControlled, toggleHandler]
    );

    const outsideClickHandler = useCallback(
        (e) => {
            onOutsideClick(e);
            if (profileRef.current.contains(e.target)) {
                toggle(!opened);
            } else {
                toggle(false);
            }
        },
        [onOutsideClick, toggle]
    );

    const outsideClickRef = useClickOutside(outsideClickHandler, [profileRef]);
    const menuRef = useRef(null);

    const keyDownHandler = (e) => {
        switch (e.key) {
            case 'Enter':
                toggle(!opened);
                break;
            case 'Tab' && opened:
                toggle(!opened);
                break;
            case 'Escape':
                toggle(false);
                break;
            case 'ArrowDown':
                if (!opened) {
                    toggle(true);
                } else {
                    menuRef && menuRef.current.focus();
                }
                break;
        }
    };

    let Content = (
        <div
            className={classnames({ 'user-profile-c': !customAvatar })}
            onClick={handleMenuStateChange}
            ref={profileRef}
            tabIndex={tabIndex}
            onKeyDown={keyDownHandler}
        >
            {customAvatar || (
                <>
                    <Avatar icon="bc-icon-user" {...avatarProps} />
                    {!isMobile && (
                        <>
                            {username && (
                                <p
                                    className={classnames('user-profile-text', 'ellipsis-text', {
                                        'user-profile-text-select': userSelect
                                    })}
                                >
                                    {username}
                                </p>
                            )}
                            {showIcon && menuExists && <Icon type="bc-icon-arrow-down" />}
                        </>
                    )}
                </>
            )}
        </div>
    );

    if (!isMobile && Object.keys(tooltipProps).length) {
        Content = <Tooltip {...tooltipProps}>{Content}</Tooltip>;
    }

    const dynamicPropsContainerParent = useMemo(
        () =>
            containerParent
                ? {
                      containerParent,
                      disableTransform: true
                  }
                : {},
        [containerParent]
    );

    if (menuExists) {
        Content = (
            <Popover
                contentRef={outsideClickRef}
                align="bottom-start"
                isOpen={menuVisibleState}
                extendTargetWidth={false}
                padding={padding}
                className={classnames('profile-module-popover', { [popoverClassName]: !!popoverClassName })}
                {...dynamicPropsContainerParent}
                Content={
                    <div className="profile-menu-holder">
                        {isMobile && <ProfileModule username={username} email={email} avatarProps={avatarProps} />}
                        <Menu {...processedMenuProps} ref={menuRef} toggle={toggle} onBack={onBackHandler} />
                    </div>
                }
            >
                {Content}
            </Popover>
        );
    }

    return Content;
}

Profile.propTypes = {
    /**
     * Control with screenType  appearance of component
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Will display inside Profile
     */
    username: PropTypes.string,
    /**
     * Will display in mobile version
     */
    email: PropTypes.string,
    /**
     * Accepts same props as Tooltip component(molecules)
     */
    tooltipProps: PropTypes.shape({
        ...Tooltip.propTypes
    }),
    /**
     * Use this prop to control the Profile. Note the component will start not to open and close automatically
     */
    isOpen: PropTypes.bool,
    /**
     * Will called each time the Profile need to be toggled(child click, close button click, backdrop click).
     * (event: Event, isOpen: bool) => void
     */
    toggleHandler: PropTypes.func,
    /**
     * Fires event when user clicks on outside of Popover
     */
    onOutsideClick: PropTypes.func,
    /**
     * Accepts same props as Menu component(molecules)
     */
    menuProps: childrenOf([Menu]),
    /**
     *  Displays arrow icon for dropdown menu
     */
    showIcon: PropTypes.bool,
    /*
     * Provide an HTML element (ref.current) here to have your popover content appended to that element rather than document.body. This is useful if you'd like your popover to sit at a particular place within the DOM.
     */
    containerParent: PropTypes.element,
    /*
     * Set the distance between profile container and popover,if you not specify, by default will be 16(px).
     */
    padding: PropTypes.number,
    /*
     * set additional classname to popover
     */
    popoverClassName: PropTypes.string,
    /*
     * props for Avatar
     */
    avatarProps: PropTypes.shape({
        /**
         * Icon for Avatar,
         * Wont work if you've passed src
         */
        icon: PropTypes.string,
        /**
         * Img src avatar,
         * You should pass either children, or src, or icon
         */
        src: PropTypes.string,
        /**
         * Children element for avatar,
         * won't display if you've passed  src or icon
         */
        children: PropTypes.string,
        /**
         * Controls Avatar size
         */
        size: PropTypes.oneOf(['small', 'default', 'medium', 'big']),
        /**
         * Controls colors of avatar
         */
        color: PropTypes.oneOf(['default', 'green', 'red']),
        /**
         * Controls Avatar's shape
         */
        shape: PropTypes.oneOf(['circle', 'square']),
        /**
         * Fires event when user clicks on Avatar
         * (event: Event) => void
         */
        onClick: PropTypes.func,
        /*
         * Set tabIndex for component
         */
        tabIndex: PropTypes.number,
        /*
         * Set true to be able to select the text.
         */
        userSelect: PropTypes.bool
    }),
    /*
     * Languages props
     */
    languages: PropTypes.shape({
        /**
         * Languages  title,
         */
        title: PropTypes.string.isRequired,
        /**
         * Maximum height for languages container,
         */
        maxHeight: PropTypes.number,
        /**
         * List of languages,
         */
        data: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    title: PropTypes.string.isRequired,
                    svgFlag: PropTypes.node.isRequired
                })
            ])
        ).isRequired,
        /**
         * Active language id,
         */
        active: PropTypes.string.isRequired,
        /**
         * Fires event when user click on language;
         * (id: string) => void
         */
        onSelect: PropTypes.func.isRequired
    }),
    /*
     * Partners props
     */
    partners: PropTypes.shape({
        /**
         * Partners  title,
         */
        title: PropTypes.string.isRequired,
        /**
         * Maximum height for partners container,
         */
        maxHeight: PropTypes.number,
        /**
         * List of partners,
         */
        data: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                    title: PropTypes.string.isRequired
                })
            ])
        ).isRequired,
        /**
         * Active partner id,
         */
        active: PropTypes.string.isRequired,
        /**
         * Text for no data to display.
         */
        noDataText: PropTypes.string,
        /**
         * Fires event when user click on partner;
         * (id: string) => void
         */
        onSelect: PropTypes.func.isRequired
    }),
    /*
     * Custom avatar node.
     */
    customAvatar: PropTypes.node
};

Profile.defaultProps = {
    showIcon: true,
    tooltipProps: {},
    menuProps: {},
    avatarProps: {},
    toggleHandler: noop,
    onOutsideClick: noop,
    padding: 10,
    tabIndex: 1,
    userSelect: false
};

export default Profile;
