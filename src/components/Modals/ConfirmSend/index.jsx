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

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalConfirmSend">
            <Button
                type="primary"
                className={process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() ?
                    "primary-button btn-confirm" :
                    "primary-button btn-confirm"}
                onClick={showModal}
                disabled={(inputValidationError) ? 'disabled' : null}
            >
                Send
            </Button>
            <Modal
                title="Confirm Send"
                width={505}
                open={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalConfirmOperation"
                closable={false}
                centered={true}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', backdropFilter: 'blur(2px)' }}
            >
                <ConfirmSend {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    );
}
