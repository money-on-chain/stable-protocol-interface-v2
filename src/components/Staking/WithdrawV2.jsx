import React, { useContext, useState, useEffect } from 'react';
import { Skeleton, Table } from 'antd';
import Moment from 'react-moment';
import moment from 'moment-timezone';

import date from '../../helpers/date';
import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';

export default function Withdraw(props) {
    const { userInfoStaking } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [totalTable, setTotalTable] = useState(null);
    const [data, setData] = useState(null);
    const [modalMode, setModalMode] = useState(null);
    const [withdrawalId, setWithdrawalId] = useState('0');
    const [modalAmount, setModalAmount] = useState('0');
    const [operationModalInfo, setOperationModalInfo] = useState({});
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);

    const columnsData = [];
    const ProvideColumnsTG = [
        { title: 'Unique Cell', dataIndex: 'rowContent' }
    ];
    useEffect(() => {
        if (auth && userInfoStaking['pendingWithdrawals']) {
            getWithdrawals();
        }
    }, [auth, userInfoStaking['pendingWithdrawals'], i18n.language]);

    const getWithdrawals = () => {
        setTotalTable(userInfoStaking['pendingWithdrawals'].length);
        const tokensData = userInfoStaking['pendingWithdrawals'].map(
            (withdrawal, index) => ({
                key: index,
                rowContent: (
                    <div className="withdraw__row">
                        <div className="withdraw__first__column">
                            <div className="item-data withdraw__date">
                                <Moment
                                    format={
                                        i18n.language === 'en'
                                            ? date.DATE_EN
                                            : date.DATE_ES
                                    }
                                    date={moment.tz(
                                        parseInt(withdrawal.expiration) * 1000,
                                        moment.tz.guess()
                                    )}
                                />
                            </div>
                            <div className="item-data withdraw__amount">
                                {PrecisionNumbers({
                                    amount: withdrawal.amount,
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                            </div>
                        </div>
                        <div className="item-data withdraw__status">
                            {t(`staking.withdraw.status.${withdrawal.status}`)}
                        </div>
                        <div className="withdraw__cta">
                            <div
                                className={`cta__button restake action__container${withdrawal.status !== 'PENDING' && withdrawal.status !== 'AVAILABLE' ? ' action__container--disabled' : ''}`}
                                onClick={() =>
                                    handleActionClick('restake', withdrawal)
                                }
                            >
                                <span
                                    className={`action__description${withdrawal.status !== 'PENDING' && withdrawal.status !== 'AVAILABLE' ? '--disabled' : ''}`}
                                >
                                    {t('staking.withdraw.buttons.restake')}
                                </span>
                                {/* <div className="action__icon">
                                <Image
                                    src={ActionIcon}
                                    alt="Action"
                                    preview={false}
                                />
                            </div> */}
                            </div>
                            <div
                                className={`cta__button withdraw  action__container${withdrawal.status === 'PENDING' ? ' cta__button--disabled' : ''}`}
                                onClick={() =>
                                    handleActionClick('withdraw', withdrawal)
                                }
                            >
                                <span
                                    className={`action__description${withdrawal.status === 'PENDING' ? '--disabled' : ''}`}
                                >
                                    {t('staking.withdraw.buttons.withdraw')}
                                </span>
                                {/* <div className="action__icon">
                                <Image
                                    src={ActionIcon}
                                    alt="Action"
                                    preview={false}
                                />
                            </div> */}
                            </div>
                        </div>
                    </div>
                )
            })
        );
        setData(tokensData);
    };

    // Columns
    ProvideColumnsTG.forEach(function (dataItem) {
        columnsData.push({
            title: dataItem.title,
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });

    const onConfirm = (operationStatus, txHash) => {
        const operationInfo = {
            operationStatus,
            txHash
        };

        setOperationModalInfo(operationInfo);
        setIsOperationModalVisible(true);

        if (operationStatus === 'success') {
            // Update the withdrawal list
            getWithdrawals();
        }
    };

    const handleActionClick = (action, status) => {
        // if (status !== 'PENDING' && status !== 'AVAILABLE' && action === 'restake') return;
        if (status === 'PENDING' && action === 'withdraw') return;
        if (action === 'restake') {
            setModalMode('restake');
        } else {
            setModalMode('withdraw');
        }
        setWithdrawalId(status.id.toString());
        setModalAmount(status.amount);
    };

    return (
        <div
            id="stakingWithdrawCard"
            className="section__innerCard--big card-withdraw"
        >
            <div className="layout-card-title">
                <h1>{t('staking.withdraw.title')}</h1>
                <div className="withdraw-header-balance">
                    {userInfoStaking['totalPendingExpiration'] && (
                        <div className="withdraw-header-group">
                            <div className="withdraw-header-balance-number">
                                {PrecisionNumbers({
                                    amount: userInfoStaking[
                                        'totalPendingExpiration'
                                    ],
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}{' '}
                                {`${settings.tokens.TG.name}`}
                            </div>
                            <div className="withdraw-header-balance-title">
                                {t('staking.withdraw.processing_unstake')}
                            </div>
                        </div>
                    )}
                    {userInfoStaking['totalAvailableToWithdraw'] && (
                        <div className="withdraw-header-group">
                            <div className="withdraw-header-balance-number">
                                {PrecisionNumbers({
                                    amount: userInfoStaking[
                                        'totalAvailableToWithdraw'
                                    ],
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}{' '}
                                {`${settings.tokens.TG.name}`}
                            </div>
                            <div className="withdraw-header-balance-title">
                                {t('staking.withdraw.ready_to_withdraw')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {data ? (
                <>
                    <div className="withdraw__header ">
                        <div className="withdraw__first__column">
                            <div className="withdraw__date">
                                {t('staking.withdraw.table.expiration')}
                            </div>
                            <div className="withdraw__amount">
                                {t('staking.withdraw.table.amount')}
                            </div>
                        </div>
                        <div className="withdraw__status">
                            {t('staking.withdraw.table.status')}
                        </div>
                        <div className="withdraw__cta">
                            {t('staking.withdraw.table.actions')}
                        </div>
                    </div>
                    <div className="divider-horizontal"></div>
                    <Table
                        columns={columnsData}
                        dataSource={data}
                        pagination={{
                            pageSize: 1000,
                            position: ['none', 'bottomRight'],
                            defaultCurrent: 1,
                            total: totalTable
                        }}
                        showHeader={false}
                        scroll={{ y: 'auto' }}
                    />
                </>
            ) : (
                <Skeleton active />
            )}
            {modalMode !== null && (
                <StakingOptionsModal
                    mode={modalMode}
                    visible={modalMode !== null}
                    onClose={() => setModalMode(null)}
                    withdrawalId={withdrawalId}
                    amount={modalAmount}
                    onConfirm={onConfirm}
                />
            )}
            {isOperationModalVisible && (
                <OperationStatusModal
                    visible={isOperationModalVisible}
                    onCancel={() => setIsOperationModalVisible(false)}
                    operationStatus={operationModalInfo.operationStatus}
                    txHash={operationModalInfo.txHash}
                />
            )}
        </div>
    );
}
