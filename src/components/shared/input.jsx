import React, { Component } from 'react';

class Input extends Component {
    render() { 
        const { type, name, placeholder, value, onInput, required, disabled } = this.props.params;

        function parseInput(value) {
            return value.replace(/[^A-Za-z-0-9\s]/g,'');
        }

        return (
            <input 
                className="input"
                maxLength="32"
                required={ required === false ? false : true }
                type={ type === 'text-no-min' ? 'text' : type }
                minLength={ type === 'text-no-min' ? '0' : (type === 'password' ? '6' : '3') }
                placeholder={ placeholder }
                disabled={ disabled === true ? true: false}

                name={name}
                value={value}
                onInput={(e) => onInput(this.props.params, parseInput(e.target.value))}
            />
        );
    }
}
 
export default Input;