import React, { useContext } from 'react';
import { Row, Table } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import './Styles.scss';


export default function LiquidityMiningClaims(props) {
    const [t] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const tableColumns = [
        {
            dataIndex: 'renderRow'
        }
    ];

    // THIS TABLE IS FOR EMULATING DATA ONLY, IT SHOULD BE REMOVED ONCE THE BACKEND IS DONE
    const tempData = [
        {
            key: 0,
            event: 'claim',
            amount: 34234.3423423,
            date: '2022-10-05 22:47:00',
            status: t('liquidityMining.claimsTable.statusReceived')
        },
        {
            key: 1,
            event: 'claim',
            amount: 74567.4563,
            date: '2022-10-05 22:47:00',
            status: t('liquidityMining.claimsTable.statusInProgress')
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        },
        {
            key: 2,
            event: 'claim',
            amount: 5243.457633,
            date: '2022-10-05 22:47:00',
            status: 'Received'
        }
    ];

    const tableData = tempData.map((item, itemIndex) => ({
        key: itemIndex,
        renderRow: (
            <div className="renderRow">
                <div className="date">{item.date}</div>
                <div className="amount">{item.amount}</div>
                <div className="event">{item.event}</div>
                <div className="status">{item.status}</div>
            </div>
        )
    }));

    return (
        <div className="layout-card">
            <div className="layout-card-title">
                <h1>{t('liquidityMining.cardTitle')}</h1>
            </div>
            <div className="renderHeader">
                <div className="date">
                    {t('liquidityMining.claimsTable.date')}
                </div>
                <div className="amount">
                    {t('liquidityMining.claimsTable.amount')}
                </div>
                <div className="event">
                    {t('liquidityMining.claimsTable.event')}
                </div>
                <div className="statu">
                    {t('liquidityMining.claimsTable.status')}
                </div>
            </div>
            <Table
                columns={tableColumns}
                dataSource={tableData}
                pagination={true}
                showHeader={false}
                scroll={{ y: 'auto' }}
            />
        </div>
    );
}
