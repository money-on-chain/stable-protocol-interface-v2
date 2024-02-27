import React, { useEffect } from 'react'
import { useProjectTranslation } from '../../helpers/translations';
import { PieChart } from '@opd/g2plot-react'

const PieChartComponent = (props) => {
  const [t ] = useProjectTranslation();

  useEffect(() => {
    readData();
  }, [])

  const readData = async () => {
    
  }

  const data = [
    { type: t('staking.distribution.graph.balance'), value: 27 },
    { type: t('staking.distribution.graph.processingUnstake'), value: 25 },
    { type: t('staking.distribution.graph.readyWithdraw'), value: 18 },
    { type: t('staking.distribution.graph.staked'), value: 15 }
  ];
  const config = {
    title: {
      visible: true,
      text: 'Pie Chart',
    },
    description: {
      visible: true,
      text: 'This is a pie chart',
    },
    radius: 1,
    padding: 'auto',
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      visible: true,
      type: 'inner',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    legend: {
      visible: false,
      position: 'bottom',
    },
    height: 230
  };

  return (
    <div >
      <PieChart {...config} />
      <div className="dataContainer">
        {data.map((item) => (
          <div key={item.type} className="dataRow">
            <span>{item.type}</span>
            <span>{((item.value / 100) * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChartComponent
