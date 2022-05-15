import React, { Component } from 'react';
import NavBar from './shared/navbar';
import { Navigate } from 'react-router-dom';

class Login extends Component {
    inputChangeHandler = (i, value) => {
        let inputs = [...this.state.inputs];
        inputs[i] = value;
        this.setState({inputs: inputs});
    }

    loginHandler = (e) => {
        e.preventDefault();
    
        const phone = this.state.inputs[0];
        const password = this.state.inputs[1];

        const request = new XMLHttpRequest();
        const auth = btoa(`${phone}:${password}`);

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
        inputs: ['', '']
    }; 

    render() { 
        const { inputs, redirect } = this.state;

        return (
            <React.Fragment>
                <NavBar links={ [{text: 'Register', url: '/register', selected: false}] } />
                <div className="form-block">
                    <h2>Please Login</h2>
                    <form className="custom-form" onSubmit={ this.loginHandler }>
                        <input value={ inputs[0] } onInput={ (e) => this.inputChangeHandler(0, e.target.value) } className="input" type="number" name="phone" placeholder="Phone" required/>
                        <input value={ inputs[1] } onInput={ (e) => this.inputChangeHandler(1, e.target.value) } className="input" type="password" name="password" minLength="6" maxLength="32" placeholder="Password" required/><br/><br/>
                        <input className="btn blue" type="submit" value="Login"/>
                </form>
                </div>
                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Login;