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

    const goToPortfolio = () => {
        navigate('/');
    };

    const goToExchange = () => {
        navigate('/exchange');
    };

    return (
        <Header>
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-app"></div>
                </div>

                <div className="central-menu">
                    <a onClick={goToPortfolio} className="menu-nav-item">
                        <i className="logo-home"></i>{' '}
                        <span className="menu-nav-item-title">Portfolio</span>{' '}
                    </a>
                    <a className="menu-nav-item">
                        <i className="logo-send"></i>{' '}
                        <span className="menu-nav-item-title">Send</span>{' '}
                    </a>
                    <a onClick={goToExchange} className="menu-nav-item">
                        <i className="logo-exchange"></i>{' '}
                        <span className="menu-nav-item-title">Exchange</span>
                    </a>
                    <a className="menu-nav-item">
                        <i className="logo-performance"></i>{' '}
                        <span className="menu-nav-item-title">Staking</span>{' '}
                    </a>
                    <a className="menu-nav-item">
                        <i className="logo-more"></i>{' '}
                        <span className="menu-nav-item-title">
                            More Options
                        </span>{' '}
                    </a>
                </div>

                <div className="wallet-user">
                    <div className="wallet-translation">
                        <a href="#"> EN </a>{' '}
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
