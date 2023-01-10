import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';

import { AuthenticateContext } from "../../../context/Auth";
import { useProjectTranslation } from '../../../helpers/translations';
import settings from '../../../settings/settings.json'
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 380,
    },
    {
        title: 'Price in USD',
        dataIndex: 'price',
        width: 200,
    },
    {
        title: 'Variation 24hs',
        dataIndex: 'variation',
        width: 200,
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        width: 190,
    },
    {
        title: 'USD',
        dataIndex: 'usd'
        /*width: 190,*/
    }
];

const data = [
    {
        key: 0,
        name: "--",
        price: "--",
        variation: "--",
        balance: "--",
        usd: "--"
    },
    {
        key: 1,
        name: "--",
        price: "--",
        variation: "--",
        balance: "--",
        usd: "--"
    }
];

export default function Tokens(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const tokensData = []
    const columnsData = []

    // Columns
    columns.forEach(function(dataItem) {
        columnsData.push({
            title: t(`portfolio.tokens.CA.columns.${dataItem.dataIndex}`, { ns: ns }),
            dataIndex: dataItem.dataIndex,
            width: dataItem.width
        })
    });

    // Rows
    auth.contractStatusData && auth.userBalanceData && data.forEach(function(dataItem) {

        const balance = new BigNumber(fromContractPrecisionDecimals(auth.userBalanceData.CA[dataItem.key].balance,
            settings.tokens.CA[dataItem.key].decimals))
        const price = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.PP_CA[dataItem.key],
            settings.tokens.CA[dataItem.key].decimals))
        const balanceUSD = balance.div(price)

        tokensData.push({
            key: dataItem.key,
            name: <div className="item-token"><i className={`icon-token-ca_${dataItem.key}`}></i> <span className="token-description">{t(`portfolio.tokens.CA.0.title`, { ns: ns })}</span></div>,
            price: <div>{
                PrecisionNumbers({
                    amount: auth.contractStatusData.PP_CA[dataItem.key],
                    token: settings.tokens.CA[0],
                    decimals: 2,
                    t: t,
                    i18n: i18n,
                    ns: ns
                })}</div>,
            variation: "+0.00%",
            balance: <div>{
                PrecisionNumbers({
                   amount: auth.userBalanceData.CA[dataItem.key].balance,
                   token: settings.tokens.CA[0],
                   decimals: 2,
                   t: t,
                   i18n: i18n,
                   ns: ns
            })}</div>,
            usd: <div>{
                PrecisionNumbers({
                    amount: balanceUSD,
                    token: settings.tokens.CA[0],
                    decimals: 2,
                    t: t,
                    i18n: i18n,
                    ns: ns,
                    skipContractConvert: true
                })}</div>
        })
    });

    return (<Table columns={columnsData} dataSource={tokensData} pagination={false} scroll={{y: 240}} />)
};
