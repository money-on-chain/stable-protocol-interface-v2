import React, { Fragment, useState } from 'react';
import { Col, Row } from 'antd';
import { useProjectTranslation } from '../../helpers/translations';
import Stake from './Stake';
import PieChartComponent from './PieChart';
import PerformanceChart from '../PerformanceChart';
import Withdraw from './Withdraw';

export default function Staking(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const [activeTab, setActiveTab] = useState('tab1');

    return (
        <div className="Staking">
            <Row gutter={24} className="row-section">
                <Col span={10}>
                    <div className="card-system-status">
                        <div className="title">
                            <h1>{t('staking.title')}</h1>
                        </div>
                        <div className="tabs">
                            <button onClick={() => setActiveTab('tab1')} className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}>{t('staking.staking.tab1')}</button>
                            <button onClick={() => setActiveTab('tab2')} className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}>{t('staking.staking.tab2')}</button>
                        </div>
                        <div className="tab-divider"></div>
                        {/* Contenido del Tab */}
                        <div className="tab-content">
                            {activeTab === 'tab1' ? (
                                <Stake />
                            ) : (
                                <div>Contenido del Tab 2</div>
                            )}
                        </div>
                    </div>
                </Col>
                <Col span={7}>
                    <div className="card-system-status">
                        <div className="title">
                            <h1>{t('staking.distribution.title')}</h1>
                        </div>
                        <div className="tab-content">
                            <PieChartComponent />
                        </div>
                    </div>
                </Col>
                <Col span={7}>
                    <div className="card-system-status">
                        <div className="title">
                            <h1>{t('staking.performance.title')}</h1>
                        </div>
                        <div className="tab-content">
                            <PerformanceChart />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={24} className="row-section">
                <Col span={24}>
                    <div className="card-system-status">
                        <Withdraw />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
