import React, { useContext, useState, useEffect } from 'react';
import { Image, Skeleton, Table } from 'antd';
import Moment from 'react-moment';

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

export default function Withdraw() {
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const [current, setCurrent] = useState(1);
  const [totalTable, setTotalTable] = useState(50); //TODO call correct info
  const [data, setData] = useState([]);
  const columnsData = [];

  useEffect(() => {
    if (auth) {
      getWithdrawals();
    }
  }, [auth]);
  const getWithdrawals = async () => {
    try {
      const pendingWithdrawals = await auth.interfacePendingWithdrawals();
      console.log('pendingWithdrawals are ', pendingWithdrawals);
      const tokensData = pendingWithdrawals.map((withdrawal, index) => ({
        key: index,
        expiration:
          <div className="item-data">
            <Moment
              format={
                i18n.language === 'en'
                  ? date.DATE_EN
                  : date.DATE_ES
              }
            >
              {parseInt(pendingWithdrawals[0].expiration) * 1000}
            </Moment>
          </div>,
        amount: 
        <div className="item-data">
          {PrecisionNumbers({
            amount: withdrawal.amount,
            token: settings.tokens.TF,
            decimals: settings.tokens.TF.decimals,
            t: t,
            i18n: i18n,
            ns: ns
          })}
        </div>,
        status: <div className="item-data">Processing Unstake</div>,
        available_actions: (
          <div className="group-container">
            <div className="action-container">
              <span className="token-description">Restake</span>
              <div className="icon-action">
                <Image src={ActionIcon} alt="Action" preview={false} />
              </div>
            </div>
            <div className="action-container">
              <span className="token-description">Withdraw</span>
              <div className="icon-action">
                <Image src={ActionIcon} alt="Action" preview={false} />
              </div>
            </div>
          </div>
        )
      }));
      console.log('tokensData are ', tokensData);
      setData(tokensData);
    } catch (error) {
      console.log('error fetching pending withdrawals ', error);
    }
  }
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
  return (
    <div className="card-withdraw">
      <div className="title">
        <h1>{t('staking.withdraw.title')}</h1>
        <div className="withdraw-header-balance">
          <div className="withdraw-header-group">
            <div className="withdraw-header-balance-number">12,345.67 MOC</div>
            <div className="withdraw-header-balance-title">PROCESSING UNSTAKE</div>
          </div>
          <div className="withdraw-header-group">
            <div className="withdraw-header-balance-number">12,345.67 MOC</div>
            <div className="withdraw-header-balance-title">PROCESSING UNSTAKE</div>
          </div>
        </div>
      </div>
      {data ?
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
        /> : <Skeleton active />}
    </div>
  );
}
