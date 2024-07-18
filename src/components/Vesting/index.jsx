import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, notification, Space } from 'antd';
import VestingSchedule from '../../components/Tables/VestingSchedule';
import settings from '../../settings/settings.json';
import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import { PrecisionNumbers } from '../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { formatTimestamp } from '../../helpers/staking';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';


export default function Vesting(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('STEP_1');
    const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');


    useEffect(() => {
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setStatus('LOADED')
        } else {
            setStatus('STEP_1')
        }
    }, [auth]);


    const vestedAmounts = () => {
        const getParameters = auth.userBalanceData.vestingmachine.getParameters
        const tgeTimestamp = auth.userBalanceData.vestingfactory.getTGETimestamp
        const total = auth.userBalanceData.vestingmachine.getTotal
        const percentMultiplier = 10000
        const percentages = getParameters.percentages

        const timeDeltas = getParameters.timeDeltas
        const deltas = [...timeDeltas]
        if (timeDeltas && !new BigNumber(timeDeltas[0]).isZero()) {
            deltas.unshift(new BigNumber(0))
        }

        const percents = percentages.map((x) => new BigNumber(percentMultiplier).minus(x))
        if (percentages && !new BigNumber(percentages[percentages.length - 1]).isZero()) {
            percents.push(new BigNumber(percentMultiplier))
        }

        let dates = []
        if (deltas) {
            if (tgeTimestamp) {
                // Convert timestamp to date.
                dates = deltas.map(x => formatTimestamp(new BigNumber(tgeTimestamp).plus(x).times(1000).toNumber()))
            } else {
                dates = deltas.map(x => x / 60 / 60 / 24)
            }
        }

        let vestedAmount = new BigNumber(0)
        let releasedAmount = new BigNumber(0)

        auth.userBalanceData &&
        getParameters &&
        percents.forEach(function (percent, itemIndex) {

            const date_release =  new Date(dates[itemIndex]);
            const date_now = new Date();
            const timeDifference = date_release.getTime() - date_now.getTime();
            const dayLefts = Math.round(timeDifference / (1000 * 3600 * 24))

            let amount = new BigNumber(0)
            if (total && !new BigNumber(total).isZero()) {
                amount = new BigNumber(percent).times(total).div(percentMultiplier)
            }

            if (dayLefts >= 0) {
                vestedAmount = amount;
            } else {
                releasedAmount = amount;
            }

        });

        const amounts = {}
        amounts.released = releasedAmount
        amounts.vested = vestedAmount.minus(releasedAmount)
        amounts.total = total

        return amounts

    };

    const vestingTotals = vestedAmounts()

    const onWithdraw = async (e) => {

        e.stopPropagation();

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log("Sent transaction withdraw...: ", txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        }
        const onReceipt = () => {
            console.log("Transaction withdraw mined!...");
            setOperationStatus('success');
        }
        const onError = (error) => {
            console.log("Transaction withdraw error!...:", error);
            setOperationStatus('error');
        }

        await auth
            .interfaceVestingWithdraw(new BigNumber(1), onTransaction, onReceipt, onError)
            .then((res) => {
                //console.log('DONE!');
            })
            .catch((e) => {
                console.error(e);
            });
    };

    const onVerify = async (e) => {

        e.stopPropagation();

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log("Sent transaction verify...: ", txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        }
        const onReceipt = () => {
            console.log("Transaction verify mined!...");
            setOperationStatus('success');
        }
        const onError = (error) => {
            console.log("Transaction verify error!...:", error);
            setOperationStatus('error');
        }

        await auth
            .interfaceVestingVerify(onTransaction, onReceipt, onError)
            .then((res) => {
                //console.log('DONE!');
            })
            .catch((e) => {
                console.error(e);
            });
    };

    return (
        <div className="vesting">
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

            {status === 'STEP_1' && (
            <div id="vesting-onboarding" className="layout-card page1">
                {' '}
                <div className="layout-card-title">
                    <h1>Vesting Machine</h1>
                </div>{' '}
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>You don’t have any Vesting Machine Loaded yet</h2>
                        <p>
                            A vesting machine is a tool that allows individuals or entities to gradually acquire ownership of an asset or investment
                            over time, rather than receiving it all at once.
                        </p>
                        <p>You can load any existing Vesting Machine (VM) address or create a new one If you have a Claim Code.</p>
                        <div className="cta">
                            <button className="secondary-button">Load VM</button> <button className="primary-button">Use Claim Code</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator active"></div>
                            <div className="page-indicator"></div>
                            <div className="page-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>)}

            {/*

             VESTING ONBOARDING PAGE 2

             */}

            {status === 'STEP_2' && (
            <div id="vesting-onboarding" className="layout-card page2">
                <div className="layout-card-title">
                    <h1>Vesting Machine</h1>
                </div>
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>Let’s create a new Vesting Machine (VM) using a Claim Code</h2>
                        <div className="input-container">
                            {' '}
                            <label className="claim-code-input-label">
                                Enter your Claim Code below{' '}
                                <textarea
                                    type="text"
                                    className="claim-code-input"
                                    placeholder="You can paste your claim code here or select 'load from file' button"
                                />
                            </label>{' '}
                        </div>{' '}
                        <div className="options">
                            <button className="button-small-secondary">Load Claim Code from file</button>
                        </div>
                        <br />
                        <div className="explanation">
                            <p>
                                After pasting your Claim Code selecte the button below to proceed to the Vesting Machine creation. You’ll need to sign
                                a transaction using your Wallet. You will only pay for the blockchain usage gas.
                            </p>
                        </div>
                        <div className="cta">
                            <button className="primary-button">Create Vesting Machine</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator"></div>
                            <div className="page-indicator active"></div>
                            <div className="page-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>)}
            {/*

            VESTING ONBOARDING PAGE 3

            */}

            {status === 'STEP_3' && (
            <div id="vesting-onboarding" className="layout-card page3">
                {' '}
                <div className="layout-card-title">
                    <h1>Vesting Machine</h1>
                </div>{' '}
                <div className="layout-card-content">
                    <div className="vesting-content">
                        <h2>Your Vesting Machine has been created!</h2>
                        <p>This amazing thing we need to celebrate.</p>
                        <p>Copy your transaction address for later reference.</p>{' '}
                        <div className="tx-details">
                            {' '}
                            Transaction ID
                            <div className="copy-button">
                                oxba8cd957…72adM
                                <div className="copy-icon"></div>
                            </div>
                        </div>
                        <div className="cta">
                            <button className="primary-button">Continue</button>
                        </div>
                        <div className="pagination">
                            <div className="page-indicator"></div>
                            <div className="page-indicator"></div>
                            <div className="page-indicator active"></div>
                        </div>
                    </div>
                </div>
            </div>)}
            {/*

             VESTING SCHEDULE

             */}
            {status === 'LOADED' && (
            <div className={'vesting-section'}>
                <div className="two-columns">
                    <div id="vesting-info" className="layout-card">
                        <div className="layout-card-title">
                            <h1>{t('vesting.title')}</h1>
                            <div id="vesting-verification">
                                {auth.userBalanceData && auth.userBalanceData.vestingmachine.isVerified && (<div className={'verifica-line'}><div className="verification-icon"></div> {t('vesting.status.verified')}</div>)}
                                {auth.userBalanceData && !auth.userBalanceData.vestingmachine.isVerified && (<div className={'verifica-line'}><div className="verification-icon"></div> {t('vesting.status.notVerified')} <a className={'click-verify'} onClick={onVerify}>Verify vesting!</a></div>)}
                            </div>{' '}
                        </div>
                        <div id="vesting-info-content">
                            <div>
                                <div id="vesting-moc-available" className="vesting-data">
                                    {PrecisionNumbers({
                                        amount: !auth.userBalanceData ? '0' : auth.userBalanceData.vestingmachine.getAvailable,
                                        token: settings.tokens.TG,
                                        decimals: t('staking.display_decimals'),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
                                    })}{' '}
                                </div>
                                <div className="vesting-label">freely available FLIP balance</div>
                            </div>
                            <div id="withdraw-cta">
                                Send to my wallet <a className="withdraw-button" onClick={onWithdraw}></a>
                            </div>
                        </div>
                    </div>{' '}
                    <div id="vesting-distribution" className="layout-card">
                        <div id="moc-ready">
                            <div id="vesting-moc-ready" className="vesting-data">
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData ? '0' : vestingTotals['vested'],
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                            </div>
                            <div className="vesting-label">Vested FLIP</div>
                        </div>
                        <div id="moc2">
                            <div id="vesting-moc-vested" className="vesting-data">
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData ? '0' : vestingTotals['released'],
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                            </div>
                            <div className="vesting-label">Released FLIP</div>
                        </div>
                        <div id="moc3">
                            <div id="vesting-moc-vested" className="vesting-data">
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData ? '0' : auth.userBalanceData.vestingmachine.staking.balance,
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                            </div>
                            <div className="vesting-label">Staked FLIP</div>
                        </div>
                         <div id="moc4">
                             <div id="vesting-moc-staking" className="vesting-data">
                                 {PrecisionNumbers({
                                     amount: !auth.userBalanceData ? '0' : auth.userBalanceData.vestingmachine.delay.balance,
                                     token: settings.tokens.TG,
                                     decimals: t('staking.display_decimals'),
                                     t: t,
                                     i18n: i18n,
                                     ns: ns
                                 })}{' '}
                             </div>
                             <div className="vesting-label">Unstaking FLIP</div>
                        </div>
                    </div>{' '}
                </div>{' '}
                <div id="vesting-schedudle" className="layout-card">
                {' '}
                <div className="layout-card-title">
                    <h1>Vesting Release Schedule</h1>
                </div>
                <div id="moc-total">
                    <div className="total-data">{PrecisionNumbers({
                        amount: !auth.userBalanceData ? '0' : auth.userBalanceData.vestingmachine.getTotal,
                        token: settings.tokens.TG,
                        decimals: t('staking.display_decimals'),
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}{' '} {t('staking.tokens.TG.abbr', {ns: ns})}
                    </div>
                    <div className="vesting-label">Schedduled (vested+released)</div>
                </div>{' '}
                <div id="vesting-schedule-table">
                    {' '}
                    <VestingSchedule />
                </div>{' '}
            </div>{' '}
            </div>)}

            {isOperationModalVisible && <OperationStatusModal
                visible={isOperationModalVisible}
                onCancel={() => setIsOperationModalVisible(false)}
                operationStatus={operationStatus}
                txHash={txHash}
            />}

        </div>
    );
}
