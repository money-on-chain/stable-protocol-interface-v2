import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from "../../../helpers/translations";
// import Swap from "../Swap";
import { Button } from 'antd';
import './style.scss';
import AirdropToken from '../airdrop';


export default function ModalRocAirdrop(props) {

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div>
            <div className="NotificationRocAirdrop">
                <div className="Information">
                    {t('airdropModal.text')}
                </div>
                <div className="Action">
                    <button
                        type="primary"
                        className="primary-button btn-confirm"
                        onClick={showModal}>
                        {t('airdropModal.button')}
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
                <AirdropToken {...props} onCloseModal={hideModal} />
            </Modal>}
        </div>
    )
}