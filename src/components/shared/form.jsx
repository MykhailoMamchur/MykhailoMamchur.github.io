import React, { Component } from 'react';
import Input from './input';

class Form extends Component {
    render() { 
        const { inputs, submitHandler, submitBtnText, btnColor } = this.props;

        return (
            <form className="custom-form" onSubmit={ submitHandler }>
                { inputs.map((params, i) => { 
                    return(<Input key={i} params={params}/>)
                }) }
                <br/><br/>
                <input
                    className={typeof(btnColor) !== 'undefined' ? 'btn ' + btnColor : 'btn blue'}
                    type="submit"
                    value={ submitBtnText }
                />
            </form>
        );
    }
}
 
export default Form;