import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import { ProvideColumnsCA } from '../../helpers/tokensTables';
const columnsRocCA = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'left',
      width: 340
    },
    {
      title: 'Tokens per USD',
      dataIndex: 'price',
      align: 'right',
      width: 190
    },
    {
      title: 'Minted',
      dataIndex: 'variation',
      align: 'right',
      width: 190
    },
    {
      title: 'Mintable',
      dataIndex: 'balance',
      align: 'right',
      width: 190
    },
    {
      title: 'Target Coverage',
      dataIndex: 'usd',
      align: 'right'
    }
  ];
export default function TokensPegged() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const tokensData = [];
    const columnsData = [];

    columnsRocCA.forEach(function (dataItem) {
        columnsData.push({
            title: dataItem.title,
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });
    tokensData.push({
        key: 2,
        name: (
            <div className="item-token">
                <i className="icon-token-tp_0"></i>{' '}
                <span className="token-description">
                    {'RIF Dollar'}
                </span>
                <span className="token-symbol">
                    {'USDRIF'}
                </span>
            </div>
        ),
        price: (
            <div>
                {'1.00'}
            </div>
        ),
        variation:
            <div>
                {'33,434,330,20'}
            </div>,
        balance: (
            <div>
                {'33,434,330,20'}
            </div>
        ),
        usd: (
            <div className="item-usd">
                {'4.00'}
            </div>
        )
    });
    tokensData.push({
        key: 2,
        name: (
            <div className="item-token">
                <i className="icon-token-tp_0"></i>{' '}
                <span className="token-description">
                    {'RIF Dollar'}
                </span>
                <span className="token-symbol">
                    {'USDRIF'}
                </span>
            </div>
        ),
        price: (
            <div>
                {'1.00'}
            </div>
        ),
        variation:
            <div>
                {'33,434,330,20'}
            </div>,
        balance: (
            <div>
                {'33,434,330,20'}
            </div>
        ),
        usd: (
            <div className="item-usd">
                {'4.00'}
            </div>
        )
    });
    tokensData.push({
        key: 2,
        name: (
            <div className="item-token">
                <i className="icon-token-tp_0"></i>{' '}
                <span className="token-description">
                    {'RIF Dollar'}
                </span>
                <span className="token-symbol">
                    {'USDRIF'}
                </span>
            </div>
        ),
        price: (
            <div>
                {'1.00'}
            </div>
        ),
        variation:
            <div>
                {'33,434,330,20'}
            </div>,
        balance: (
            <div>
                {'33,434,330,20'}
            </div>
        ),
        usd: (
            <div className="item-usd">
                {'4.00'}
            </div>
        )
    });
    const totalPeggedInUSD = () => {

        let totalUSD = new BigNumber(0);

        // Tokens TPs
        auth.contractStatusData &&
            settings.tokens.TP.forEach(function (dataItem) {
                const balance = new BigNumber(
                    fromContractPrecisionDecimals(
                        auth.contractStatusData.pegContainer[dataItem.key],
                        settings.tokens.TP[dataItem.key].decimals
                    )
                );
                const price = new BigNumber(
                    fromContractPrecisionDecimals(
                        auth.contractStatusData.PP_TP[dataItem.key],
                        settings.tokens.TP[dataItem.key].decimals
                    )
                );
                const balanceUSD = balance.div(price);
                totalUSD = totalUSD.plus(balanceUSD);
            });

        return totalUSD;
    };

    return (

        <div className="card-tps">

            <div className="title">
                <h1>Pegged Tokens performance</h1>
            </div>

            {/*<div className="card-content">

                {settings.tokens.CA.map(function (token, i) {
                    return (
                        <div className={`row-${i + 1}`}>

                            <div className="coll-1">
                                <div className="amount">
                                    {PrecisionNumbers({
                                        amount: totalPeggedInUSD(),
                                        token: TokenSettings('CA_0'),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}
                                </div>
                                <div className="caption">Total supply in USD</div>
                            </div>

                        </div>
                    )
                })
                }

            </div>*/}
            <Table
                columns={columnsData}
                dataSource={tokensData}
                pagination={false}
                scroll={{ y: 240 }}
            />
        </div>


    );
}
