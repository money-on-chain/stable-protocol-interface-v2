import React, { useContext, useEffect, useState } from 'react';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Table, Skeleton } from 'antd';
import classnames from 'classnames';
import Moment from 'react-moment';
import RowDetail from '../RowDetail';
import api from '../../../services/api';
import { myParseDate } from '../../../helpers/helper';
import Copy from '../../Page/Copy';
import date from '../../../helpers/date';
import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import './style.scss';
import Web3 from 'web3';
import settings from "../../../settings/settings.json"
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { fromContractPrecisionDecimals } from '../../../helpers/Formats';
import BigNumber from 'bignumber.js';
import { TokenSettings } from '../../../helpers/currencies';
export default function ListOperations(props) {
    const { token } = props;
    const [current, setCurrent] = useState(1);
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [dataJson, setDataJson] = useState([]);
    const [totalTable, setTotalTable] = useState(0);
    const [loadingSke, setLoadingSke] = useState(true);
    const timeSke = 1500;
    var data = [];
    const received_row = [];
    var txList = [];
    const transactionsList = (skip) => {
        if (auth.isLoggedIn) {
            console.log("Loading table ...")
            const datas =
                {
                    address: accountData.Owner,
                    limit: 10,
                    skip: (skip - 1 + (skip - 1)) * 10
                };
                setTimeout(() => {
                    const baseUrl = `${process.env.REACT_APP_ENVIRONMENT_API_OPERATIONS}operations/list/`;
                    const queryParams = new URLSearchParams({
                        recipient: accountData.Owner,
                        limit: 1000,
                        skip: 0
                    }).toString();
                    const url = `${baseUrl}?${queryParams}`;
                
                    api('get', url)
                        .then((response) => {
                            setDataJson(response);
                            setTotalTable(response.total)
                        })
                        .catch((error) => {
                            console.error(error);
                        });          
                }, 500);                
        }
    };
    const columns = [
        {
            dataIndex: 'exchange',
            width: 200,
            hidden: false,
            className: "table-border-single"
        },
        {
            dataIndex: 'receive',
            width: 360,
            hidden: false,
            className: "table-border-single"
        },
        {
            dataIndex: 'date',
            width: 220,
            hidden: false,
            className: "table-border-single"
        },
        {
            dataIndex: 'status',
            width: 180,
            hidden: false,
        }
    ].filter((item) => !item.hidden);
    useEffect(() => {
        const interval = setInterval(() => {
            transactionsList(current);
        }, 15000);
        return () => clearInterval(interval);
    }, [accountData.Owner]);
    useEffect(() => {
        transactionsList(current);
    }, [accountData.Owner]);
    const onChange = (page) => {
        if (accountData !== undefined) {
            setCurrent(page);
            data_row(page);
            transactionsList(page, true);
        }
    };

    function tokenExchange(row_operation){

        let status = ''
        if (row_operation['executed']) {
            status = 'executed'
        } else if (row_operation['params']) {
            status = 'params'
        }

        if (!status) {
            return {
                exchange: {
                    amount: 0,
                    name: '',
                    token: '',
                    icon: "ca_0",
                    title: "EXCHANGED"
                },
                receive: {
                    amount: 0,
                    name: '',
                    token: '',
                    icon: "ca_0",
                    title: "RECEIVED"
                }
            }
        }

        if (row_operation['operation'] === "TCMint") {

            return {
                exchange: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qACmax'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "ca_0",
                    title: status === "executed" ? "EXCHANGED" : "EXCHANGE"
                },
                receive: {
                    amount: status === "executed" ? row_operation[status]['qTC_'] : row_operation[status]['qTC'],
                    name: settings.tokens.TC.name,
                    token: settings.tokens.TC,
                    icon: "tc",
                    title: status === "executed" ? "RECEIVED" : "RECEIVE"
                }
            }
        } else if (row_operation['operation']  === "TCRedeem") {

            return {
                exchange: {
                    amount: status === "executed" ? row_operation[status]['qTC_'] : row_operation[status]['qTC'],
                    name: settings.tokens.TC.name,
                    token: settings.tokens.TC,
                    icon: "tc",
                    title: status === "executed" ? "EXCHANGED" : "EXCHANGE"
                },
                receive: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qACmin'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "ca_0",
                    title: status === "executed" ? "RECEIVED" : "RECEIVE"
                }
            }
        } else if (row_operation['operation']  === "TPMint") {

            const tp_index = row_operation[status]['tpIndex'] || 0

            return {
                exchange: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qACmax'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "ca_0",
                    title: status === "executed" ? "EXCHANGED" : "EXCHANGE"
                },
                receive: {
                    amount: status === "executed" ? row_operation[status]['qTP_'] : row_operation[status]['qTP'],
                    name: settings.tokens.TP[tp_index].name,
                    token: settings.tokens.TP[tp_index],
                    icon: `tp_${tp_index}`,
                    title: status === "executed" ? "RECEIVED" : "RECEIVE"
                }
            }
        } else if (row_operation['operation']  === "TPRedeem") {

            const tp_index = row_operation[status]['tpIndex'] || 0

            return {
                exchange: {
                    amount: status === "executed" ? row_operation[status]['qTP_'] : row_operation[status]['qTP'],
                    name: settings.tokens.TP[tp_index].name,
                    token: settings.tokens.TP[tp_index],
                    icon: `tp_${tp_index}`,
                    title: status === "executed" ? "EXCHANGED" : "EXCHANGE"
                },
                receive: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qACmin'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "ca_0",
                    title: status === "executed" ? "RECEIVED" : "RECEIVE"
                }
            }
        } else if (row_operation['operation']  === "Transfer") {
            return {
                exchange: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qAC'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "tp_0",
                    title: status === "executed" ? "TRANSFERRED" : "TRANSFER"
                },
                receive: {
                    amount: status === "executed" ? row_operation[status]['qAC_'] : row_operation[status]['qAC'],
                    name: settings.tokens.CA[0].name,
                    token: settings.tokens.CA[0],
                    icon: "ca_0",
                    title: status === "executed" ? "TRANSFERRED" : "TRANSFER"
                }
            }
        } else {
            console.log("CAN'T OPERATE: " + row_operation.operation)
        }

    }
    const data_row = () => {
        /*******************************sort descending by date lastUpdatedAt***********************************/
        if (dataJson.operations !== undefined) {
            dataJson.operations.sort((a, b) => {
                return (
                    myParseDate(b.lastUpdatedAt) - myParseDate(a.lastUpdatedAt)
                );
            });
        }
        /*******************************filter by type (token)***********************************/
        var pre_datas = [];
        if (dataJson.operations !== undefined) {
            pre_datas = dataJson.operations.filter((data_j) => {
                return (token !== 'all') ? data_j.tokenInvolved === token : true;
            });
        }
        txList = pre_datas;
        data = [];

        txList.forEach((data) => {

            const token = tokenExchange(data)

            const detail = {
                event: data['operation'],
                oper_id: data['operId_'],
                exchange: token.exchange,
                receive: token.receive,
                created: (
                    <span>
                        <Moment
                            format={
                                i18n.language === 'en'
                                    ? date.DATE_EN
                                    : date.DATE_ES
                            }
                        >
                            {data['createdAt']}
                        </Moment>
                    </span>
                ),
                confirmation: data['confirmationTime'] ? (
                    (
                        <span>
                            <Moment
                                format={
                                    i18n.language === 'en'
                                        ? date.DATE_EN
                                        : date.DATE_ES
                                }
                            >
                                {data['confirmationTime']}
                            </Moment>
                        </span>
                    )
                ) : (
                    '--'
                ),
                recipient:
                    data['params']['recipient'] !== '--' ? (
                        <Copy
                            textToShow={TruncatedAddress(data['params']['recipient'])}
                            textToCopy={data['params']['recipient']}
                        />
                    ) : (
                        '--'
                    ),
                block: data['blockNumber'] || "--",
                tx_hash_truncate: TruncatedAddress(data['hash']) || "--",
                tx_hash: data['hash'] || "--",
                gas_fee: data['gas_fee'] ||  data['gasFeeRBTC'] || "--",
                gas: data['gas'] || "--",
                gas_price: data['gasPrice'] || "--",
                gas_used: data['gasUsed'] || "--",
                error_code: data['errorCode_'] || "--",
                msg: data['msg_'] || "--",
                reason: data['reason_'] || "--",
                executed_tx_hash_truncate: TruncatedAddress(data['hash']) || "--",
                executed_tx_hash: data['hash'] || "--",
                status: getStatus(data['status']) || "--",
                fee: getFee(data) || "--"
            };

            received_row.push({
                key: data._id,
                info: '',
                exchange: (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'right', marginRight: '8px' }}>
                            <div className='table-event-name'>{token.exchange.title}</div>
                            <div className='table-amount' >
                                {PrecisionNumbers({
                                    amount: token.exchange.amount,
                                    token: token.exchange.token,
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                            </div>
                        </div>
                        <div className='table-icon-name' >
                            {getAsset(token.exchange.icon).image}
                            <div className='table-asset-name'>{token.exchange.name}</div>
                        </div>
                    </div>
                ),
                receive: (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'right', marginRight: '8px' }}>
                            <div className='table-event-name'>{token.receive.title}</div><br></br>
                            <div className='table-amount'>
                                {PrecisionNumbers({
                                    amount: token.receive.amount,
                                    token: token.receive.token,
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                            </div>
                        </div>
                        <div className='table-icon-name' >
                            {getAsset(token.receive.icon).image}
                            <div className='table-asset-name'>{token.receive.name}</div>
                        </div>
                    </div>
                ),
                date:( 
                    <div style={{paddingLeft: "25%"}}>
                      <div className='table-date-name' >
                        <span>DATE</span>
                      </div>
                      <div className='table-date'>
                        {new Date(data['lastUpdatedAt']).toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }).replace(',', '')}
                      </div>
                    </div>
                  ),                  
                  status: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={`tx-status-icon-${data['status']}`} 
                           style={{
                             margin: '0.5rem',
                             marginTop: '3px',
                             marginRight: '1rem',
                             cursor: 'pointer',
                             flexGrow: 0
                           }}
                      >
                      </div>
                       <span className={`table-status-icon ${getStatus(data['status']) === "FAILED" && "table-status-icon-red"}`}>
                       {getStatus(data['status'])}
                      </span>
                    </div>
                  ),                  
                detail: detail || "--"
            });

        });

        received_row.forEach((element) => {
            data.push({
                key: element.key,
                info: '',
                exchange: (
                    <span
                        className={classnames('event-action')}>
                        {element.exchange}
                    </span>
                ),
                receive: (
                    <span className="display-inline currency-tx">
                        {element.receive}
                    </span>
                ),
                date: <span>{element.date}</span>,
                status: (
                    <span style={{display: "flex", width: "100%", paddingLeft: "2rem"}}>{element.status}</span>
                ),
                description: <RowDetail detail={element.detail} />
            });
        });
    };

    data_row(current);
    const tableColumns = columns.map((item) => ({ ...item }));
    useEffect(() => {
        setTimeout(() => setLoadingSke(false), timeSke);
    }, [auth]);
    function TruncatedAddress( address, length = 6 ) {
        return address.substring(0, length + 2) + "…" + address.substring(address.length - length)
    }
    function getFee(row_operation){

        let qACfee = null
        let qFeeToken = null

        if (row_operation['executed'] && row_operation['executed']['qACfee_']) {
            qACfee = row_operation['executed']['qACfee_']
        }

        if (row_operation['executed'] && row_operation['executed']['qFeeToken_']) {
            qFeeToken = row_operation['executed']['qFeeToken_']
        }

        if (qACfee!=null) {
            return (<div>
                <span className="value">
                    {PrecisionNumbers({
                        amount: new BigNumber(qACfee),
                        token: TokenSettings('CA_0'),
                        decimals: 6,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </span>
                <span className="token">
                        {' '}
                    {t('exchange.tokens.CA_0.abbr', {
                        ns: ns
                    })}{' '}
                </span>
            </div>)
        } else if (qFeeToken!=null) {
            return (<div>
                <span className="value">
                    {PrecisionNumbers({
                        amount: new BigNumber(qFeeToken),
                        token: TokenSettings('FeeToken'),
                        decimals: 6,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: false
                    })}
                </span>
                <span className="token">
                        {' '}
                    {t('exchange.tokens.FeeToken.abbr', {
                        ns: ns
                    })}{' '}
                </span>
            </div>)
        } else {
            return '--'
        }

    }
    function getStatus(status){
        switch(status){
            case -3:
                return "FAILED"
            case -2:
                return "FAILED"
            case -1:
                return "FAILED"
            case 0:
                return "QUEUED"
            case 1:
                return "CONFIRMED"
        }
    }
    function getAsset(name){
        switch (name) {
            case "ca_0":
                return {
                    image: (
                        <i
                            className="icon-token-ca_0 icon-token-modif"                 
                        />
                    ),
                    color: 'color-token-tp',
                    txt: 'TP'
                }
            case 'tc':
                    return{
                        image: (
                            <i
                                className="icon-token-tc icon-token-modif"
                                
                            />
                        ),
                        color: 'color-token-tc',
                        txt: 'TC'
                    };
                case 'tp_0':
                    return{
                        image: (
                            <i
                                className="icon-token-tp_0 icon-token-modif"
                            />
                        ),
                        color: 'color-token-tc',
                        txt: 'TC'
                    };
                case 'tp_1':
                    return{
                        image: (
                            <i
                                className="icon-token-tp_1 icon-token-modif"
                            />
                        ),
                        color: 'color-token-tc',
                        txt: 'TP'
                    };
            default:
                console.log("UNRECOGNIZED TOKEN: " + name)
                return{
                    image: (
                        <i
                            className="icon-token-MOC"
                            style={{ display: 'block', margin: "auto" }}
                        />
                    ),
                    color: 'color-token-tp',
                    txt: 'TP'
                };
        }
    }

    return (
        <>
            <div className="title">
                <h1 className="title-last-operations">
                    {t(`operations.title`, { ns: ns })}
                </h1>
            </div>
            {!loadingSke ? (
                <>
                    <Table
                        className="vertical-middle custom-border-spacing-table custom-table"
                        showHeader={false}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div  className='table-expanded-row'>
                                    {record.description}
                                </div>
                            ),
   
                            expandIcon: ({ expanded, onExpand, record }) =>
                                expanded ? (
                                    <UpCircleOutlined
                                        style={{fontSize: "26px"}}
                                        onClick={(e) => onExpand(record, e)}
                                    />
                                ) : (
                                    <DownCircleOutlined
                                        style={{fontSize: "26px"}}
                                        onClick={(e) => onExpand(record, e)}
                                    />
                                )
                        }}
                        pagination={{
                            pageSize: 10,
                            position: ['none', 'bottomRight'],
                            defaultCurrent: 1,
                            onChange: onChange,
                            total: totalTable
                        }}
                        columns={tableColumns}
                        dataSource={
                            auth.isLoggedIn == true
                                    ? data
                                    : null
                        }
                        scroll={{ y: 340 }}
                    />
                </>
            ) : (
                <Skeleton active={true} paragraph={{ rows: 4 }}></Skeleton>
            )}
        </>
    );
}

