import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';


export default function TokensPegged() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const tokensData = [];
    const columnsData = [];


const ProvideColumnsTP = [
    {
      title: t("performance.pegged.colName"),
      dataIndex: 'name',
      align: 'left',
      width: 210
    },
    {
      title: t("performance.pegged.colTokensPer"),
      dataIndex: 'tokens_per_usd',
      align: 'right',
      width: 160
    },
    {
      title: t("performance.pegged.colMinted"),
      dataIndex: 'minted',
      align: 'right',
      width: 140
    },
    {
      title: t("performance.pegged.colMintable"),
      dataIndex: 'mintable',
      align: 'right',
      width: 160
    },
    {
      title: t("performance.pegged.colTargetCoverage"),
      dataIndex: 'coverage',
      align: 'right',
      width: 140

    },
    {
      title: t("performance.pegged.colEMA"),
      dataIndex: 'ema',
      align: 'right',
      width: 100
    },
    {
      title: t("performance.pegged.colTargetEMA"),
      dataIndex: 'ctargema',
      align: 'right',
      width: 140
    }
  ];


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
            name: (
                <div className="item-token">
                    <i className="icon-token-tp_0"></i>{' '}
                    <span className="token-description">
                        {t(`exchange.tokens.TP_${dataItem.key}.label`, {
                            ns: ns
                        })}
                    </span>
                    <span className="token-symbol">
                        {t(`exchange.tokens.TP_${dataItem.key}.abbr`, {
                            ns: ns
                        })}
                    </span>
                </div>
            ),
            tokens_per_usd: (
                <div>
                    {settings.project !== 'roc' ? (!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.PP_TP[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 3,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    }) : 1}
                </div>
            ),
            minted:
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.pegContainer[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>,
            mintable: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.getTPAvailableToMint[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>
            ),
            coverage: (
                <div className="item-usd">
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.tpCtarg[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>
            ),
            ema: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.tpEma[dataItem.key],
                        token: settings.tokens.TP[dataItem.key],
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </div>
            ),
            ctargema: (
                <div>
                    {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                        amount: auth.contractStatusData.calcCtargemaCA,
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
                <h1>{t('performance.pegged.cardTitle')}</h1>
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
