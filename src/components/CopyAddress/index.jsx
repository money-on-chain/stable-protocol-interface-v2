import { notification } from 'antd';
import React from 'react';
import { useProjectTranslation } from '../../helpers/translations';


export default function CopyAddress(props) {
    const {t} = useProjectTranslation();

    const { address = '', type = '' } = props;

    const truncateAddress = (address) => {
        if (address === '') return '';
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4, address.length)
        );
    };

    const onClick = () => {
        navigator.clipboard.writeText(address);
        notification.open({
            message: t('feedback.clipboardCopy'),
            description: `${address} ` + t('feedback.clipboardTo'),
            placement: 'bottomRight',
            onClose: () => {
                // Destruye el contenedor cuando se cierra la notificación
                notification.destroy();
            }
        });
    };

    let urlExplorer =
        import.meta.env.REACT_APP_ENVIRONMENT_EXPLORER_URL + '/address/' + address;
    switch (type) {
        case 'tx':
            urlExplorer =
                import.meta.env.REACT_APP_ENVIRONMENT_EXPLORER_URL +
                '/tx/' +
                address;
            break;
        default:
            break;
    }

    return (
        <>
            <div className="address-section">
                <span className="address tx-id-address">
                    <a href={urlExplorer} target="_blank" rel="noreferrer">
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
