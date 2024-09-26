import React from 'react';
import './Styles.scss';

function BalanceBar(props) {
    return (
        <div className="balanceBar">
            <div className="balanceBar__labels">
                <div className="label">{props.against} Against</div>
                <div className="label">{props.infavor} In favor</div>
            </div>
            <div className="balanceBar__wrapper">
                <div
                    className={`against ${props.against === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.against }}
                ></div>
                <div className="graphDivider"></div>
                <div
                    className={`infavor ${props.infavor === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.infavor }}
                ></div>
            </div>
        </div>
    );
}

export default BalanceBar;
