import React, { useContext, useState, useEffect } from 'react';
import QRCode from "react-qr-code";

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';

export default function AccountDialog(props) {
    const {
        onCloseModal,
        truncatedAddress
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [qrValue, setQrValue] = useState(null);
    
    useEffect(() => {
        const url = process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL + '/address/' + auth.accountData.Wallet;
        setQrValue(url);
    }, [auth, auth.accountData.Wallet]);
    
    const onClose = () => {
        onCloseModal();
    };

    const onDisconnect = () => {
        onCloseModal();
        auth.disconnect();
    };
    return (
        <div className="AccountDialog">
            <div className="qr">
                <QRCode
                    size={256}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    value={qrValue ?? ''}
                    viewBox={`0 0 256 256`}
                />
            </div>

            <div
                className="address"
                style={{ cursor: qrValue ? 'pointer' : 'default' }}
                onClick={() => {
                    if (!qrValue) return;
                    window.open(qrValue, '_blank', 'noopener,noreferrer');
                }}
            >
                <div className="caption">Address</div>{' '}
                <div className="truncate-address">{truncatedAddress}</div>
            </div>

            <div className="actions">
                <button
                    type="secondary"
                    className="secondary-button-fixed btn-clear"
                    onClick={onDisconnect}
                >
                    Disconnect
                </button>
                <button
                    type="primary"
                    className="primary-button-fixed btn-confirm"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
