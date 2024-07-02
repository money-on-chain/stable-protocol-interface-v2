import { Layout } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjectTranslation } from '../../helpers/translations';

import { AuthenticateContext } from '../../context/Auth';
import ModalAccount from '../Modals/Account';

// import lang_en from  '../../assets/icons/lang_en.svg';
// import lang_es from  '../../assets/icons/lang_en.svg';
import iconArrow from '../../assets/icons/arrow-sm-down.svg';
const { Header } = Layout;

export default function SectionHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthenticateContext);
    const [css_disable, setCssDisable] = useState('disable-nav-item');
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [t, i18n, ns] = useProjectTranslation();
    const menuLimit = 5;

    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [lang, setLang] = useState('en');
    const [menuOptions, setMenuOptions] = useState([]);
    useEffect(() => {
        setMenuOptions([
            {
                name: t('menuOptions.portfolio'),
                className: 'logo-portfolio',
                action: goToPortfolio,
                isActive: true,
                pathMap: '/'
            },
            {
                name: t('menuOptions.send'),
                className: 'logo-send',
                action: goToSend,
                isActive: true,
                pathMap: '/send'
            },
            {
                name: t('menuOptions.exchange'),
                className: 'logo-exchange',
                action: goToExchange,
                isActive: true,
                pathMap: '/exchange'
            },
            {
                name: t('menuOptions.performance'),
                className: 'logo-performance',
                action: goToPerformance,
                isActive: true,
                pathMap: '/performance'
            },
            {
                name: t('menuOptions.staking'),
                className: 'logo-staking',
                action: goToStaking,
                isActive: true,
                pathMap: '/staking'
            },
            {
                name: t('menuOptions.liquidityMining'),
                className: 'logo-liquidity-mining',
                action: goToLiquidityMining,
                isActive: true,
                pathMap: '/liquidity-mining'
            },
            {
                name: t('menuOptions.vesting'),
                className: 'logo-vesting',
                action: goToVesting,
                isActive: true,
                pathMap: '/vesting'
            }
        ]);
    }, [t, lang]);
    useEffect(() => {
        if (auth.isLoggedIn && auth.contractStatusData && auth.userBalanceData) {
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
        swapMenuOptions(t('menuOptions.staking'));
        setShowMoreDropdown(false);
        navigate('/staking');
    };
    const goToLiquidityMining = () => {
        swapMenuOptions(t('menuOptions.liquidityMining'));
        setShowMoreDropdown(false);
        navigate('/liquidity-mining');
    };
    const goToVesting = () => {
        swapMenuOptions(t('menuOptions.vesting'));
        setShowMoreDropdown(false);
        navigate('/vesting');
    };

    const swapMenuOptions = (optionName) => {
        setMenuOptions((currentOptions) => {
            const currentIndex = currentOptions.findIndex((item) => item.name === optionName);
            if (currentIndex > menuLimit - 1) {
                const newMenuOptions = [...currentOptions];
                const [selectedOption] = newMenuOptions.splice(currentIndex, 1);
                newMenuOptions.splice(menuLimit - 1, 0, selectedOption);
                return newMenuOptions;
            }
            return currentOptions;
        });
    };

    const getMenuItemClasses = (logoClass, path) => {
        let containerClassName = `menu-nav-item ` + css_disable;
        const isSelected = path === location.pathname;
        let iconClassName = `${logoClass}${isSelected ? '-selected' : ''} ${isSelected ? 'color-filter-disabled' : 'color-filter-invert'}`;

        if (isSelected) {
            containerClassName += ' menu-nav-item-selected';
        }

        return { containerClassName, iconClassName };
    };
    //Lang settings
    const languageOptions = [
        {
            name: t(`language.en`, {
                ns: ns
            }),
            code: 'en'
        },
        {
            name: t(`language.es`, {
                ns: ns
            }),
            code: 'es'
        }
    ];
    const toggleLanguageMenu = () => {
        setShowLanguageMenu((prevState) => !prevState);
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
                        const { containerClassName, iconClassName } = getMenuItemClasses(option.className, option.pathMap);
                        if (option.isActive && index < menuLimit) {
                            return (
                                <a onClick={option.action} className={containerClassName} key={option.name}>
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">{menuOptions[index].name}</span>
                                </a>
                            );
                        } else return null;
                    })}
                    {menuLimit > 4 && (
                        <a onClick={() => setShowMoreDropdown(!showMoreDropdown)} className="menu-nav-item-more">
                            <i className="logo-more color-filter-invert"></i>
                            <span className="menu-nav-item-title-more">{t('menuOptions.more')}</span>
                        </a>
                    )}
                    <div className={`dropdown-menu ${showMoreDropdown ? 'show' : ''}`}>
                        {menuOptions.slice(-2).map((option, index) => {
                            const { containerClassName, iconClassName } = getMenuItemClasses(option.className, option.pathMap);
                            return (
                                <a onClick={option.action} className={containerClassName} key={option.name}>
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">{option.name}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="wallet-user">
                    <div className="wallet-translation" onClick={toggleLanguageMenu}>
                        <a className="translation-selector"> {languageOptions.find((option) => option.code === lang).name} </a>{' '}
                        <i className="logo-translation"></i>
                    </div>
                    <div className="wallet-address">
                        {/*<a onClick={}>{auth.accountData.truncatedAddress}</a>{' '}*/}
                        <ModalAccount truncatedAddress={auth.accountData.truncatedAddress}></ModalAccount>
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
                                            <span>{option.name}</span>
                                            {lang === option.code && <img src={iconArrow} alt={'ArrowUp'} />}
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
