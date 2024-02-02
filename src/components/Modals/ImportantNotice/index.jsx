import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import ConfirmSend from '../../ConfirmSend';
import { Button } from 'antd';

export default function ModalImportantNotice(props) {

    const {
        detailedMsg,
        isOpen,
        setIsOpen
    } = props;
    const [t, i18n, ns] = useProjectTranslation();
    // const showModal = () => {
    //     setVisible(true);
    // };
    const openAction = () => {
        console.log('openAction');
    }
    const hideModal = () => {
        setIsOpen(false);
    };

    return (
        <Modal
            title="Important notice"
            width={505}
            open={isOpen}
            onCancel={hideModal}
            footer={null}
            className="ModalImportantNotice"
            closable={false}
            centered={true}
            maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(5px)' }}
        >
            <div className="notice-container">
                <div className="notice-body">
                    <p>
                        {detailedMsg}
                    </p>
                </div>
                <div className="notice-buttons">
                    <Button type="secondary" className="secondary-button-fixed-roc btn-clear" onClick={hideModal}>
                        Cancel
                    </Button>
                    <button
                        type="primary"
                        className="primary-button-roc btn-confirm"
                        onClick={openAction}
                    >
                        Confirm
                    </button>
                </div>
            </div>

        </Modal>
    );
}
