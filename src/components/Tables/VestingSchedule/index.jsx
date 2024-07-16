import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import BigNumber from 'bignumber.js';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';


const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(timestamp)
}

const precision = (contractDecimals) => new BigNumber(10).exponentiatedBy(contractDecimals)

const formatVisibleValue = (amount, decimals) => {
    return BigNumber(amount).div(precision(18)).toFormat(decimals, BigNumber.ROUND_UP, {
        decimalSeparator: '.',
        groupSeparator: ','
    })
}


export default function VestingSchedule(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const vestingColumns = [
        {
            title: t('vesting.vestingScheduleColumns.date'),
            dataIndex: 'date',
            align: 'left',
            width: 210,
            className: 'date-column'
        },
        {
            title: t('vesting.vestingScheduleColumns.daysLeft'),
            dataIndex: 'daysleft',
            align: 'right',
            width: 150,
            className: 'percent-column'
        },
        {
            title: t('vesting.vestingScheduleColumns.percent'),
            dataIndex: 'percent',
            align: 'right',
            width: 150,
            className: 'percent-column'
        },
        {
            title: t('vesting.vestingScheduleColumns.amount'),
            dataIndex: 'amount',
            align: 'right',
            width: 150,
            className: 'amount-column'
        },
        {
            title: t('vesting.vestingScheduleColumns.status'),
            dataIndex: 'status',
            align: 'left',
            width: 'auto',
            className: 'status-column'
        }
    ];
    const vestingData = [];

    const getParameters = auth.userBalanceData.vestingmachine.getParameters
    const tgeTimestamp = auth.userBalanceData.vestingfactory.getTGETimestamp
    const total = auth.userBalanceData.vestingmachine.getTotal
    const percentMultiplier = 10000

    const percentages = getParameters.percentages
    const timeDeltas = getParameters.timeDeltas
    const deltas = [...timeDeltas]
    if (timeDeltas && !new BigNumber(timeDeltas[0]).isZero()) {
        deltas.unshift(new BigNumber(0))
    }
    const percents = percentages.map((x) => new BigNumber(percentMultiplier).minus(x))
    if (percentages && !new BigNumber(percentages[percentages.length - 1]).isZero()) {
        percents.push(new BigNumber(percentMultiplier))
    }

    let dates = []
    if (deltas) {
        if (tgeTimestamp) {
            // Convert timestamp to date.
            dates = deltas.map(x => formatTimestamp(new BigNumber(tgeTimestamp).plus(x).times(1000).toNumber()))
        } else {
            dates = deltas.map(x => x / 60 / 60 / 24)
        }
    }

    auth.userBalanceData &&
    getParameters &&
    percents.forEach(function (percent, itemIndex) {
        let strTotal = ''
        if (total && !new BigNumber(total).isZero()) {
            strTotal = new BigNumber(percent).times(total).div(percentMultiplier)
        }

        const date_release =  new Date(dates[itemIndex]);
        const date_now = new Date();
        const timeDifference = date_release.getTime() - date_now.getTime();
        const dayLefts = Math.round(timeDifference / (1000 * 3600 * 24))

        vestingData.push({
            key: itemIndex,
            date: dates[itemIndex],
            daysleft: dayLefts < 0 ? 0 : dayLefts,
            percent: `${(percent.toNumber() / percentMultiplier * 100).toFixed(2)}%`,
            amount: formatVisibleValue(strTotal, 2),
            status: dayLefts < 0 ? 'Released' : 'Vested'
        });

    });

    return <Table columns={vestingColumns} dataSource={vestingData} pagination={false} scroll={{ y: 350 }} />;
}
