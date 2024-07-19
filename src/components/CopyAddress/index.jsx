import { notification } from 'antd';
import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';

export default function CopyAddress(props) {
    const [t, i18n, ns] = useProjectTranslation();

    const { address = '', type = '' } = props;

    const truncateAddress = (address) => {
        if (address === '') return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
    };

    const onClick = () => {
        navigator.clipboard.writeText(address);
        notification.open({
            message: t('feedback.clipboardCopy'),
            description: `${address} ` + t('feedback.clipboardTo'),
            placement: 'bottomRight'
        });
    };

    let urlExplorer = process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL + '/address/' + address;
    switch (type) {
        case 'tx':
            urlExplorer = process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL + '/tx/' + address;
            break;
        default:
            break;
    }

    return (
        <>
            <div className="address-section">
                <span className="address tx-id-address">
                    <a href={urlExplorer} target="_blank">
                        {truncateAddress(address)}
                    </a>
                </span>
                <a onClick={onClick}>
                    <i className="icon-copy"></i>
                </a>
            </div>
        </>
    );
}
