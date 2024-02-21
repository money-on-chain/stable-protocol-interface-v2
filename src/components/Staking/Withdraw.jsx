import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Image, Table } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import ActionIcon from '../../assets/icons/Action.svg';

const ProvideColumnsTP = [
    {
        title: 'Expiration',
        dataIndex: 'expiration',
        align: 'left',
        width: 120
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        align: 'right',
        width: 100
    },
    {
        title: 'Status',
        dataIndex: 'status',
        align: 'right',
        width: 140
    },
    {
        title: 'Available Actions',
        dataIndex: 'available_actions',
        align: 'right',
        width: 160
    }
];

export default function Withdraw() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [current, setCurrent] = useState(1);
    const { accountData = {} } = auth;
    const [totalTable, setTotalTable] = useState(50);//TODO call correct info
    const columnsData = [];

    // Columns
    ProvideColumnsTP.forEach(function (dataItem) {
        columnsData.push({
            title: dataItem.title,
            dataIndex: dataItem.dataIndex,
            align: dataItem.align,
            width: dataItem.width
        });
    });

    // Rows
    const tokensData = Array.from({ length: 4 }, (_, index) => ({
        key: index,
        expiration: (
            <div className="item-data">
                2022-10-05 22:47:00
            </div>
        ),
        amount: (
            <div className="item-data">
                0.00
            </div>
        ),
        status: (
            <div className="item-data">
                Processing Unstake
            </div>
        ),
        available_actions: (
            <div className='group-container'>
                <div className="action-container">
                    <span className="token-description">
                        Restake
                    </span>
                    <div className='icon-action'>
                        <Image src={ActionIcon} alt="Action" preview={false} />
                    </div>
                </div>
                <div className="action-container">
                    <span className="token-description">
                        Withdraw
                    </span>
                    <div className='icon-action'>
                        <Image src={ActionIcon} alt="Action" preview={false} />
                    </div>
                </div>
            </div>
        )
    }));
    const onChange = (page) => {
        if (accountData !== undefined) {
            setCurrent(page);
            // data_row(page);
            // transactionsList(page, true);
            //TODO call correct info
        }
    };
    return (

        <div className="card-withdraw">

            <div className="title">
                <h1>{t('staking.withdraw.title')}</h1>
                <div className="withdraw-header-balance">
                    <div className='withdraw-header-group'>
                        <div className="withdraw-header-balance-number">
                            12,345.67 MOC
                        </div>
                        <div className="withdraw-header-balance-title">
                            PROCESSING UNSTAKE
                        </div>
                    </div>
                    <div className='withdraw-header-group'>
                        <div className="withdraw-header-balance-number">
                            12,345.67 MOC
                        </div>
                        <div className="withdraw-header-balance-title">
                            PROCESSING UNSTAKE
                        </div>
                    </div>
                </div>
            </div>
            <Table
                columns={columnsData}
                dataSource={tokensData}
                pagination={{
                    pageSize: 10,
                    position: ['none', 'bottomRight'],
                    defaultCurrent: 1,
                    onChange: onChange,
                    total: totalTable
                }}
                scroll={{ y: 200 }}
            />
        </div>


    );
}
