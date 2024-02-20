import React from 'react';
import { BarChart } from '@opd/g2plot-react';

const BarChartComponent = () => {
  const data = [
    { type: 'MOC', value: 100 },
    { type: 'MOC + Staking', value: 120 },
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle', 
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  };

  return <div><BarChart {...config} /></div>;
};

export default BarChartComponent;
