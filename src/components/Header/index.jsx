import { Layout } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjectTranslation } from '../../helpers/translations';

import { AuthenticateContext } from '../../context/Auth';
import ModalAccount from '../Modals/Account';
import { func } from 'prop-types';

import lang_en from  '../../assets/icons/lang_en.svg';
import lang_es from  '../../assets/icons/lang_en.svg';
import iconArrow from '../../assets/icons/arrow-sm-down.svg';
const { Header } = Layout;


export default function SectionHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthenticateContext);
    const [css_disable, setCssDisable] = useState( 'disable-nav-item');
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [t, i18n, ns] = useProjectTranslation();
    const [menuLimit, setMenuLimit] = useState(4);

    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [lang, setLang] = useState('en');
    useEffect(() => {
        if (auth.isLoggedIn &&
            auth.contractStatusData &&
            auth.userBalanceData) {
                setCssDisable('');
        }
    }, [auth]);

    const goToPortfolio = () => {
        setShowMoreDropdown(false);
        navigate('/');
    };

    const goToExchange = () => {
        setShowMoreDropdown(false);
        navigate('/exchange');
    };

    const goToSend = () => {
        setShowMoreDropdown(false);
        navigate('/send');
    };

    const goToPerformance = () => {
        setShowMoreDropdown(false);
        navigate('/performance');
    };
    const goToStaking = () => {
        swapMenuOptions("Staking");
        setShowMoreDropdown(false);
        navigate('/staking');
    };
    const goToLiquidityMining = () => {
        swapMenuOptions("Liquidity Mining");
        setShowMoreDropdown(false);
        navigate('/liquidity-mining');
    }
    const goToVesting = () => {
        swapMenuOptions("Vesting");
        setShowMoreDropdown(false);
        navigate('/vesting');
    }
    const menu = [
            {
                name: t('menuOptions.portfolio'),
                text: t('menuOptions.portfolio'),
                className: 'logo-portfolio',
                action: goToPortfolio,
                isActive: true
            },
            {
                name: t('menuOptions.send'),
                text: t('menuOptions.send'),
                className: 'logo-send',
                action: goToSend,
                isActive: true
            },
            {
                name: t('menuOptions.exchange'),
                text: t('menuOptions.exchange'),
                className: 'logo-exchange',
                action: goToExchange,
                isActive: true
            },
            {
                name: "Performance",
                text: t('menuOptions.performance'),
                className: 'logo-performance',
                action: goToPerformance,
                isActive: true
            },
            {
                name: "Staking",
                text: t('menuOptions.staking'),
                className: 'logo-staking',
                action: goToStaking,
                isActive: true
            },
            {
                name: "Liquidity Mining",
                text: t('menuOptions.liquidityMining'),
                className: 'logo-liquidity-mining',
                action: goToLiquidityMining,
                isActive: true
            },
            {
                name: t('menuOptions.vesting'),
                text: t('menuOptions.vesting'),
                className: 'logo-vesting',
                action: goToVesting,
                isActive: true
            }
    ];

    const getActiveTabsNumber = () => {
        let activeTabs = 0;
        menu.mainMenu.forEach(item => {
            if (item.isActive) {
                activeTabs++;
            }
        });
        menu.dropdownMenu.forEach(item => {
            if (item.isActive) {
                activeTabs++;
            }
        })
        return activeTabs;
    }
    const [menuOptions, setMenuOptions] = useState(menu);
    const swapMenuOptions = (optionName) => {
        setMenuOptions(prevState => {
            const dropdownIndex = prevState.dropdownMenu.findIndex(item => item.name === optionName);
            if (dropdownIndex !== -1) {
                const foundInDropdown = prevState.dropdownMenu[dropdownIndex];
                const lastElementInMain = prevState.mainMenu[prevState.mainMenu.length - 1];

                const newMainMenu = [...prevState.mainMenu];
                newMainMenu[newMainMenu.length - 1] = foundInDropdown;

                const newDropdownMenu = [...prevState.dropdownMenu];
                newDropdownMenu[dropdownIndex] = lastElementInMain;

                return {
                    mainMenu: newMainMenu.map(item => updateMenuItemClasses(item)),
                    dropdownMenu: newDropdownMenu.map(item => updateMenuItemClasses(item))
                };
            } else {
                return prevState;
            }
        });
    };
    const pathMap = [
        ['/'],
        ['/send'],
        ['/exchange'],
        ['/performance'],
        ['/staking'],
        ['/liquidity-mining'],
        ['/vesting']
    ];
    const updateMenuItemClasses = (menuItem) => {
        const isActive = pathMap[menuItem.name]?.includes(location.pathname);
        return {
            ...menuItem,
            containerClassName: isActive ? 'menu-nav-item menu-nav-item-selected' : `menu-nav-item ` + css_disable,
            iClassName: `logo-${menuItem.name.toLowerCase().replace(" ", "-")} ${isActive ? 'color-filter-disabled' : 'color-filter-invert'}`

        };
    };

    const getMenuItemClasses = (logoClass, index) => {
        let containerClassName = `menu-nav-item ` + css_disable;
        const isSelected = pathMap[index]?.includes(location.pathname);
        let iconClassName = `${logoClass}${isSelected ? '-selected' : ''} ${isSelected ? 'color-filter-disabled' : 'color-filter-invert'}`;
        
        if (isSelected) {
            containerClassName += ' menu-nav-item-selected';
        }
    
        return { containerClassName, iconClassName };
    };
    //Lang settings
    const languageOptions = [
        { name: t(`language.en`, {
            ns: ns
        }), code: "en", icon: lang_en},
        { name: t(`language.es`, {
            ns: ns
        }), code: "es", icon: lang_es}
    ];
    const toggleLanguageMenu = () => {
        setShowLanguageMenu(prevState => !prevState);
    };
    const pickLanguage = (code) => {
        i18n.changeLanguage(code);
        setLang(code);
        setShowLanguageMenu(false);
    };
    return (
        <Header>
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>

                <div className="central-menu">
                    {menuOptions.map((option, index) => {
                        const { containerClassName, iconClassName } = getMenuItemClasses(option.className, index);
                        if (option.isActive && index < menuLimit) {
                            return (
                                <a
                                    onClick={option.action}
                                    className={containerClassName}
                                    key={option.name}
                                >
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">{menuOptions[index].name}</span>
                                </a>
                            );
                        }
                        else return null;
                    }
                    )}
                    {/*
                    {getActiveTabsNumber() > 5 && <a onClick={() => setShowMoreDropdown(!showMoreDropdown)} className='menu-nav-item-more'>
                        <i className='logo-more color-filter-invert'></i>
                        <span className="menu-nav-item-title-more">{t('menuOptions.more')}</span>
                    </a>}
                    <div className={`dropdown-menu ${showMoreDropdown ? 'show' : ''}`}>
                        {menuOptions.dropdownMenu.map((option) => {
                            const { containerClassName, iconClassName } = getMenuItemClasses(option.name);
                            return (
                                <a
                                    onClick={option.action}
                                    className={containerClassName}
                                    key={option.name}
                                >
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">{option.name}</span>
                                </a>
                            );
                        })}
                    </div>*/}
                </div>
                <div className="wallet-user">
                    <div className="wallet-translation" onClick={toggleLanguageMenu}>
                        <a href="#" className="translation-selector" >
                            {' '}
                            {languageOptions.find(option => option.code === lang).name }{' '}
                        </a>{' '}
                        <i className="logo-translation"></i>
                    </div>
                    <div className="wallet-address">
                        {/*<a onClick={}>{auth.accountData.truncatedAddress}</a>{' '}*/}
                        <ModalAccount
                            truncatedAddress={auth.accountData.truncatedAddress}
                        ></ModalAccount>
                        <i className="logo-wallet"></i>
                    </div>
                    {showLanguageMenu && (
                        <div className="language-menu">
                            <div>
                                {languageOptions.map((option) => {
                                    return (
                                        <div 
                                            className={`menu-item${lang === option.code ? '-selected' : ''}`}
                                            onClick={() => pickLanguage(option.code)}
                                        >
                                            {/*<div className="menu-icon">
                                                <img src={option.icon} alt={option.name} />
                                    </div>*/}
                                            <span>{option.name}</span>
                                           {/* {lang === option.code && <img src={iconArrow} alt={'ArrowUp'} />} */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Header>
    );
}

function setMenuIcon(option) {
    const [t, i18n, ns] = useProjectTranslation();
    console.log (option)

    switch (option) {
        case t('menuOptions.porfolio') :
            return 'Portfolio'
        case t('menuOptions.send') :
            return 'Send'
        case t('menuOptions.exchange') :
            return 'Exchange'
        case t('menuOptions.performance') :
            return 'Performance'
        case t('menuOptions.staking') :
            return 'Staking'
    }
} 
