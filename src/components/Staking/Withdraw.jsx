import React, { useContext, useState, useEffect } from 'react';
import { Image, Skeleton, Table } from 'antd';
import Moment from 'react-moment';
import moment from 'moment-timezone';

import date from '../../helpers/date';
import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import fromContractPrecisionDecimals from '../../helpers/Formats';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import ActionIcon from '../../assets/icons/Action.svg';

const ProvideColumnsTP = [
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    align: 'left',
    width: 120
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    align: 'right',
    width: 100
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'right',
    width: 140
  },
  {
    title: 'Available Actions',
    dataIndex: 'available_actions',
    align: 'right',
    width: 160
  }
];

export default function Withdraw(props) {
    const { totalPendingExpiration, totalAvailableToWithdraw, pendingWithdrawals } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [current, setCurrent] = useState(1);
    const [totalTable, setTotalTable] = useState(50); //TODO call correct info
    const [data, setData] = useState(null);
    const columnsData = [];

    useEffect(() => {
      console.log('lang is ', i18n.language);
        if (auth && pendingWithdrawals) {
            getWithdrawals();
        }
    }, [auth, pendingWithdrawals, i18n.language]);
    const getWithdrawals = () => {
        console.log('pendingWithdrawals', pendingWithdrawals);
        const tokensData = pendingWithdrawals.map((withdrawal, index) => ({
            key: index,
            expiration: (
                <div className="item-data">
                    <Moment
                        format={i18n.language === 'en' ? date.DATE_EN : date.DATE_ES}
                        date={moment.tz(parseInt(withdrawal.expiration) * 1000, moment.tz.guess())}
                    />
                </div>
            ),
            amount: (
                <div className="item-data">
                    {PrecisionNumbers({
                        amount: withdrawal.amount,
                        token: settings.tokens.TF,
                        decimals: settings.tokens.TF.visibleDecimals,
                        t: t,
                        i18n: i18n,
                        ns: ns
                    })}
                </div>
            ),
            status: <div className="item-data">{withdrawal.status}</div>,
            available_actions: (
                <div className="group-container">
                    <div
                        className={`action-container${withdrawal.status !== 'PENDING' && withdrawal.status !== 'AVAILABLE' ? ' disabled' : ''}`}
                        onClick={() => handleActionClick('restake', withdrawal)}
                    >
                        <span
                            className={`token-description${withdrawal.status !== 'PENDING' && withdrawal.status !== 'AVAILABLE' ? '-disabled' : ''}`}
                        >
                            {t('staking.withdraw.buttons.restake')}
                        </span>
                        <div className="icon-action">
                            <Image src={ActionIcon} alt="Action" preview={false} />
                        </div>
                    </div>
                    <div
                        className={`action-container${withdrawal.status === 'PENDING' ? ' disabled' : ''}`}
                        onClick={() => handleActionClick('withdraw', withdrawal)}
                    >
                        <span className={`token-description${withdrawal.status === 'PENDING' ? '-disabled' : ''}`}>
                            {t('staking.withdraw.buttons.withdraw')}
                        </span>
                        <div className="icon-action">
                            <Image src={ActionIcon} alt="Action" preview={false} />
                        </div>
                    </div>
                </div>
            )
        }));
        setData(tokensData);
    };
    // Columns
    ProvideColumnsTP.forEach(function (dataItem) {
        columnsData.push({
            title: dataItem.title,
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });

    // Rows

    const onChange = (page) => {
        // if (accountData !== undefined) {
        //   setCurrent(page);
        //   // data_row(page);
        //   // transactionsList(page, true);
        //   //TODO call correct info
        // }
    };

    const handleActionClick = (action, status) => {
      // if (status !== 'PENDING' && status !== 'AVAILABLE' && action === 'restake') return;
      if (status === 'PENDING' && action === 'withdraw') return;
      console.log('action', action, status);
      
    };

    return (
        <div className="card-withdraw">
            <div className="title">
                <h1>{t('staking.withdraw.title')}</h1>
                <div className="withdraw-header-balance">
                    {totalPendingExpiration && (
                        <div className="withdraw-header-group">
                            <div className="withdraw-header-balance-number">
                                {PrecisionNumbers({
                                    amount: totalPendingExpiration,
                                    token: settings.tokens.TF,
                                    decimals: settings.tokens.TF.visibleDecimals,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                                {`${settings.tokens.TF.name}`}
                            </div>
                            <div className="withdraw-header-balance-title">{t('staking.withdraw.processing_unstake')}</div>
                        </div>
                    )}
                    {totalAvailableToWithdraw && (
                        <div className="withdraw-header-group">
                            <div className="withdraw-header-balance-number">
                                {PrecisionNumbers({
                                    amount: totalAvailableToWithdraw,
                                    token: settings.tokens.TF,
                                    decimals: settings.tokens.TF.visibleDecimals,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                                {`${settings.tokens.TF.name}`}
                            </div>
                            <div className="withdraw-header-balance-title">{t('staking.withdraw.ready_to_withdraw')}</div>
                        </div>
                    )}
                </div>
            </div>
            {data ? (
                <Table
                    columns={columnsData}
                    dataSource={data}
                    pagination={{
                        pageSize: 10,
                        position: ['none', 'bottomRight'],
                        defaultCurrent: 1,
                        onChange: onChange,
                        total: totalTable
                    }}
                    scroll={{ y: 200 }}
                />
            ) : (
                <Skeleton active />
            )}
        </div>
    );
}
