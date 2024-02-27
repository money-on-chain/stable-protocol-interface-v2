import { DebounceInput } from 'react-debounce-input';
import React, { Component } from 'react';
import './style.scss';

export default class InputAmount extends Component {

    handleValueChange(newAmount) {
        if (newAmount.length === 0) {
            this.props.onValueChange(0);
            return;
        }
        const isNumeric = !isNaN(parseFloat(newAmount)) && isFinite(newAmount);
        if (isNumeric) {
            this.props.onValueChange(newAmount);
        }
    }
    render() {
        return (
            <div className="input-amount-container">
                <div className="title-balance-container">
                    <div className="input-title">{this.props.action}</div>
                    <span className="input-balance">
                        Balance:{' '}
                        {this.props.balance}
                    </span>
                </div>
                <div className="input-field-container">
                    <DebounceInput
                        placeholder={this.props.placeholder}
                        value={this.props.isDirty ? null : this.props.InputValue === 0 ? '' : this.props.InputValue}
                        debounceTimeout={1000}
                        onChange={(event) => this.handleValueChange(event.target.value)}
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
