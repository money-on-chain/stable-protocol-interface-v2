import React, { useContext, useState, useEffect } from 'react';
import { useProjectTranslation } from '../../../helpers/translations';
import ModalImportantNotice from '../../Modals/ImportantNotice';

export default function NotificationTab(props) {
    const { 
        msg,
        detailedMsg, 
     } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="notification-panel-container">
            <div className="notification-text">
                {msg}
            </div>
            <button 
            type="primary"
            className="primary-button-roc btn-confirm"
            onClick={() => setIsOpen(!isOpen)}>
                Swap Now
            </button>
            <ModalImportantNotice 
                detailedMsg={detailedMsg}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
}
