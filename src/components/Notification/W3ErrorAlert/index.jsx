import React, { useContext } from 'react';
import { Alert, Button } from 'antd';
import { useProjectTranslation } from '../../../helpers/translations';
import { AuthenticateContext } from '../../../context/Auth';
import './Styles.scss';

export default function W3ErrorAlert(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const truncateAddress = (address) => {
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4, address.length)
        );
    };
    const space = '\u00A0';

    const onDisplayAccount = () => {
        auth.onShowModalAccount(true);
    };

    return (
        <Alert
            className="alert alert-error"
            message="Web3 connection Error!"
            description={
                <div>
                    There is a problem connecting to the blockchain, please
                    review the internet connection.
                </div>
            }
            type="error"
            showIcon
            // closable
        />
    );
}
