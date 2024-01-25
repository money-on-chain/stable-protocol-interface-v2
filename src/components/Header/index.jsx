/* eslint-disable react-hooks/exhaustive-deps */
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
    const menu = {
        mainMenu: [
            {
                name: "Portfolio",
                action: goToPortfolio
            },
            {
                name: "Send",
                action: goToSend
            },
            {
                name: "Exchange",
                action: goToExchange
            },
            {
                name: "Performance",
                action: goToPerformance
            },
            {
                name: "Staking",
                action: goToStaking
            }
        ],
        dropdownMenu: [
            {
                name: "Liquidity Mining",
                action: goToLiquidityMining
            },
            {
                name: "Vesting",
                action: goToVesting
            }
        ]
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

    const updateMenuItemClasses = (menuItem) => {
        const pathMap = {
            "Portfolio": ['/', '/home'],
            "Send": ['/send'],
            "Exchange": ['/exchange'],
            "Performance": ['/performance'],
            "Staking": ['/staking'],
            "Liquidity Mining": ['/liquidity-mining'],
            "Vesting": ['/vesting']
        };

        const isActive = pathMap[menuItem.name]?.includes(location.pathname);
        return {
            ...menuItem,
            containerClassName: isActive ? 'menu-nav-item menu-nav-item-selected' : 'menu-nav-item',
            iClassName: `logo-${menuItem.name.toLowerCase().replace(" ", "-")} ${isActive ? 'color-filter-disabled' : 'color-filter-invert'}`
        };
    };

    const getMenuItemClasses = (itemName) => {
        let containerClassName = 'menu-nav-item';
        let iconClassName = `logo-${itemName.toLowerCase().replace(" ", "-")} color-filter-invert`;

        const pathMap = {
            "Portfolio": ['/', '/home'],
            "Send": ['/send'],
            "Exchange": ['/exchange'],
            "Performance": ['/performance'],
            "Staking": ['/staking'],
            "Liquidity Mining": ['/liquidity-mining'],
            "Vesting": ['/vesting']
        };

        if (pathMap[itemName]?.includes(location.pathname)) {
            containerClassName += ' menu-nav-item-selected';
            iconClassName = iconClassName.replace('color-filter-invert', 'color-filter-disabled');
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
                    <a onClick={() => setShowMoreDropdown(!showMoreDropdown)} className='menu-nav-item-more'>
                        <i className='logo-more color-filter-invert'></i>
                        <span className="menu-nav-item-title-more">More</span>
                    </a>
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
