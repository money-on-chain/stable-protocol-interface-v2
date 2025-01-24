import React, { Component } from 'react';

export default class InputAmount extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.inputRef.current.addEventListener('wheel', this.handleWheel, {
                passive: false
            });
        }
    }

    componentWillUnmount() {
        if (this.inputRef.current) {
            this.inputRef.current.removeEventListener(
                'wheel',
                this.handleWheel
            );
        }
    }

    handleWheel = (event) => {
        event.preventDefault();
    };

    render() {
        return (
            <div className="amountInput">
                <div className="amountInput__infoBar">
                    <div className="amountInput__label">
                        {this.props.action}
                    </div>
                    <span className="amountInput__available">
                        {`${this.props.balanceText}: `}
                        {this.props.balance}
                    </span>
                </div>
                <div className="amountInput__amount">
                    <input
                        ref={this.inputRef}
                        placeholder={this.props.placeholder}
                        // value={this.props.InputValue}
                        value={
                            this.props.isDirty
                                ? null
                                : this.props.InputValue === 0
                                  ? ''
                                  : this.props.InputValue
                        }
                        // debounceTimeout={1000}
                        onChange={(event) => {
                            console.log(
                                'event.target.value',
                                event.target.value
                            );
                            this.props.onValueChange(event.target.value);
                        }}
                        className={`amountInput__value ${this.props.validateError ? 'amountInput__feedback--error' : ''}`}
                        type={'number'}
                    />
                    <button
                        className="amountInput__maxButton"
                        onClick={this.props.setAddTotalAvailable}
                    >
                        {/* {t('button.inputMaxValue')} */}
                    </button>
                </div>
            </div>
        );
    }
}
