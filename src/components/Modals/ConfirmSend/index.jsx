import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import ConfirmSend from '../../ConfirmSend';
import { Button } from 'antd';

export default function ModalConfirmSend(props) {

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
        <div className="ShowModalConfirmSend">
            <Button type="secondary" className="secondary-button btn-clear" onClick={clear}>
                Clear
            </Button>
            <Button type="primary" className="primary-button btn-confirm" onClick={showModal} disabled={(inputValidationError) ? 'disabled': null}>
                Send
            </Button>
            <Modal
                title="Confirm Send"
                width={505}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalConfirmOperation"
                closable={false}
            >
                <ConfirmSend {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    );
}
