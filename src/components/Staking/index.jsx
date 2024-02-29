import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Col, Row, Skeleton, Alert } from 'antd';
import { useProjectTranslation } from '../../helpers/translations';
import BigNumber from 'bignumber.js';
import Stake from './Stake';
import PieChartComponent from './PieChart';
import PerformanceChart from '../PerformanceChart';
import Withdraw from './Withdraw';
import { AuthenticateContext } from '../../context/Auth';

const withdrawalStatus = {
  pending: 'PENDING',
  available: 'AVAILABLE'
};

export default function Staking(props) {
  const auth = useContext(AuthenticateContext);
  const [t] = useProjectTranslation();
  const [activeTab, setActiveTab] = useState('tab1');
  const [mocBalance, setMocBalance] = useState('0');
  const [lockedBalance, setLockedBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [totalPendingExpiration, setTotalPendingExpiration] = useState('0');
  const [totalAvailableToWithdraw, setTotalAvailableToWithdraw] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.accountData && auth.userBalanceData) {
      setLoading(false);
      setStakingBalances();
      console.log('userbalance ', auth.userBalanceData);
      console.log('MOC balance is', auth.userBalanceData?.FeeToken?.balance);
    }
  }, [auth]);

  const setStakingBalances = async () => {
    try {
      let [_stakedBalance, _lockedBalance, _pendingWithdrawals] = [
        '0',
        '0',
        []
      ];
      if (auth.userBalanceData) {
        setMocBalance(auth.userBalanceData.FeeToken.balance);
        [_stakedBalance, _lockedBalance, _pendingWithdrawals] =
          await Promise.all([
            auth.interfaceStackedBalance(),
            auth.interfaceLockedBalance(),
            auth.interfacePendingWithdrawals()
          ]);
      }
      const pendingWithdrawalsFormatted = _pendingWithdrawals
        .filter((withdrawal) => withdrawal.expiration)
        .map((withdrawal) => {
          const status =
            new Date(parseInt(withdrawal.expiration) * 1000) >
              new Date()
              ? withdrawalStatus.pending
              : withdrawalStatus.available;

          return {
            ...withdrawal,
            status
          };
        });
      let pendingExpirationAmount = '0';
      let readyToWithdrawAmount = '0';
      pendingWithdrawalsFormatted.forEach(({ status, amount }) => {
        if (status === withdrawalStatus.pending) {
          pendingExpirationAmount = BigNumber.sum(
            pendingExpirationAmount,
            amount
          ).toFixed(0);
        } else {
          readyToWithdrawAmount = BigNumber.sum(
            readyToWithdrawAmount,
            amount
          ).toFixed(0);
        }
      });
      const arrayDes = pendingWithdrawalsFormatted.sort(function (a, b) {
        return b.id - a.id;
      });
      setLockedBalance(_lockedBalance);
      console.log('Staked balance', _stakedBalance);
      setStakedBalance(_stakedBalance);
      setTotalPendingExpiration(pendingExpirationAmount);
      setTotalAvailableToWithdraw(readyToWithdrawAmount);
      setPendingWithdrawals(arrayDes);
      console.log('Staking balances', _stakedBalance, _lockedBalance, _pendingWithdrawals);
    } catch (error) {
      console.log('Error getting staking balances', error);
    }
  };
  
  return (
    <div className="Staking">
      {!loading && <Fragment>
        <Row gutter={24} className="row-section">
          <Col span={10}>
            <div className="card-system-status">
              <div className="title">
                <h1>{t('staking.title')}</h1>
              </div>
              <div className="tabs">
                <button onClick={() => setActiveTab('tab1')} className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}>{t('staking.staking.tab1')}</button>
                <button onClick={() => setActiveTab('tab2')} className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}>{t('staking.staking.tab2')}</button>
              </div>
              <div className="tab-divider"></div>
              {/* Contenido del Tab */}
              <div className="tab-content">
                <Stake
                  activeTab={activeTab}
                  mocBalance={mocBalance}
                  stakedBalance={stakedBalance}
                  lockedBalance={lockedBalance}
                  setStakingBalances={setStakingBalances}
                  totalAvailableToWithdraw={totalAvailableToWithdraw}
                />
              </div>
            </div>
          </Col>
          <Col span={7}>
            <div className="card-system-status">
              <div className="title">
                <h1>{t('staking.distribution.title')}</h1>
              </div>
              <div className="tab-content">
                <PieChartComponent
                  mocBalance={mocBalance}
                  stakedBalance={stakedBalance}
                  lockedBalance={lockedBalance}
                  totalAvailableToWithdraw={totalAvailableToWithdraw}
                />
              </div>
            </div>
          </Col>
          <Col span={7}>
            <div className="card-system-status">
              <div className="title">
                <h1>{t('staking.performance.title')}</h1>
              </div>
              <div className="tab-content">
                <PerformanceChart />
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={24} className="row-section">
          <Col span={24}>
            <Withdraw />
          </Col>
        </Row>
      </Fragment>}
    </div>
  );
}
