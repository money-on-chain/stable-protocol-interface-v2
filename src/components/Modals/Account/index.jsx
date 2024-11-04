import React, { Fragment } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import Account from '../../Account';

export default function ModalAccount(props) {
    const { truncatedAddress, show, onShow, onHide, vestingOn } = props;

    const [t, i18n, ns] = useProjectTranslation();

    return (
        <Fragment>
            <div className="ShowModalAccount">
                {/*<a onClick={onShow}>{truncatedAddress}</a>*/}
                <Modal
                    width={505}
                    open={show}
                    onCancel={onHide}
                    footer={null}
                    closable={false}
                    className="ModalAccount"
                    centered={true}
                    maskStyle={{  }}
                >
                    <Account {...props} onCloseModal={onHide} truncatedAddress={truncatedAddress} vestingOn={vestingOn} />
                </Modal>
            </div>
            <i className="logo-wallet" onClick={onShow}></i>
        </Fragment>
    );
}
