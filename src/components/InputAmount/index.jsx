import { DebounceInput } from 'react-debounce-input';
import React, { Component } from 'react';

import './style.scss';


export default class InputAmount extends Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.inputRef.current.addEventListener('wheel', this.handleWheel, { passive: false });
        }
    }

    componentWillUnmount() {
        if (this.inputRef.current) {
            this.inputRef.current.removeEventListener('wheel', this.handleWheel);
        }
    }

    handleWheel = event => {
        event.preventDefault();
    };

    render() {


        return (
            <div className="input-amount-container">
                <div className="title-balance-container">
                    <div className="input-title">{this.props.action}</div>
                    <span className="input-balance">
                        {`${this.props.balanceText}: `}
                        {this.props.balance}
                    </span>
                </div>
                <div className="input-field-container">
                    <input
                        ref={this.inputRef}
                        placeholder={this.props.placeholder}
                        // value={this.props.InputValue}
                        value={this.props.isDirty ? null : this.props.InputValue === 0 ? '' : this.props.InputValue}
                        // debounceTimeout={1000}
                        onChange={(event) =>{
                            console.log('event.target.value', event.target.value);
                            this.props.onValueChange(event.target.value)

                        }}
                        className={`input-value ${this.props.validateError ? 'input-value-error' : ''}`}
                        type={'number'}
                    />
                    <button className="max-button" onClick={this.props.setAddTotalAvailable}>
                        MAX
                    </button>
                </div>
            </div>
        );
    }
}
