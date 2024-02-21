import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';


const ProvideColumnsTP = [
    {
      title: 'Expiration',
      dataIndex: 'expiration',
      align: 'left',
      width: 210
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'right',
      width: 160
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

export default function Withdraw() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const tokensData = [];
    const columnsData = [];

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
    auth.contractStatusData &&
    settings.tokens.TP.forEach(function (dataItem) {

        tokensData.push({
            key: dataItem.key,
            expiration: (
                <div className="item-data">
                    2022-10-05 22:47:00
                </div>
            ),
            amount: (
                <div className="item-data">
                    0.00
                </div>
            ),
            status:
                <div>
                    {PrecisionNumbers({
                        amount: auth.contractStatusData.pegContainer[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>,
                available_actions: (
                <div>
                    {PrecisionNumbers({
                        amount: auth.contractStatusData.getTPAvailableToMint[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>
            )
        });
    });

    return (

        <div className="card-tps">

            <div className="title">
                <h1>{t('staking.withdraw.title')}</h1>
            </div>
            <Table
                columns={columnsData}
                dataSource={tokensData}
                pagination={false}
                scroll={{ y: 240 }}
            />
        </div>


    );
}
