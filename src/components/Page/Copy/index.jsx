import { notification } from 'antd';
import React from 'react';

import IconCopy from './../../../assets/icons/CopyOutline.svg';

export default function Copy(props) {
    const {
        textToShow = '',
        textToCopy = '',
        fastBTC = false,
        typeUrl = ''
    } = props;

    const onClick = () => {
        navigator.clipboard.writeText(textToCopy);
        notification.open({
            message: 'Copied',
            description: `${textToCopy} to clipboard`,
            placement: 'bottomRight',
            onClose: () => {
                // Destruye el contenedor cuando se cierra la notificación
                notification.destroy();
            }
        });
    };

    let url_set =
        process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL +
        '/address/' +
        textToCopy;
    switch (typeUrl) {
        case 'tx':
            url_set =
                process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL +
                '/tx/' +
                textToCopy;
            break;
        default:
            break;
    }

    return (
        <>
            <div>
                {textToCopy && (
                    <img
                        onClick={onClick}
                        width={17}
                        height={17}
                        src={IconCopy}
                        alt=""
                        style={{
                            marginRight: 10,
                            cursor: 'pointer',
                            flexGrow: '0',
                            marginTop: '3px'
                        }}
                    />
                )}
                <span style={{ display: fastBTC && 'flex' }}>
                    <a
                        style={{
                            flexGrow: '1',
                            fontweight: 'bold'
                        }}
                        href={url_set}
                        target="_blank"
                    >
                        {textToShow}
                    </a>
                </span>
            </div>
        </>
    );
}
