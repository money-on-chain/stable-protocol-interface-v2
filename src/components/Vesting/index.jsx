import React, { useContext } from 'react';
import { Alert, Button, Space } from 'antd';
import VestingSchedule from '../../components/Tables/VestingSchedule';
import settings from '../../settings/settings.json';
import { useProjectTranslation } from '../../helpers/translations';

export default function Performance(props) {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="section vesting">
            {/* <Alert
                className="alert-success"
                message="Success Tips"
                description="This is a warning notice about copywriting."
                type="success"
                showIcon
                closable
            />{' '}
            <Alert className="alert-info" message={t('vesting.alert.cta')} description={t('vesting.alert.cta')} type="info" showIcon closable />{' '}
            <Alert
                className="alert-warning"
                message="Warning Tips"
                description="This is a warning notice about copywriting."
                type="warning"
                showIcon
                closable
            />{' '}
            <Alert
                className="alert-error"
                message="Error Tips"
                description="This is a warning notice about copywriting."
                type="error"
                showIcon
                closable
            />{' '}
            <Alert
                className="alert-permanent"
                message={t('vesting.alert.title')}
                description={t('vesting.alert.explanation')}
                type="error"
                showIcon
                // closable
                action={
                    <Button size="small" type="custom">
                        {t('vesting.alert.cta')}
                    </Button>
                }
            />{' '} */}
            {/* <div className="layout-card using-vesting-alert">
                {' '}
                <div className="content">
                    <div className="alert-icon"></div>
                    <div className="info">
                        <h2>{t('vesting.alert.title')}</h2>
                        <p>{t('vesting.alert.explanation')}</p>
                    </div>
                </div>
                <div className="wallet-button">{t('vesting.alert.cta')}</div>
            </div> */}{' '}
            {/*

             VESTING ONBOARDING PAGE 1

             */}
            <div id="vesting-onboarding" className="layout-card section__innerCard--big page1">
                <div className="layout-card-title">
                    <h1>{t('vesting.cardTitle')}</h1>
                </div>
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>{t('vesting.vestingOnboarding.page1.stepTitle')}</h2>
                        <p>{t('vesting.vestingOnboarding.page1.explanation1')}</p>
                        <p>{t('vesting.vestingOnboarding.page1.explanation2')}</p>
                        <div className="cta">
                            <button className="button secondary">{t('vesting.vestingOnboarding.page1.ctaSecondary')}</button> <button className="button">{t('vesting.vestingOnboarding.page1.ctaPrimary')}</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator active"></div>
                            <div className="page-indicator"></div>
                            <div className="page-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/*

             VESTING ONBOARDING PAGE 2

             */}
            <div id="vesting-onboarding" className="layout-card section__innerCard--big page2">
                <div className="layout-card-title">
                    <h1>{t('vesting.cardTitle')}</h1>
                </div>
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>{t('vesting.vestingOnboarding.page2.stepTitle')}</h2>
                        <div className="input-container">
                            <label className="claim-code-input-label">
                            {t('vesting.vestingOnboarding.page2.label')}
                                <textarea
                                    type="text"
                                    className="claim-code-input"
                                    placeholder={t('vesting.vestingOnboarding.page2.placeholder')}
                                />
                            </label>
                        </div>
                        <div className="options">
                            <button className="button--small">{t('vesting.vestingOnboarding.page2.loadButton')}</button>
                        </div>
                        <br />
                        <div className="explanation">
                            <p>{t('vesting.vestingOnboarding.page2.explanation1')}
                            </p>
                        </div>
                        <div className="cta">
                            <button className="button secondary">{t('vesting.vestingOnboarding.page2.ctaSecondary')}</button>
                            <button className="button">{t('vesting.vestingOnboarding.page2.ctaPrimary')}</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator"></div>
                            <div className="page-indicator active"></div>
                            <div className="page-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/*

            VESTING ONBOARDING PAGE 3

            */}
            <div id="vesting-onboarding" className="layout-card section__innerCard--big page3">
                <div className="layout-card-title">
                    <h1>{t('vesting.cardTitle')}</h1>
                </div>
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>{t('vesting.vestingOnboarding.page3.stepTitle')}</h2>
                        <p>{t('vesting.vestingOnboarding.page3.explanation1')}</p>
                        <p>{t('vesting.vestingOnboarding.page3.explanation2')}</p>
                        <div className="tx-details">
                        {t('vesting.vestingOnboarding.page3.transactionId')}
                            <div className="copy-button">
                                oxba8cd957…72adM
                                <div className="copy-icon"></div>
                            </div>
                        </div>
                        <div className="cta">
                            <button className="button">{t('vesting.vestingOnboarding.page3.ctaPrimary')}</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator"></div>
                            <div className="page-indicator"></div>
                            <div className="page-indicator active"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/*

             VESTING SCHEDULE

             */}
                <div id="vesting-info" className="layout-card section__innerCard--small">
                    <div className="layout-card-title">
                        <h1>{t('vesting.cardTitle')}</h1>
                        <div id="vesting-verification">
                            <div className="verification-icon"></div> {t('vesting.status.verified')}
                        </div>
                    </div>
                    <div id="vesting-info-content">
                        <div>
                            <div id="vesting-moc-available" className="vesting-data">
                                0.000000000000
                            </div>
                            <div className="vesting-label">{t('vesting.tokensAvailableToWithdraw')}</div>
                        </div>
                        <div id="withdraw-cta">
                            Send to my wallet <div className="withdraw-button"></div>
                        </div>
                    </div>
                </div>{' '}
                <div id="vesting-distribution" className="layout-card section__innerCard--small">
                    <div id="moc-ready">
                        <div id="vestingDash-readyToWithdraw" className="vesting__data">
                            0.000000000000
                        </div>
                        <div className="vesting__label">
                               {t('vesting.dashDistribution.vested')}
                        </div>
                    </div>
                    <div id="dashboard"> 
                        <div id="vestingDash-vested" className="vesting__data">
                            0.000000000000
                        </div>
                        <div className="vesting__label">
                            {t('vesting.dashDistribution.released')}
                        </div>
                    </div>
                    <div id="moc3">
                        <div id="vestingDash-staked" className="vesting__data">
                            0.000000000000
                        </div>
                        <div className="vesting__label">
                        {t('vesting.dashDistribution.staked')}
                        </div>
                    </div>                    <div id="moc4">
                        <div id="vestingDash-unstaking" className="vesting__data">
                            0.000000000000
                        </div>
                        <div className="vesting__label">
                            {t('vesting.dashDistribution.unstaking')}
                </div>
                    </div>
                </div>
            <div id="vesting-schedudle" className="layout-card section__innerCard--big">
                <div className="layout-card-title">
                    <h1>Vesting Release Schedule</h1>
                </div>
                <div id="moc-total">
                    <div className="total-data">0.000000000000 FLIP</div>
                    <div className="vesting-label">Schedduled (vested+released)</div>
                </div>
                <div id="vesting-schedule-table">
                    <VestingSchedule />
                </div>
            </div>
        </div>
    );
}
