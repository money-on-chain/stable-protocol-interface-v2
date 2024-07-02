import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import settings from '../../../settings/settings.json';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import { ProvideColumnsCA } from '../../../helpers/tokensTables';
import NumericLabel from 'react-pretty-numbers';

export default function VestingSchedule(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const tokensData = []; // table data
    const columnsData = []; // table columns
    const params = Object.assign({
        shortFormat: true,
        justification: 'L',
        locales: i18n.languages[0],
        shortFormatMinValue: 1000000,
        commafy: true,
        shortFormatPrecision: 2,
        precision: 2,
        title: '',
        cssClass: ['display-inline']
    });
    const vestingColumns = [
        {
            title: t('vesting.vestingScheduleColumns.date'),
            dataIndex: 'date',
            align: 'left',
            width: 150,
            className: 'date-column'
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
            width: 300,
            className: 'amount-column'
        },
        {
            title: t('vesting.vestingScheduleColumns.status'),
            dataIndex: 'status',
            align: 'left',
            width: 'auto',
            className: 'status-column'
            // render: (_, record) => (
            //     <div size="middle">
            //         <a>Processed {record.name}</a>
            //         <a>Delete</a>
            //     </div>
            // )
        }
    ];
    const vestingData = [
        {
            key: '1',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '000000000.0000000',
            status: 'Released'
        },
        {
            key: '2',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '2348342.234442',
            status: 'Released'
        },
        {
            key: '3',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '2348342.234442',
            status: 'Released'
        },
        {
            key: '4',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '2348342.234442',
            status: 'Vested'
        },
        {
            key: '5',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '2348342.234442',
            status: 'Vested'
        },
        {
            key: '6',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '6',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '7',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '8',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '9',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '10',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '34.234442',
            status: 'Vested'
        },
        {
            key: '11',
            date: '02/12/2024',
            percent: '65.23%',
            amount: '12.43',
            status: 'Vested'
        }
    ];

    return <Table columns={vestingColumns} dataSource={vestingData} pagination={false} scroll={{ y: 350 }} />;
}
