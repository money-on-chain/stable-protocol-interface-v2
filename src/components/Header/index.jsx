import { Layout } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import DappVersion from '../DappVersion';
import iconArrow from '../../assets/icons/arrow-sm-down.svg';
import ThemeMode from '../ThemeMode';
import settings from '../../settings/settings.json';

const { Header } = Layout;

export default function SectionHeader(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthenticateContext);
    const [css_disable, setCssDisable] = useState('disable-nav-item');
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
    const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false); //  Mobile language Sub Menu
    const menuRef = useRef(null); // Mobile Menu ref

    const [t, i18n, ns] = useProjectTranslation();
    const menuLimit = settings.project === 'voting' || settings.project === 'moc' || settings.project === 'roc' ? 4 : 5;

    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [lang, setLang] = useState('en');
    const [menuOptions, setMenuOptions] = useState([]);

    useEffect(() => {
        setMenuOptions([
            ... settings.project !== 'voting' ? [{
                name: t('menuOptions.portfolio'),
                className: 'logo-portfolio',
                action: goToPortfolio,
                isActive: true,
                pathMap: '/'
            }] : [],
            ... settings.project === 'voting' ? [{
                name: t('menuOptions.staking'),
                className: 'logo-staking',
                action: goToStaking,
                isActive: true,
                pathMap: '/'
            }] : [],
            ... settings.project !== 'voting' ? [{
                name: t('menuOptions.send'),
                className: 'logo-send',
                action: goToSend,
                isActive: true,
                pathMap: '/send'
            }] : [],
            ... settings.project !== 'voting' ? [{
                name: t('menuOptions.exchange'),
                className: 'logo-exchange',
                action: goToExchange,
                isActive: true,
                pathMap: '/exchange'
            }] : [],
            ... settings.project !== 'voting' ? [{
                name: t('menuOptions.performance'),
                className: 'logo-performance',
                action: goToPerformance,
                isActive: true,
                pathMap: '/performance'
            }] : [],
            ... settings.project !== 'voting' && settings.project !== 'roc' ? [{
                name: t('menuOptions.staking'),
                className: 'logo-staking',
                action: goToStaking,
                isActive: true,
                pathMap: '/staking'
            }] : [],
            ... settings.project !== 'roc' ? [{
                name: t('menuOptions.vesting'),
                className: 'logo-vesting',
                action: goToVesting,
                isActive: true,
                pathMap: '/vesting'
            }] : [],
            /*{
                name: t('menuOptions.liquidityMining'),
                className: 'logo-liquidity-mining',
                action: goToLiquidityMining,
                isActive: true,
                pathMap: '/liquidity-mining'
            },*/
            ... settings.project !== 'roc' ? [{
                name: t('menuOptions.voting'),
                className: 'logo-voting',
                action: goToVoting,
                isActive: true,
                pathMap: '/voting'
            }] : []
        ]);
    }, [t, lang]);
    useEffect(() => {
        if (
            auth.isLoggedIn &&
            auth.contractStatusData &&
            auth.userBalanceData
        ) {
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
    const goToVoting = () => {
        swapMenuOptions(t('menuOptions.voting'));
        setShowMoreDropdown(false);
        navigate('/voting');
    };

    const swapMenuOptions = (optionName) => {
        setMenuOptions((currentOptions) => {
            const currentIndex = currentOptions.findIndex(
                (item) => item.name === optionName
            );
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

    // Lang settings
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
    const toggleLanguageSubmenu = () =>
        setShowLanguageSubmenu(!showLanguageSubmenu);

    const pickLanguage = (code) => {
        i18n.changeLanguage(code);
        setLang(code);
        setShowLanguageMenu(false);
        localStorage.setItem('PreferredLang', code);
    };

    useEffect(() => {
        var preferredLanguage = '';
        if (
            localStorage.getItem('PreferredLang') !== 'en' &&
            localStorage.getItem('PreferredLang') !== 'es'
        ) {
            localStorage.setItem('PreferredLang', 'en');
            preferredLanguage = 'en';
        } else {
            preferredLanguage = localStorage.getItem('PreferredLang');
        }
        pickLanguage(preferredLanguage);
    }, []);

    // Close Mobile menu when user clicks outside the menu
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                isMobileMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
                setShowLanguageSubmenu(false); // Close Mobile Language Submenu
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMobileMenuOpen]);

    // Avoid Body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    });

    return (
        <Header>
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>
                <div className="central-menu">
                    {menuOptions.map((option, index) => {
                        const { containerClassName, iconClassName } =
                            getMenuItemClasses(
                                option.className,
                                option.pathMap
                            );
                        if (option.isActive && index < menuLimit) {
                            return (
                                <a
                                    onClick={option.action}
                                    className={containerClassName}
                                    key={option.name}
                                >
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">
                                        {menuOptions[index].name}
                                    </span>
                                </a>
                            );
                        } else return null;
                    })}
                    {menuLimit > 4 && (
                        <a
                            onClick={() =>
                                setShowMoreDropdown(!showMoreDropdown)
                            }
                            className="menu-nav-item-more"
                        >
                            <i className="logo-more color-filter-invert"></i>
                            <span className="menu-nav-item-title-more">
                                {t('menuOptions.more')}
                            </span>
                        </a>
                    )}
                    <div
                        className={`dropdown-menu ${showMoreDropdown ? 'show' : ''}`}
                    >
                        {menuOptions.slice(-2).map((option, index) => {
                            const { containerClassName, iconClassName } =
                                getMenuItemClasses(
                                    option.className,
                                    option.pathMap
                                );
                            return (
                                <a
                                    onClick={option.action}
                                    className={containerClassName}
                                    key={option.name}
                                >
                                    <i className={iconClassName}></i>
                                    <span className="menu-nav-item-title">
                                        {option.name}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="wallet-user">
                    <div
                        className="wallet-translation"
                        onClick={toggleLanguageMenu}
                    >
                        <a className="translation-selector">
                            {
                                languageOptions.find(
                                    (option) => option.code === lang
                                ).name
                            }
                        </a>
                        <i className="logo-translation"></i>
                    </div>
                    <div className="wallet-address">
                        <a onClick={auth.onShowModalAccount}>
                            {auth.accountData.truncatedAddress}
                        </a>
                        <i className="logo-wallet"></i>
                    </div>
                    {showLanguageMenu && (
                        <div className="language-menu">
                            <div>
                                {languageOptions.map((option) => {
                                    return (
                                        <div
                                            className={`menu-item${lang === option.code ? '-selected' : ''}`}
                                            onClick={() =>
                                                pickLanguage(option.code)
                                            }
                                        >
                                            <span>{option.name}</span>
                                            {lang === option.code && (
                                                <img
                                                    src={iconArrow}
                                                    alt={'ArrowUp'}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {/* Mobile Menu Button */}
                <div
                    className="mobile__menu__button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i
                        className={`mobile-menu-icon ${isMobileMenuOpen ? 'open' : ''}`}
                    ></i>
                </div>

                {/* Overlay & Mobile Menu*/}
                {isMobileMenuOpen && (
                    <>
                        <div className="mobile-menu-overlay"></div>
                        <div className="mobile-menu" ref={menuRef}>
                            <button
                                className="mobile-menu-close"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="icon__close__menu"></div>
                            </button>
                            <div className="mobile__menu__options">
                                {menuOptions.map((option) => (
                                    <a
                                        onClick={() => {
                                            option.action();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="mobile-menu-item"
                                        key={option.name}
                                    >
                                        <div
                                            className={
                                                option.className +
                                                ' mobile__menu__icon'
                                            }
                                        ></div>
                                        <div>{option.name}</div>
                                    </a>
                                ))}
                                <div className="language__options">
                                    <div
                                        className="mobile-language-selector"
                                        onClick={toggleLanguageSubmenu}
                                    >
                                        {showLanguageSubmenu ? (
                                            <div className="mobile-language-title">
                                                Select Language:
                                            </div>
                                        ) : (
                                            languageOptions.find(
                                                (option) => option.code === lang
                                            ).name
                                        )}
                                        {/* Language Menu for Mobile */}
                                        {showLanguageSubmenu && (
                                            <div className="mobile-language-submenu">
                                                {/* Language Submenú for Mobile */}
                                                {languageOptions.map(
                                                    (option) => (
                                                        <div
                                                            key={option.code}
                                                            className={`mobile-menu-item${lang === option.code ? '-selected' : ''}`}
                                                            onClick={() =>
                                                                pickLanguage(
                                                                    option.code
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                {option.name}
                                                                <span> •</span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ThemeMode />
                            <DappVersion />
                        </div>
                    </>
                )}
            </div>
        </Header>
    );
}
