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
                        limit: 20,
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
            dataIndex: 'event',
            width: 200,
            hidden: false,
            className: "table-border-single"
        },
        {
            dataIndex: 'platform',
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
        }, 30000);
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
    function determineAsset(operation){
        if(operation == "TCMint"){
            return { from: {icon: "ca_0", name: settings.tokens.CA[0].name}, to: {icon:"tc", name: settings.tokens.TC.name}}
        } else if(operation== "TCRedeem"){
            return { from: {icon: "tc", name: settings.tokens.TC.name}, to: {icon:"ca_0", name: settings.tokens.CA[0].name}}
        }else if(operation == "TPMint"){
            return { from: {icon: "ca_0", name: settings.tokens.CA[0].name} , to:{icon: "tp_0", name: settings.tokens.TP[0].name}}
        }else{
            console.log("CAN'T OPERATE: " + operation.operation)
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
            if(!data['executed']) return
            if(!data['executed']['qTC_']) return
            var amount = data['executed']['qTC_'] ? data['executed']['qTC_'] : data['executed']['qTP_']
            const detail = {
                event: data['operation'],
                created: (
                    <span>
                        <Moment
                            format={
                                i18n.language === 'en'
                                    ? date.DATE_EN
                                    : date.DATE_ES
                            }
                        >
                            {data['lastUpdatedAt']}
                        </Moment>
                    </span>
                ),
                details: data['executed']['qTC_'] || "--",
                asset: determineAsset(data.operation).from.name,
                confirmation: data['confirmationTime'] ? (
                    true ? (
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
                    ) : (
                        <span>
                            <Moment format="YYYY-MM-DD HH:MM:SS">
                                {data['confirmationTime']}
                            </Moment>
                        </span>
                    )
                ) : (
                    '--'
                ),
                address:
                    data['address'] !== '--' ? (
                        <Copy
                            textToShow={TruncatedAddress(data['params']['recipient'])}
                            textToCopy={data['address']}
                        />
                    ) : (
                        '--'
                    ),
                platform: "+" + Web3.utils.fromWei(amount) + " " + determineAsset(data.operation).from.name,
                platform_fee: data['platform_fee_value'] || "--",
                block: data['blockNumber'] || "--",
                wallet: data['wallet_value'] || "--",
                interests: data['interests'] || "--",
                tx_hash_truncate: TruncatedAddress(data['hash']) || "--",
                tx_hash: data['hash'] || "--",
                leverage: data['leverage']|| "--",
                gas_fee: data['gas_fee'] ||  data['gasFeeRBTC'] || "--",
                price: data['price'] || "--",
                comments: '--',
          
            };
            var amount = data['executed']['qTC_'] ? data['executed']['qTC_'] : data['executed']['qTP_']

            received_row.push({
                key: data._id,
                info: '',
                event: (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'right', marginRight: '8px' }}>
                            <div className='table-event-name'>{EventNameOldToNew(data['operation'])}</div>
                            <div className='table-amount' >+{parseFloat(Web3.utils.fromWei(amount)).toFixed(3)}</div>
                        </div>
                        <div className='table-icon-name' >
                            {getAsset(determineAsset(data.operation).from.icon).image}
                            <div className='table-asset-name'>{determineAsset(data.operation).from.name}</div>
                        </div>
                    </div>
                ),

                platform: (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'right', marginRight: '8px' }}>
                            <div className='table-event-name'>{EventNameOpposite(EventNameOldToNew(data['operation']))}</div><br></br>
                            <div className='table-amount'>+{parseFloat(Web3.utils.fromWei(amount)).toFixed(3)}</div>
                        </div>
                        <div className='table-icon-name' >
                            {getAsset(determineAsset(data.operation).to.icon).image}
                            <div className='table-asset-name'>{determineAsset(data.operation).to.name}</div>
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
            const asset = [];
            asset.push(determineAsset(element.detail.event).from.name)
            data.push({
                key: element.key,
                info: '',
                event: (
                    <span
                        className={classnames(
                            'event-action',
                            `${asset[0].color}`
                        )}>
                        {element.event}
                    </span>
                ),
                platform: (
                    <span className="display-inline currency-tx">
                        {element.platform}
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
    function EventNameOpposite(name) {
        switch (name) {
            case "Transfer":
                return "RECEIVED";
            case "SENT": 
                return "DESTINATION"
            case "EXCHANGED":
                return "RECEIVED"
            default:
                return "Exchanged";
        }
    }
    function EventNameOldToNew(name) {
        switch (name) {
            case "Transfer":
                return "SENT";
            case "TCMint" || "TPMint" || "TCRedeem":
                return "EXCHANGED"
            default:
                return "EXCHANGED";
        }
    }
    function getStatus(status){
        switch(status){
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
            default:
                console.log("UNROCOGNISED TOKEN: " + name)
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

