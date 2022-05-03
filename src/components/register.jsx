import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';
import Form from './shared/form';

class Register extends Component {
    inputChangeHandler = (inputObj, value) => {
        const inputs = [...this.state.inputs];
        const index = inputs.indexOf(inputObj);
        inputs[index].value = value;
        this.setState({inputs});
    }
    
    registerHandler = (e) => {
        e.preventDefault();

        let regValues = {};
        this.state.inputs.map(input => {
            regValues[input.name] = input.value;
        });

        const request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:5000/user', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.send(JSON.stringify(regValues));
        request.onload = () => {
            if (request.status !== 201) {
                const responseMessage = JSON.parse(request.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
                }
            } else {
                this.setState({ redirect: '/login' });
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    state = { 
        navbarLinks: [
            {text: 'Login', url: '/login', selected: false}
        ],
        inputs: [
            {type: 'text', name: 'firstName', placeholder: 'First Name', value: '', onInput: this.inputChangeHandler},
            {type: 'text', name: 'lastName', placeholder: 'Last Name', value: '', onInput: this.inputChangeHandler},
            {type: 'number', name: 'phone', placeholder: 'Phone', value: '', onInput: this.inputChangeHandler},
            {type: 'password', name: 'password', placeholder: 'Password', value: '', onInput: this.inputChangeHandler}
        ]
    };


    render() { 
        const { navbarLinks, inputs, redirect } = this.state;
        return (
            <React.Fragment>
                <NavBar links={ navbarLinks }/>
                <div className='form-block'>
                    <h2>Register Now</h2>
                    <Form inputs={ inputs } submitHandler={ this.registerHandler } submitBtnText='Register'/>
                </div>
                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Register;