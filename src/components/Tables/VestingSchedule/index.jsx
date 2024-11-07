import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import BigNumber from 'bignumber.js';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import { formatTimestamp } from '../../../helpers/staking';

const precision = (contractDecimals) =>
    new BigNumber(10).exponentiatedBy(contractDecimals);

const formatVisibleValue = (amount, decimals) => {
    return BigNumber(amount)
        .div(precision(18))
        .toFormat(decimals, BigNumber.ROUND_UP, {
            decimalSeparator: '.',
            groupSeparator: ','
        });
};

export default function VestingSchedule(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const vestingColumns = [
        {
            dataIndex: 'renderRow'
        }
    ];
    const vestingData = [];

    const getParameters = auth.userBalanceData.vestingmachine.getParameters;
    const tgeTimestamp = auth.userBalanceData.vestingfactory.getTGETimestamp;
    const total = auth.userBalanceData.vestingmachine.getTotal;
    const percentMultiplier = 10000;

    const percentages = getParameters.percentages;
    const timeDeltas = getParameters.timeDeltas;
    const deltas = [...timeDeltas];
    if (timeDeltas && !new BigNumber(timeDeltas[0]).isZero()) {
        deltas.unshift(new BigNumber(0));
    }

    if (new BigNumber(percentages[0]).lt(percentMultiplier)) {
        percentages.unshift(BigInt(10000));
    }

    if (percentages && percentages.length > 0)
        percentages[percentages.length - 1] = 0;

    const percents = percentages.map((x) =>
        new BigNumber(percentMultiplier).minus(x)
    );

    let dates = [];
    if (deltas) {
        if (tgeTimestamp) {
            // Convert timestamp to date.
            dates = deltas.map((x) =>
                formatTimestamp(
                    new BigNumber(tgeTimestamp).plus(x).times(1000).toNumber()
                )
            );
        } else {
            dates = deltas.map((x) => x / 60 / 60 / 24);
        }
    }

    const tgeFormat = formatTimestamp(
        new BigNumber(tgeTimestamp).times(1000).toNumber()
    );

    auth.userBalanceData &&
        getParameters &&
        percents.forEach(function (percent, itemIndex) {
            let strTotal = '';
            if (total && !new BigNumber(total).isZero()) {
                strTotal = new BigNumber(percent)
                    .times(total)
                    .div(percentMultiplier);
            }

            const date_release = new Date(dates[itemIndex]);
            const date_now = new Date();
            const timeDifference = date_release.getTime() - date_now.getTime();
            const dayLefts = Math.round(timeDifference / (1000 * 3600 * 24));

            if (!(tgeFormat === dates[itemIndex])) {
                vestingData.push({
                    key: itemIndex,
                    renderRow: (
                        <div className="renderRow">
                            <div className="releaseDate">
                                {new Date(dates[itemIndex]).toLocaleString(
                                    i18n.language
                                )}
                            </div>
                            <div className="daysToRelease">
                                {dayLefts < 0 ? 0 : dayLefts}
                            </div>
                            <div className="percentage">{`${((percent.toNumber() / percentMultiplier) * 100).toFixed(2)}%`}</div>
                            <div className="amount">
                                {formatVisibleValue(strTotal, 2)}
                            </div>
                            <div className="status">
                                {dayLefts > 0
                                    ? 'Vested'
                                    : tgeFormat === dates[itemIndex]
                                      ? 'TGE'
                                      : 'Released'}
                            </div>
                        </div>
                    )
                });
            }
        });

    return (
        <>
            <div className="renderHeader">
                <div className="releaseDate">
                    {t('vesting.vestingScheduleColumns.date')}
                </div>
                <div className="daysToRelease">
                    {t('vesting.vestingScheduleColumns.daysLeft')}
                </div>
                <div className="percentage">
                    {t('vesting.vestingScheduleColumns.percent')}
                </div>
                <div className="amount">
                    {t('vesting.vestingScheduleColumns.amount')}
                </div>
                <div className="status">
                    {t('vesting.vestingScheduleColumns.status')}
                </div>
            </div>
            <Table
                columns={vestingColumns}
                dataSource={vestingData}
                pagination={false}
                scroll={{ y: 'auto' }}
            />
        </>
    );
}
