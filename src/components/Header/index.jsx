import { Layout } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';

const { Header } = Layout;

export default function SectionHeader() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const navigate = useNavigate();
    const location = useLocation();

    const cssSelector = {
        'home': {'text': 'menu-nav-item', 'icon': 'color-filter-invert'},
        'exchange': {'text': 'menu-nav-item', 'icon': 'color-filter-invert'},
        'send': {'text': 'menu-nav-item', 'icon': 'color-filter-invert'},
        'performance': {'text': 'menu-nav-item', 'icon': 'color-filter-invert'},
        'staking': {'text': 'menu-nav-item', 'icon': 'color-filter-invert'},
    }

    switch (location.pathname) {
        case '/':
        case '/home':
            cssSelector.home.text += ' menu-nav-item-selected'
            cssSelector.home.icon = 'color-filter-disabled'
            break
        case '/exchange':
            cssSelector.exchange.text += ' menu-nav-item-selected'
            cssSelector.exchange.icon = 'color-filter-disabled'
            break
        case '/send':
            cssSelector.send.text += ' menu-nav-item-selected'
            cssSelector.send.icon = 'color-filter-disabled'
            break
        case '/performance':
            cssSelector.performance.text += ' menu-nav-item-selected'
            cssSelector.performance.icon = 'color-filter-disabled'
            break
        case '/staking':
            cssSelector.staking.text += ' menu-nav-item-selected'
            cssSelector.staking.icon = 'color-filter-disabled'
            break
        default:
            cssSelector.home.text += ' menu-nav-item-selected'
            cssSelector.home.icon = 'color-filter-disabled'
            break
    }

    const goToPortfolio = () => {
        navigate('/');
    };

    const goToExchange = () => {
        navigate('/exchange');
    };

    const goToSend = () => {
        navigate('/send');
    };

    const goToPerformance = () => {
        navigate('/performance');
    };

    const goToStaking = () => {
        navigate('/staking');
    };

    return (
        <Header>
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>

                <div className="central-menu">
                    <a onClick={goToPortfolio} className={cssSelector.home.text}>
                        <i className={`logo-home ${cssSelector.home.icon}`}></i>{' '}
                        <span className="menu-nav-item-title">Portfolio</span>{' '}
                    </a>
                    <a onClick={goToSend} className={cssSelector.send.text}>
                        <i className={`logo-send ${cssSelector.send.icon}`}></i>{' '}
                        <span className="menu-nav-item-title">Send</span>{' '}
                    </a>
                    <a onClick={goToExchange} className={cssSelector.exchange.text}>
                        <i className={`logo-exchange ${cssSelector.exchange.icon}`}></i>{' '}
                        <span className="menu-nav-item-title">Exchange</span>
                    </a>
                    <a onClick={goToPerformance} className={cssSelector.performance.text}>
                        <i className={`logo-performance ${cssSelector.performance.icon}`}></i>{' '}
                        <span className="menu-nav-item-title">Performance</span>{' '}
                    </a>
                    <a onClick={goToStaking} className={cssSelector.staking.text}>
                        <i className={`logo-i-staking ${cssSelector.staking.icon}`}></i>{' '}
                        <span className="menu-nav-item-title">Staking</span>{' '}
                    </a>
                </div>

                <div className="wallet-user">
                    <div className="wallet-translation">
                        <a href="#" className="translation-selector"> English </a>{' '}
                        <i className="logo-translation"></i>
                    </div>
                    <div className="wallet-address">
                        <a href="#">{auth.accountData.truncatedAddress}</a>{' '}
                        <i className="logo-wallet"></i>
                    </div>
                </div>
            </div>
        </Header>
    );
}
