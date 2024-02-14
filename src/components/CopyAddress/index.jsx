import { notification } from 'antd';
import React from 'react';

export default function CopyAddress(props) {
    const {
        address = '',
        type = ''
    } = props;

    const truncateAddress = (address) => {
        if (address === '') return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
    };

    const onClick = () => {
        navigator.clipboard.writeText(address);
        notification.open({
            message: 'Copied',
            description: `${address} to clipboard`,
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
                <span className="address">
                    <a
                        href={urlExplorer}
                        target="_blank"
                    >
                        {truncateAddress(address)}
                    </a>
                </span>
                <a onClick={onClick} ><i className="icon-copy"></i></a>
            </div>
        </>
    );
}
