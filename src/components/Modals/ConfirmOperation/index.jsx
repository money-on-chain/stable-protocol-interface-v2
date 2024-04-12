import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import ConfirmOperation from '../../ConfirmOperation';
import { Button } from 'antd';

export default function ModalConfirmOperation(props) {

    const {
        onClear,
        inputValidationError
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const clear = () => {
        onClear();
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalConfirmOperation">
            <Button type="primary" className="primary-button btn-confirm" onClick={showModal} disabled={(inputValidationError) ? 'disabled': null}>
                Exchange
            </Button>
            <Modal
                title={t('exchange.modalTitle')}
                width={505}
                open={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalConfirmOperation"
                closable={false}
                centered={true}
                maskClosable={false}
                maskStyle={{}}
            >
                <ConfirmOperation {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    );
}
