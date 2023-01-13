import { DebounceInput } from 'react-debounce-input';
import React, { Component } from 'react';


export default class InputAmount extends Component {

    handleValueChange(newAmount) {
        this.props.onValueChange(newAmount);
    }

    render() {
        return (
            <div>
                <DebounceInput
                    placeholder={this.props.placeholder}
                    value={this.props.InputValue}
                    debounceTimeout={1000}
                    onChange={event => this.handleValueChange(event.target.value)}
                    className={`input-value ${this.props.validateError ? 'input-value-error' : ''}`}
                    type={"number"}
                />
            </div>
        );
    }

}