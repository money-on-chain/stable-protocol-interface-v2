/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthenticateContext } from '../../context/Auth';
import ModalAccount from '../Modals/Account';

const { Header } = Layout;

export default function SectionHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthenticateContext);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
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
    //Function to customize if the option needs to be active or not in roc or flipago
    const getIsActive = (optionName) => {
        switch (optionName) {
            case "Staking":
                return process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc';
            case "Liquidity Mining":
                return process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc';
            case "Vesting":
                return process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc';
            default:
                return true;
            //Add other future options here
        }
    }
    const menu = {
        mainMenu: [
            {
                name: "Portfolio",
                action: goToPortfolio,
                isActive: true
            },
            {
                name: "Send",
                action: goToSend,
                isActive: true
            },
            {
                name: "Exchange",
                action: goToExchange,
                isActive: true
            },
            {
                name: "Performance",
                action: goToPerformance,
                isActive: true
            },
            {
                name: "Staking",
                action: goToStaking,
                isActive: false
            }
        ],
        dropdownMenu: [
            {
                name: "Liquidity Mining",
                action: goToLiquidityMining,
                isActive: false
            },
            {
                name: "Vesting",
                action: goToVesting,
                isActive: false
            }
        ]
    }
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
    const pathMap = {
        "Portfolio": ['/', '/home'],
        "Send": ['/send'],
        "Exchange": ['/exchange'],
        "Performance": ['/performance'],
        "Staking": ['/staking'],
        "Liquidity Mining": ['/liquidity-mining'],
        "Vesting": ['/vesting']
    };
    const updateMenuItemClasses = (menuItem) => {
        const isActive = pathMap[menuItem.name]?.includes(location.pathname);
        return {
            ...menuItem,
            containerClassName: isActive ? 'menu-nav-item menu-nav-item-selected' : 'menu-nav-item',
            iClassName: `logo-${menuItem.name.toLowerCase().replace(" ", "-")} ${isActive ? 'color-filter-disabled' : 'color-filter-invert'}`
        };
    };

    const getMenuItemClasses = (itemName) => {
        let containerClassName = 'menu-nav-item';
        const isSelected = pathMap[itemName]?.includes(location.pathname);
        let iconClassName = `logo-${itemName.toLowerCase().replace(" ", "-")}${isSelected ? '-selected' : ''} ${isSelected ? 'color-filter-disabled' : 'color-filter-invert'}`;
        
        if (isSelected) {
            containerClassName += ' menu-nav-item-selected';
        }
    
        return { containerClassName, iconClassName };
    };

    return (
        <Header>
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>

                <div className="central-menu">
                    {menuOptions.mainMenu.map((option) => {
                        const { containerClassName, iconClassName } = getMenuItemClasses(option.name);
                        if (option.isActive) {
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
                        }
                        else return null;
                    })}
                    {getActiveTabsNumber() > 5 && <a onClick={() => setShowMoreDropdown(!showMoreDropdown)} className='menu-nav-item-more'>
                        <i className='logo-more color-filter-invert'></i>
                        <span className="menu-nav-item-title-more">More</span>
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
                    </div>
                </div>
                <div className="wallet-user">
                    <div className="wallet-translation">
                        <a href="#" className="translation-selector">
                            {' '}
                            English{' '}
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
                </div>
            </div>
        </Header>
    );
}
