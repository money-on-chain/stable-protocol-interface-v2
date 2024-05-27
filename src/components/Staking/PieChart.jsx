import React, { useEffect, useState } from 'react'
import { useProjectTranslation } from '../../helpers/translations';
import { PieChart } from '@opd/g2plot-react'
import BigNumber from 'bignumber.js';

const PieChartComponent = (props) => {
  const [t] = useProjectTranslation();
  const [data, setData] = useState([]);
  const {
    mocBalance,
    stakedBalance,
    lockedBalance,
    totalAvailableToWithdraw
  } = props;
  useEffect(() => {
    readData();
  }, [mocBalance, stakedBalance, lockedBalance, totalAvailableToWithdraw]);
  const readData = async () => {
    const total = getTotal();
    const _data = [
      {
        type: t('staking.distribution.graph.balance'),
        value: BigNumber(mocBalance).div(total).times(100).toNumber()
      },
      {
        type: t('staking.distribution.graph.processingUnstake'),
        value: BigNumber(lockedBalance).div(total).times(100).toNumber()
      },
      {
        type: t('staking.distribution.graph.readyWithdraw'),
        value: BigNumber(totalAvailableToWithdraw).div(total).times(100).toNumber()
      },
      {
        type: t('staking.distribution.graph.staked'),
        value: BigNumber(stakedBalance).div(total).times(100).toNumber()
      }
    ];
    setData(_data);
  }
  const getTotal = () => {
    return BigNumber.sum(
      mocBalance,
      stakedBalance,
      lockedBalance,
      totalAvailableToWithdraw
    ).toFixed(3);
  }
  const config = {
    title: {
      visible: true,
      text: 'Pie Chart',
    },
    description: {
      visible: false,
      text: 'This is a pie chart',
    },
    radius: 1,
    padding: 'auto',
    data,
    angleField: 'value',
    colorField: 'type',
    label: null,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    legend: {
      visible: false,
      position: 'bottom',
    },
    height: 230
  };

  return (
    <div className='pie-chart-container'>
      <PieChart {...config} />
      <div className="dataContainer">
        {data.map((item) => (
          <div key={item.type} className="dataRow">
            <span>{item.type}</span>
            <span>{item.value.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChartComponent
