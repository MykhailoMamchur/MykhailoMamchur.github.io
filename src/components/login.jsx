import React, { Component } from 'react';
import NavBar from './shared/navbar';
import Form from './shared/form';
import { Navigate } from 'react-router-dom';

class Login extends Component {
    inputChangeHandler = (inputObj, value) => {
        const inputs = [...this.state.inputs];
        const index = inputs.indexOf(inputObj);
        inputs[index] = {...this.state.inputs[index]};

        inputs[index].value = value;
        this.setState({inputs});
    }

    loginHandler = (e) => {
        e.preventDefault();

        let loginValues = {};
        this.state.inputs.map(input => (
            loginValues[input.name] = input.value
        ));
    
        const request = new XMLHttpRequest();
        const auth = btoa(`${loginValues.phone}:${loginValues.password}`);

        request.open('GET', 'http://localhost:5000/user/login', true);
        request.setRequestHeader('Authorization', `Basic ${auth}`);
        request.send();
        request.onload = () => {
            if (request.status !== 200) {
                const responseMessage = JSON.parse(request.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
                }
            } else {
                const resp = JSON.parse(request.response);
                localStorage.setItem('api_key', resp.api_key);
                localStorage.setItem('userId', resp.userId);
                resp.isAdmin ? this.setState({redirect: '/admin'}) : this.setState({redirect: '/home'});
            }
        };
    
        request.onerror = () => {
            alert('Request failed! Please check your connection.');
        };
    }


    state = {
        navbarLinks: [
            {text: 'Register', url: '/register', selected: false}
        ],
        inputs: [
            {type: 'text', name: 'phone', placeholder: 'Phone', value: '', onInput: this.inputChangeHandler},
            {type: 'password', name: 'password', placeholder: 'Password', value: '', onInput: this.inputChangeHandler}
        ],
        redirect: null
    }; 

    render() { 
        const { inputs, navbarLinks, redirect } = this.state;
        return (
            <React.Fragment>
                <NavBar links={ navbarLinks } />
                <div className="form-block">
                    <h2>Please Login</h2>
                    <Form inputs={ inputs } submitHandler={ this.loginHandler } submitBtnText='Login'/>
                </div>
                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Login;