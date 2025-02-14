import React, { useState } from "react";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import PropTypes from "prop-types";

import { useProjectTranslation } from "../../../helpers/translations";
import ConfirmOperation from "../../ConfirmOperation";

export default function ModalConfirmOperation(props) {
    const { /*onClear,*/ inputValidationError } = props;

    const { t } = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    /*
    const clear = () => {
        onClear();
    };*/

    const hideModal = () => {
        setVisible(false);
    };
    return (
        <div className="ShowModalConfirmOperation">
            <Button
                type="primary"
                className="button"
                onClick={showModal}
                disabled={inputValidationError ? "disabled" : null}
            >
                {t("exchange.buttonPrimary")}
            </Button>
            {visible && (
                <Modal
                    title={t("exchange.modalTitle")}
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
            )}
        </div>
    );
}

ModalConfirmOperation.propTypes = {
    inputValidationError: PropTypes.bool,
};
