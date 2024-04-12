import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from "../../../helpers/translations";
import Swap from "../Swap";
import { Button } from 'antd';
import './style.scss';


export default function ModalTokenMigration(props) {

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="ShowTokenMigration">
            <div className="NotificationMigration">
                <div className="Information">
                    {t('swapModal.text1')}
                    <span className="swapNow" onClick={showModal} style={{ cursor: "pointer" }}>{t('swapModal.text2')}</span>
                </div>
                <div className="Action">
                    <button
                        type="primary"
                        className="primary-button btn-confirm"
                        onClick={showModal}>
                        {t('swapModal.button')}
                    </button>
                </div>
            </div>
            {visible && <Modal
                title=""
                width={560}
                open={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalTokenMigration"
                centered={true}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', backdropFilter: 'blur(2px)' }}
            >
                <Swap {...props} onCloseModal={hideModal} />
            </Modal>}
        </div>
    )
}