import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import Account from '../../Account';

export default function ModalAccount(props) {
    const { truncatedAddress } = props;

    const [t, i18n, ns] = useProjectTranslation();

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalAccount">
            <a onClick={showModal}>{truncatedAddress}</a>{' '}
            <Modal
                title={t("wallet.modalTitle")}
                width={505}
                open={visible}
                onCancel={hideModal}
                footer={null}
                closable={false}
                className="ModalAccount"
                centered={true}
                maskStyle={{  }}
            >
                <Account {...props} onCloseModal={hideModal} truncatedAddress={truncatedAddress} />
            </Modal>
        </div>
    );
}
