import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';

class Register extends Component {
    inputChangeHandler = (i, value) => {
        let inputs = [...this.state.inputs];
        inputs[i] = value;
        this.setState({inputs: inputs});
    }
    
    registerHandler = (e) => {
        e.preventDefault();

        const { inputs } = this.state;
        let regValues = {
            'firstName': inputs[0],
            'lastName': inputs[1],
            'phone': inputs[2],
            'password': inputs[3]
        };

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
        inputs: ['', '', '', '']
    };


    render() { 
        const { inputs, redirect } = this.state;

        return (
            <React.Fragment>
                <NavBar links={ [{text: 'Login', url: '/login', selected: false}] }/>
                <div className='form-block'>
                    <h2>Register Now</h2>
                    <form className="custom-form" onSubmit={ this.registerHandler }>
                        <input value={ inputs[0] } onInput={ (e) => this.inputChangeHandler(0, e.target.value) } className="input" type="text" name="firstName" minLength="3" maxLength="32" placeholder="First Name" required/>
                        <input value={ inputs[1] } onInput={ (e) => this.inputChangeHandler(1, e.target.value) } className="input" type="text" name="lastName" minLength="3" maxLength="32" placeholder="Last Name" required/>
                        <input value={ inputs[2] } onInput={ (e) => this.inputChangeHandler(2, e.target.value) } className="input" type="number" name="phone" placeholder="Phone" required/>
                        <input value={ inputs[3] } onInput={ (e) => this.inputChangeHandler(3, e.target.value) } className="input" type="password" name="password" minLength="6" maxLength="32" placeholder="Password" required/>
                        <input className="btn blue" type="submit" value="Register"/>
                    </form>
                </div>
                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Register;