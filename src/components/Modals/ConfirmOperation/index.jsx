import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import ConfirmOperation from '../../ConfirmOperation';
import { Button } from 'antd';

export default function ModalConfirmOperation(props) {

    const {
        onClear
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
            <Button type="secondary" className="secondary-button btn-clear" onClick={clear}>
                Clear
            </Button>
            <Button type="primary" className="primary-button btn-confirm" onClick={showModal}>
                Exchange
            </Button>
            <Modal
                title="Exchange Details"
                width={505}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalConfirmOperation"
            >
                <ConfirmOperation {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    );
}
