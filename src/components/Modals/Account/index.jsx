import React, { Fragment } from 'react';
import Modal from 'antd/lib/modal/Modal';


import Account from '../../Account';

export default function ModalAccount(props) {
    const { truncatedAddress, show, onShow, onHide, vestingOn, setVestingOn } = props;

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
                    <Account {...props} onCloseModal={onHide} truncatedAddress={truncatedAddress} vestingOn={vestingOn} setVestingOn={setVestingOn} />
                </Modal>
            </div>
            <i className="logo-wallet" onClick={onShow}></i>
        </Fragment>
    );
}
