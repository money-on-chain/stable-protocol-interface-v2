
import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import {useProjectTranslation} from "../../../helpers/translations";
import ConfirmOperation from "../../ConfirmOperation";
import {Button} from "antd";


export default function ModalConfirmOperation(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalConfirmOperation">
            <Button
                type="primary"
                className="btnConfirm"
                onClick={showModal}
            >Exchange</Button>
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
    )
}