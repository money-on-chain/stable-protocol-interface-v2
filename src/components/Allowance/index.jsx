import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from 'antd';

import {useProjectTranslation} from "../../helpers/translations";
import { AuthenticateContext } from '../../context/Auth';

export default function AllowanceDialog(props) {

    const {
        onCloseModal,
        currencyYouExchange,
        currencyYouReceive,
        amountYouExchangeLimit,
        amountYouReceiveLimit,
        onRealSendTransaction
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');

    let sentIcon = '';
    let statusLabel = '';
    switch (status) {
        case 'SUBMIT':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = '';
            break;
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel = 'Please, sign the allowance authorization transaction using your wallet.';
            break;
        case 'WAITING':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Please, wait while the allowance authorization is mined in the blockchain. Once it’s done, the transaction will be sent to your wallet.';
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel = 'Operation Failed!';
            break;
        default:
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Wait for transaction confirmation';
    }

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal();
    };

    const onAuthorize = () => {
        // First change status to sign tx
        //amountAllowance = new BigNumber(1000) //Number.MAX_SAFE_INTEGER.toString()
        setStatus('SIGN')
        auth.interfaceAllowanceAmount(currencyYouExchange, currencyYouReceive, amountYouExchangeLimit, onTransaction, onReceipt).then((value => {
            onCloseModal();
        }))
    };

    const onTransaction = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('WAITING')
        console.log("On transaction: ", transactionHash)
    };

    const onReceipt = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log("On receipt: ", receipt)
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
        onRealSendTransaction()
    };


    return (
        <div className="AllowanceDialog">
            <div className="Content">
                { status === 'SUBMIT' && <div className="status-submit">
                    <div className="status-text">Before continuing with the operation, you must authorize the allowance so that the system can access the tokens.</div>
                    <div className="remember-this">
                        <Checkbox className="check-unlimited" onChange={onChange}>Set unlimited allowance. Don’t ask me again.</Checkbox>
                    </div>
                    <div className="actions">
                        <button type="primary" className="btnClose" onClick={onClose}>Cancel</button>
                        <button type="primary" className="btnAuthorize" onClick={onAuthorize}>Authorize</button>
                    </div>
                </div>
                }

                { (status === 'SIGN' || status === 'WAITING' || status === 'ERROR') && <div className="status-tx">
                    <div className="status-text">{statusLabel}</div>
                    <div className="logo-tx">
                        <i className={sentIcon}></i>
                    </div>
                    <div className="actions">
                        <button type="primary" className="btnClose" onClick={onClose}>Cancel</button>
                    </div>
                </div>
                }


            </div>
        </div>

    )
}