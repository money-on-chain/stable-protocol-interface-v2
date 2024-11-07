import React, { useContext, useState, useEffect } from 'react';
import { Image, Skeleton, Table } from 'antd';
import Moment from 'react-moment';
import moment from 'moment-timezone';

import date from '../../helpers/date';
import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import ActionIcon from '../../assets/icons/Action.svg';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';

export default function LastStakeOperations(props) {
    const { userInfoStaking } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [totalTable, setTotalTable] = useState(null);
    const [data, setData] = useState(null);
    const [modalMode, setModalMode] = useState(null);
    const [withdrawalId, setWithdrawalId] = useState('0');
    const [modalAmount, setModalAmount] = useState('0');
    const [operationModalInfo, setOperationModalInfo] = useState({});
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);

    const tableColumns = [{ title: 'Token', dataIndex: 'details' }];
    // hay que agregar los encabezados como html?
    // hay que incrementar un contador en el foreach?
    const tableData = [];
    const stakingData = [
        { key: 1, date: '10/04/2024', amount: 223423.34, operation: 'Stake' },
        { key: 2, date: '15/15/2024', amount: 223423.34, operation: 'Stake' },
        {
            key: 3,
            date: '15/15/2024',
            amount: 223423.34,
            operation: 'Withdraw'
        },
        {
            key: 4,
            date: '2024-07-31 10:04:17',
            amount: 223423.34,
            operation: 'Unstake'
        },
        { key: 5, date: '15/15/2024', amount: 223423.34, operation: 'Stake' },
        { key: 6, date: '15/15/2024', amount: 223423.34, operation: 'Stake' }
    ];

    // Columns
    stakingData.forEach(function (dataItem) {
        tableData.push({
            key: dataItem.key,
            details: (
                <div className="table__row">
                    <div className="stakingTableData__date">
                        {dataItem.date}
                    </div>
                    <div className="stakingTableData__amount">
                        {dataItem.amount}
                    </div>
                    <div className="stakingTableData__operation">
                        {dataItem.operation}
                    </div>
                </div>
            )
        });
    });

    return (
        <div className="section__innerCard card-stakingData">
            <div className="layout-card-title">
                <h1>{t('staking.history.title')}</h1>
            </div>
            <div className="table__stakingData">
                <div className="table__header">
                    <div className="stakingTableData__date">
                        {t('staking.history.columnDate')}
                    </div>
                    <div className="stakingTableData__amount">
                        {t('staking.history.columnAmount')}
                    </div>
                    <div className="stakingTableData__operation">
                        {t('staking.history.columnOperation')}
                    </div>
                </div>
                {tableData || true ? (
                    <>
                        <div className="divider-horizontal"></div>
                        <Table
                            columns={tableColumns}
                            dataSource={tableData}
                            showHeader={false}
                            pagination={{
                                pageSize: 1000,
                                position: ['none', 'bottomRight'],
                                defaultCurrent: 1,
                                total: totalTable
                            }}
                            // scroll={{ y: 200 }}
                        />
                    </>
                ) : (
                    <Skeleton active />
                )}
            </div>
        </div>
    );
}
