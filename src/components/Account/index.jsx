import React, { useContext, useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { notification, Switch, Select, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

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
    const [showAdditional, setShowAdditional] = useState(false);

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
    const onCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        notification.open({
            message: t('feedback.clipboardCopy'),
            description: `${address} ` + t('feedback.clipboardTo'),
            placement: 'bottomRight'
        });
    };
    return (
        <div className="AccountDialog">
            <div className="title">{t('wallet.modalTitle')}</div>
            <div className='address'>
                <div
                    style={{ cursor: qrValue ? 'pointer' : 'default' }}
                    onClick={() => {
                        if (!qrValue) return;
                        window.open(qrValue, '_blank', 'noopener,noreferrer');
                    }}
                >
                    <div className="caption">{t('wallet.userAddress')}</div>{' '}
                    <div className="address-info">
                        <div className="truncate-address">{truncatedAddress}</div>
                        <a onClick={onCopy}>
                            <i className="icon-copy"></i>
                        </a>
                    </div>
                </div>
                <div className="qr">
                    <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={qrValue ?? ''} viewBox={`0 0 256 256`} />
                </div>
            </div>
            <Switch checked={showAdditional} onChange={(checked) => setShowAdditional(checked)} />
            
            {showAdditional && (
                <div className="additional-content">
                    <div className="dropdown-label">{t('wallet.inputLabel')}</div>
                    <Select defaultValue="option1" style={{ width: 120 }} >
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                    </Select>
                    <Button icon={<CopyOutlined />} onClick={onCopy} />
                    <div className="buttons">
                        <Button>{t('button1')}</Button>
                        <Button>{t('button2')}</Button>
                        <Button>{t('button3')}</Button>
                    </div>
                    <div className="additional-text">{t('additionalText')}</div>
                </div>
            )}
            <div className="actions">
                <button type="secondary" className="secondary-button btn-clear" onClick={onDisconnect}>
                    {t('wallet.cta.disconnect')}
                </button>
                <button type="primary" className="primary-button btn-confirm" onClick={onClose}>
                    {t('wallet.cta.close')}
                </button>
            </div>
        </div>
    );
}
