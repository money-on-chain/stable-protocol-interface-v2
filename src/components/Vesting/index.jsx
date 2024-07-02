import React, { useContext } from 'react';
import VestingSchedule from '../../components/Tables/VestingSchedule';
import settings from '../../settings/settings.json';
import { useProjectTranslation } from '../../helpers/translations';

export default function Performance(props) {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="vesting">
            {' '}
            <div className="layout-card using-vesting-alert">
                {' '}
                <div className="content">
                    <div className="alert-icon"></div>
                    <div className="info">
                        <h2>{t('vesting.alert.title')}</h2>
                        <p>{t('vesting.alert.explanation')}</p>
                    </div>
                </div>
                <div className="wallet-button">{t('vesting.alert.cta')}</div>
            </div>
            <div className="two-columns">
                <div id="vesting-info" className="layout-card">
                    <div className="layout-card-title">
                        <h1>{t('vesting.title')}</h1>
                        <div id="vesting-verification">
                            <div className="verification-icon"></div> {t('vesting.status.verified')}
                        </div>{' '}
                    </div>
                    <div id="vesting-info-content">
                        <div>
                            <div id="vesting-moc-available" className="vesting-data">
                                0.000000000000
                            </div>
                            <div className="vesting-label">MOC available to withdraw</div>
                        </div>
                        <div id="withdraw-cta">
                            Withdraw to my wallet <div className="withdraw-button"></div>
                        </div>
                    </div>
                </div>{' '}
                <div id="vesting-distribution" className="layout-card">
                    <div id="moc-ready">
                        <div id="vesting-moc-ready" className="vesting-data">
                            0.000000000000
                        </div>
                        <div className="vesting-label">Ready</div>
                    </div>
                    <div id="moc2">
                        <div id="vesting-moc-vested" className="vesting-data">
                            0.000000000000
                        </div>
                        <div className="vesting-label">Vested</div>
                    </div>
                    <div id="moc3">
                        <div id="vesting-moc-staking" className="vesting-data">
                            0.000000000000
                        </div>
                        <div className="vesting-label">Staking</div>
                    </div>
                    <div id="moc4">
                        <div id="vestiing-moc-readyToWithdraw" className="vesting-data">
                            0.000000000000
                        </div>
                        <div className="vesting-label">MOC ready to withdraw</div>
                    </div>
                </div>{' '}
            </div>
            <div id="vesting-schedudle" className="layout-card">
                {' '}
                <div className="layout-card-title">
                    <h1>Release Schedule</h1>
                </div>
                <div id="moc-total">
                    <div className="total-data">0.000000000000 MOC</div>
                    <div className="vesting-label">Total MoC</div>
                </div>{' '}
                <div id="vestin-schedule-table">
                    {' '}
                    <VestingSchedule />
                </div>{' '}
            </div>{' '}
        </div>
    );
}
