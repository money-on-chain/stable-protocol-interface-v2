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
                    {"RIF Dollar (RDOC) has changed to RIF US Dollar (USDRIF). You need to swap your RIF Dollars to operate with the updated DAPP. You won't be able to see your RDOC balance in the DAPP. Please, swap your tokens using the "}
                    <span className="swapNow">Swap Now button</span>
                </div>
                <div className="Action">
                    <button
                        type="primary"
                        className="primary-button-roc btn-confirm"
                        onClick={showModal}>
                        Swap Now
                    </button>
                </div>
            </div>
            <Modal
                title=""
                width={560}
                open={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalTokenMigration"
                centered={true}
                maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(5px)' }}
            >
                <Swap {...props} onCloseModal={hideModal} />
            </Modal>
        </div>
    )
}