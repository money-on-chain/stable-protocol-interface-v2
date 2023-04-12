import React, { useContext } from 'react';
import { Table } from 'antd';
import BigNumber from 'bignumber.js';

import { useProjectTranslation } from '../../../helpers/translations';
import { AuthenticateContext } from '../../../context/Auth';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import settings from '../../../settings/settings.json';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        align: 'left',
        width: 380
    },
    {
        title: 'Tokens per USD',
        dataIndex: 'price',
        align: 'right',
        width: 200
    },
    {
        title: 'Variation 24hs',
        dataIndex: 'variation',
        align: 'right',
        width: 200
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        align: 'right',
        width: 190
    },
    {
        title: 'USD',
        dataIndex: 'usd',
        align: 'right'
        /*width: 190,*/
    }
];

const data = [
    {
        key: 0,
        name: '--',
        price: '--',
        variation: '--',
        balance: '--',
        usd: '--'
    },
    {
        key: 1,
        name: '--',
        price: '--',
        variation: '--',
        balance: '--',
        usd: '--'
    }
];

export default function Tokens(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const tokensData = [];
    const columnsData = [];

    // Columns
    columns.forEach(function (dataItem) {
        columnsData.push({
            title: t(`portfolio.tokens.TP.columns.${dataItem.dataIndex}`, {
                ns: ns
            }),
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });

    // Rows
    auth.contractStatusData &&
        auth.userBalanceData &&
        data.forEach(function (dataItem) {
            const balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.TP[dataItem.key],
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

            // variation
            const priceHistory = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.historic.PP_TP[dataItem.key],
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            const priceDelta = price.minus(priceHistory);
            const variation = priceDelta.abs().div(priceHistory).times(100);

            let signPriceDelta = '';
            if (priceDelta.gt(0)) signPriceDelta = '+';

            const priceDeltaFormat = priceDelta.toFormat(
                2,
                BigNumber.ROUND_UP,
                { decimalSeparator: '.', groupSeparator: ',' }
            );
            const variationFormat = variation.toFormat(2, BigNumber.ROUND_UP, {
                decimalSeparator: '.',
                groupSeparator: ','
            });

            tokensData.push({
                key: dataItem.key,
                name: (
                    <div className="item-token">
                        <i className={`icon-token-tp_${dataItem.key}`}></i>{' '}
                        <span className="token-description">
                            {t(`portfolio.tokens.TP.${dataItem.key}.title`, {
                                ns: ns
                            })}
                        </span>
                    </div>
                ),
                price: (
                    <div>
                        {PrecisionNumbers({
                            amount: price,
                            token: settings.tokens.TP[0],
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </div>
                ),
                variation: `${signPriceDelta}${priceDeltaFormat} (${variationFormat} %)`,
                balance: (
                    <div>
                        {PrecisionNumbers({
                            amount: balance,
                            token: settings.tokens.TP[0],
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </div>
                ),
                usd: (
                    <div>
                        {PrecisionNumbers({
                            amount: balanceUSD,
                            token: settings.tokens.TP[0],
                            decimals: 3,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </div>
                )
            });
        });

    return (
        <Table
            columns={columnsData}
            dataSource={tokensData}
            pagination={false}
            scroll={{ y: 240 }}
        />
    );
}
