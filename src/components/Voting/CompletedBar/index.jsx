import React from 'react';
import './Styles.scss';

function CompletedBar(props) {
    return (
        <div className="CompletedBar__wrapper">
            {props.description}
            <div className="CompletedBar__container">
                <div
                    className={`gauge ${props.type} ${props.percentage === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.percentage }}
                ></div>
                <div
                    className={'needed ' + props.type}
                    style={{
                        position: 'absolute',
                        width: props.needed,
                        zPosition: 100
                    }}
                ></div>
            </div>
        </div>
    );
}

export default CompletedBar;
