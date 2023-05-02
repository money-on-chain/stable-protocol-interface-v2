import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';

export default function AccountDialog(props) {
    const {
        onCloseModal,
        truncatedAddress
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

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

            </div>

            <div className="address">
                <div className="caption">Address</div> <div className="truncate-address">{truncatedAddress}</div>
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
