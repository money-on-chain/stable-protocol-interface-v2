import React, { useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import { PieChart } from '@opd/g2plot-react';
import BigNumber from 'bignumber.js';

const PieChartComponent = (props) => {
    const [t] = useProjectTranslation();
    const [data, setData] = useState([]);
    const { tgBalance, stakedBalance, totalPendingExpiration, totalAvailableToWithdraw } = props;
    useEffect(() => {
        readData();
    }, [tgBalance, stakedBalance, totalPendingExpiration, totalAvailableToWithdraw]);
    const readData = async () => {
        const total = getTotal();

        const _data = [
          {
            type: t('staking.distribution.graph.balance'),
            value: total > 0 ? BigNumber(tgBalance).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.processingUnstake'),
            value: total > 0 ? BigNumber(totalPendingExpiration).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.readyWithdraw'),
            value: total > 0 ? BigNumber(totalAvailableToWithdraw).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.staked'),
            value: total > 0 ? BigNumber(stakedBalance).div(total).times(100).toNumber() : 0
          }
        ];
        // START TEST
        /*
        const _data = [
            { type: 'See code', value: 5 },
            { type: 'Uncomment', value: 20 },
            { type: 'And remove', value: 30 },
            { type: 'Placeholder _data', value: 45 }
        ];*/
        // END TEST
        setData(_data);
    };

    const getTotal = () => {
        return BigNumber.sum(tgBalance, stakedBalance, totalPendingExpiration, totalAvailableToWithdraw).toFixed(3);
    };
    const colorBalance = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-darker');
    const colorProcessing = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-dark');
    const colorReady = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-light');
    const colorStaked = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-base');

    const pieColorPalette = [colorBalance, colorProcessing, colorReady, colorStaked];
    const config = {
        title: {
            visible: false,
            text: 'Pie Chart'
        },
        description: {
            visible: false,
            text: 'This is a pie chart'
        },
        radius: 1,
        innerRadius: 0,
        padding: 0,
        data,
        angleField: 'value',
        colorField: 'type',
        label: false,
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        legend: {
            visible: false,
            position: 'bottom'
        },
        height: 230,
        forceFit: true,
        color: pieColorPalette,
        pieStyle: {
            lineWidth: 2,
            stroke: 'none',
            strokeOpacity: 0.2
        }
    };

    return (
        <div>
            <div className="pie-chart-container">
                <PieChart {...config} />
            </div>
            <div className="dataContainer">
                {data.map((item) => (
                    <div key={item.type} className="data-row">
                        <div className="data-bullet"></div>
                        <div>{item.type}: </div>
                        <div className="data-numbers">{item.value.toFixed(2)}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChartComponent;
