import { Layout } from "antd";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useProjectTranslation } from "../../helpers/translations";
import { AuthenticateContext } from "../../context/Auth";
import DappVersion from "../DappVersion";
import ThemeMode from "../ThemeMode";
import settings from "../../settings/settings.json";
import menuOptionsData from "./menuOptions.json";
import Brand from "./Brand";

import "./Styles.scss";

const { Header } = Layout;

export default function SectionHeader(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthenticateContext);
    const [css_disable, setCssDisable] = useState("disable-nav-item");
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
    const menuRef = useRef(null);

    const [t, i18n, ns] = useProjectTranslation();
    const [lang, setLang] = useState("en");

    const MAX_MAIN_MENU_ITEMS = 5;

    // Process JSON for navigation menu
    const menuOptions = menuOptionsData.map((option) => ({
        ...option,
        name: () => t(option.nameKey), // Traducimos el nombre dinámicamente
    }));

    // Filter options based on project and language changes
    const [displayOptions, setDisplayOptions] = useState([]);
    const currentProject = settings.project;
    useEffect(() => {
        const filteredOptions = menuOptions
            .filter(
                (option) =>
                    option.allowedProjects.includes(currentProject) ||
                    option.allowedProjects.includes("all")
            )
            .map((option) => ({
                ...option,
                name: option.name, // No ejecutamos name() aquí, mantenemos la función
            }));
        setDisplayOptions(filteredOptions);
    }, [currentProject, lang, t]);

    // Manage main and more menu options
    const mainMenuOptions = displayOptions.slice(0, MAX_MAIN_MENU_ITEMS);
    const moreMenuOptions = displayOptions.slice(MAX_MAIN_MENU_ITEMS);

    const handleOptionClick = (path) => {
        setShowMoreDropdown(false);
        navigate(path);
        // Swap selected "More" option to main menu if it's in the "More" list
        const indexInMoreMenu = moreMenuOptions.findIndex(
            (opt) => opt.path === path
        );
        if (indexInMoreMenu > -1) {
            const newDisplayOptions = [...displayOptions];
            const selectedOption = newDisplayOptions.splice(
                MAX_MAIN_MENU_ITEMS + indexInMoreMenu,
                1
            )[0];
            newDisplayOptions.splice(
                MAX_MAIN_MENU_ITEMS - 1,
                0,
                selectedOption
            );
            setDisplayOptions(newDisplayOptions);
        }
    };

    const toggleLanguageMenu = () => {
        setShowLanguageMenu((prevState) => !prevState);
    };
    const toggleLanguageSubmenu = () =>
        setShowLanguageSubmenu(!showLanguageSubmenu);
    const pickLanguage = (code) => {
        i18n.changeLanguage(code);
        setLang(code);
        setShowLanguageMenu(false);
        localStorage.setItem("PreferredLang", code);
    };

    const languageOptions = [
        { name: t("language.en", { ns: ns }), code: "en" },
        { name: t("language.es", { ns: ns }), code: "es" },
    ];

    useEffect(() => {
        const preferredLanguage = localStorage.getItem("PreferredLang") || "en";
        pickLanguage(preferredLanguage);
    }, []);

    return (
        <Header>
            <div className="header-container">
                <Brand />
                <div className="central-menu">
                    {mainMenuOptions.map((option) => (
                        <a
                            onClick={() => handleOptionClick(option.path)}
                            className={`menu-nav-item ${css_disable} ${location.pathname === option.path ? "menu-nav-item-selected" : ""}`}
                            key={option.path}
                        >
                            <div
                                className={`${option.className}${location.pathname === option.path ? "-selected" : ""}`}
                            ></div>
                            <span className="menu-nav-item-title">
                                {option.name()}
                            </span>
                        </a>
                    ))}
                    {moreMenuOptions.length > 0 && (
                        <a
                            onClick={() =>
                                setShowMoreDropdown(!showMoreDropdown)
                            }
                            className="menu-nav-item-more"
                        >
                            <div className="logo-more"></div>
                            <span className="menu-nav-item-title-more">
                                {t("menuOptions.more")}
                            </span>{" "}
                            {showMoreDropdown && (
                                <div className="dropdown-menu show">
                                    {moreMenuOptions.map((option) => (
                                        <a
                                            onClick={() =>
                                                handleOptionClick(option.path)
                                            }
                                            className={`menu-nav-item ${css_disable} ${location.pathname === option.path ? "menu-nav-item-selected" : ""}`}
                                            key={option.path}
                                        >
                                            <i
                                                className={`${option.className}${location.pathname === option.path ? "-selected" : ""}`}
                                            ></i>
                                            <span className="menu-nav-item-title">
                                                {option.name()}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </a>
                    )}
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
                        <div className="logo-wallet"></div>
                    </div>
                    {showLanguageMenu && (
                        <div className="language-menu">
                            <div>
                                {languageOptions.map((option) => {
                                    return (
                                        <div
                                            className={`menu-item${lang === option.code ? "-selected" : ""}`}
                                            onClick={() =>
                                                pickLanguage(option.code)
                                            }
                                        >
                                            <span>{option.name}</span>
                                            {lang === option.code && (
                                                <div className="icon-checked"></div>
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
                    <div
                        className={`mobile-menu-icon ${isMobileMenuOpen ? "open" : ""}`}
                    ></div>
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
                                {displayOptions.map((option) => (
                                    <a
                                        onClick={() => {
                                            navigate(option.path);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="mobile-menu-item"
                                        key={option.path}
                                    >
                                        <div
                                            className={`${option.className} mobile__menu__icon`}
                                        ></div>
                                        <div>{option.name()}</div>{" "}
                                        {/* Ahora option.name() debería funcionar */}
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
                                                            className={`mobile-menu-item${lang === option.code ? "-selected" : ""}`}
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
