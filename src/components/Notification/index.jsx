import React, { useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { useProjectTranslation } from "../../helpers/translations";
import './style.scss'; // Asegúrate de tener la ruta correcta a tu archivo CSS

export default function NotificationBody(props) {
  const [t, i18n, ns] = useProjectTranslation();
  const [visible, setVisible] = useState(false);
  const {
    notifStatus
  } = props;
  useEffect(() => {
    console.log('props', props.notifStatus);
  }, [props])



  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <div className={`notification-container-${notifStatus.notifClass}`}>
      <div className="icon-left">
        <i className={`${notifStatus.iconLeft}-notif display-block`}></i>
      </div>
      <div className="text-content">
        <h4>{notifStatus.title}</h4>
        <p>{notifStatus.textContent}</p>
      </div>
      <div>
        {notifStatus.isDismisable && <div className="action">
          <button onClick={hideModal}>Dismiss</button>
        </div>}
      </div>
    </div>
  );
}
