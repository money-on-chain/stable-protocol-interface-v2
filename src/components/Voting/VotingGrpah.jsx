import React from 'react';

function BarGraph(props) {
    return (
        <div className="bar-graph__wrapper">
            {props.description}
            <div className="bar-graph__container">
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

function BarBalance(props) {
    return (
        <div className="balance-graph">
            <div className="balance-graph__labels">
                <div className="label">{props.against} Against</div>
                <div className="label">{props.infavor} In favor</div>
            </div>
            <div className="balance-graph__wrapper">
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

export default BarGraph;
export { BarBalance, BarGraph };
