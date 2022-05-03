import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';
import Form from './shared/form';


class Profile extends Component {
    inputChangeHandler = (inputObj, value) => {
        const inputs = [...this.state.inputs];
        const index = inputs.indexOf(inputObj);
        inputs[index].value = value;
        this.setState({inputs});
    }


    componentDidMount = () => {
        if (localStorage.getItem('userId') === null || localStorage.getItem('api_key') === null) {
            this.setState({redirect: '/logout'});
        }

        const apiKey = localStorage.getItem('api_key');
        const userId = localStorage.getItem('userId');

        const request = new XMLHttpRequest();
        request.open('GET', `http://localhost:5000/user/${userId}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
        
        request.onload = () => {
            if (request.status !== 200) {
                if ([401, 403, 404, 422].indexOf(request.status) !== -1) { this.setState({redirect: '/logout'}) }
                const responseMessage = JSON.parse(request.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
                }
            } else {
                const resp = JSON.parse(request.response);
                const inputs = [...this.state.inputs];
                inputs[0].value = resp.firstName;
                inputs[1].value = resp.lastName;
                inputs[2].value = resp.phone;
                this.setState({inputs});
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    userUpdateHandler = (e) => {
        e.preventDefault();
        const { inputs } = this.state;
        const body = { firstName: inputs[0].value, lastName: inputs[1].value };
        const apiKey = localStorage.getItem('api_key');
        const userId = localStorage.getItem('userId');
        
        const request = new XMLHttpRequest();
        request.open('PUT', `http://localhost:5000/user/${userId}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(body));

        request.onload = () => {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) { this.setState({redirect: '/logout'}) }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                alert(responseMessage);
            } else {
                alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }

    
    deleteUserHandler = (e) => {
        e.preventDefault();
        const apiKey = localStorage.getItem('api_key');
        const userId = localStorage.getItem('userId');

        const request = new XMLHttpRequest();
        request.open('DELETE', `http://localhost:5000/user/${userId}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();

        request.onload = () => {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) { this.setState({redirect: '/logout'}) }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                alert(responseMessage);
            } else {
                alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
            if (request.status === 200) { this.setState({redirect: '/logout'}) }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    state = {
        navbarLinks: [
            {text: 'Home', url: '/home', selected: false},
            {text: 'Profile', url: '', selected: true},
            {text: 'Logout', url: '/logout', selected: false}
        ],
        inputs: [
            {type: 'text', name: 'firstName', placeholder: 'First Name', value: '', onInput: this.inputChangeHandler},
            {type: 'text', name: 'lastName', placeholder: 'Last Name', value: '', onInput: this.inputChangeHandler},
            {type: 'text', name: 'phone', placeholder: 'Phone', value: '', onInput: ()=>{}, disabled: true}
        ]
    }; 


    render() { 
        const { navbarLinks, inputs, redirect } = this.state; 

        return (
            <React.Fragment>
                <NavBar links={ navbarLinks } />
                <div className="form-block">
                    <h2>Profile Information</h2>
                    <Form inputs={ inputs } submitHandler={ this.userUpdateHandler } submitBtnText='Update'/>
                    <p className="color-gray" onClick={ this.deleteUserHandler }>Delete Account</p>
                </div>
                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Profile;
