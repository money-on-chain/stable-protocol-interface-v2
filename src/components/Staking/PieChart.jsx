import React, { useEffect, useState } from 'react';
import { useProjectTranslation } from '../../helpers/translations';
import { PieChart } from '@opd/g2plot-react';
import BigNumber from 'bignumber.js';
import { PrecisionNumbers } from '../PrecisionNumbers';
import settings from '../../settings/settings.json';

const PieChartComponent = (props) => {
    const [t, i18n, ns] = useProjectTranslation();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(new BigNumber(0));
    const { userInfoStaking } = props;

    useEffect(() => {
        readData();
    }, [
        userInfoStaking['tgBalance'],
        userInfoStaking['stakedBalance'],
        userInfoStaking['totalPendingExpiration'],
        userInfoStaking['totalAvailableToWithdraw'],
        userInfoStaking['lockedInVoting']
    ]);

    const readData = () => {

        const total = getTotal();
        const _data = [
          {
            type: t('staking.distribution.graph.balance'),
            value: total.gt(0) ? BigNumber(userInfoStaking['tgBalance']).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.processingUnstake'),
            value: total.gt(0) ? BigNumber(userInfoStaking['totalPendingExpiration']).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.readyWithdraw'),
            value: total.gt(0) ? BigNumber(userInfoStaking['totalAvailableToWithdraw']).div(total).times(100).toNumber() : 0
          },
          {
            type: t('staking.distribution.graph.staked'),
            value: total.gt(0) ? BigNumber(userInfoStaking['stakedBalance']).minus(userInfoStaking['lockedInVoting']).div(total).times(100).toNumber() : 0
          },
          {
            type: 'Staked in voting',
            value: total.gt(0) ? BigNumber(userInfoStaking['lockedInVoting']).div(total).times(100).toNumber() : 0
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
        setTotal(total);
    };

    const getTotal = () => {
        return BigNumber.sum(
            userInfoStaking['tgBalance'],
            new BigNumber(userInfoStaking['stakedBalance']).minus(new BigNumber(userInfoStaking['lockedInVoting'])),
            userInfoStaking['totalPendingExpiration'],
            userInfoStaking['totalAvailableToWithdraw'],
            userInfoStaking['lockedInVoting']
        );
    };
    const colorBalance = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-darker');
    const colorProcessing = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-dark');
    const colorReady = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-light');
    const colorStaked = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-base');
    const colorStakedInVoting = getComputedStyle(document.querySelector(':root')).getPropertyValue('--brand-color-base');

    const pieColorPalette = [colorBalance, colorProcessing, colorReady, colorStaked, colorStakedInVoting];
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
        interactions: [
            { type: 'element-selected' },
            { type: 'element-active' }
        ],
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
                <div className="dataLabels">
                    {data.map((item) => (
                        <div key={item.type} className="data-row">
                            <div className="data-bullet"></div>
                            <div>{item.type}: </div>
                            <div className="data-numbers">
                                {item.value.toFixed(2)}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pie-chart-total">
                    <div className="pie-chart-total-amount">
                        {PrecisionNumbers({
                            amount: total,
                            token: settings.tokens.TG,
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}{' '}
                        {t('staking.governanceToken')}
                    </div>
                    <div className="pie-chart-total-title">
                        {t('staking.distribution.graph.totalLabel')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChartComponent;
