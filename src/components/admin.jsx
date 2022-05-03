import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';
import Form from './shared/form';

class Admin extends Component {
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
    }


    loadUserHandler = (e) => {
        e.preventDefault();
        
        const userIdToChange = this.state.inputs[0].value;
        const apiKey = localStorage.getItem('api_key');
        const request = new XMLHttpRequest();

        request.open('GET', `http://localhost:5000/user/${userIdToChange}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
    
        request.onload = () => {
            if (request.status !== 200) {
                if ([401, 403, 422].indexOf(request.status) !== -1) {
                    this.setState({redirect: '/logout'});
                }
                const responseMessage = JSON.parse(request.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
                }
            } else {
                const resp = JSON.parse(request.response);
                const inputs = [...this.state.inputs];
                inputs[1].value = resp.firstName;
                inputs[2].value = resp.lastName;
                this.setState({inputs: inputs, loanId: resp.loanId});
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    updateUserHandler = (e) => {
        e.preventDefault();
        const { inputs, loanId } = this.state;

        const userIdToChange = inputs[0].value;
        const firstName = inputs[1].value;
        const lastName = inputs[2].value;
        const addMoneyAmount = inputs[3].value;

        if (!userIdToChange) {alert('Please load the user first!'); return;}
        const apiKey = localStorage.getItem('api_key');
    
        const request = new XMLHttpRequest();
        request.open('PUT', `http://localhost:5000/user/${userIdToChange}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ firstName, lastName }));
    
        request.onload = () => {
            if ([401, 403, 422].indexOf(request.status) !== -1) {
                this.setState({redirect: '/logout'});
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                alert(responseMessage);
            } else {
                alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    
        if (addMoneyAmount !== '') {
            const requestPayment = new XMLHttpRequest();
            requestPayment.open('POST', `http://localhost:5000/pay/${loanId}`, true);
            requestPayment.setRequestHeader('Authorization', `Bearer ${apiKey}`);
            requestPayment.setRequestHeader('Content-Type', 'application/json');
            requestPayment.send(JSON.stringify({ amount: parseInt(addMoneyAmount, 10) }));
    
            requestPayment.onload = () => {
                if ([401, 403, 422].indexOf(requestPayment.status) !== -1) {
                    this.setState({redirect: '/logout'});
                }
                const responseMessage = JSON.parse(requestPayment.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${requestPayment.status}; Description: ${requestPayment.statusText}`);
                }
            };
            requestPayment.onerror = () => { alert('Request failed! Please check your connection.') };
        }
    }


    deleteUserHandler = () => {
        const userIdToChange = this.state.inputs[0].value;
        if (!userIdToChange) {alert('Please load the user first!'); return;}
        if (userIdToChange === localStorage.getItem('userId')) { alert('You cannot remove this account.'); return; }
    
        const apiKey = localStorage.getItem('api_key');
    
        const request = new XMLHttpRequest();
        request.open('DELETE', `http://localhost:5000/user/${userIdToChange}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
    
        request.onload = () => {
            if (request.status !== 200) {
                if ([401, 403].indexOf(request.status) !== -1) {
                    this.setState({redirect: '/logout'});
                }
                const responseMessage = JSON.parse(request.response).message;
                if (responseMessage) {
                    alert(responseMessage);
                } else {
                    alert(`Error! Code: ${request.status}; Description: ${request.statusText}`);
                }
            } else {
                alert('Successfully deleted!');
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }



    state = {
        navbarLinks: [
            {text: 'Admin', url: '', selected: true},
            {text: 'Logout', url: '/logout', selected: false}
        ],
        inputs: [
            {type: 'text-no-min', name: 'userId', placeholder: 'User\'s ID', value: '', onInput: this.inputChangeHandler},
            {type: 'text', name: 'firstName', placeholder: 'New First Name', value: '', onInput: this.inputChangeHandler},
            {type: 'text', name: 'lastName', placeholder: 'New Last Name', value: '', onInput: this.inputChangeHandler},
            {type: 'number', name: 'add_money', placeholder: 'Transfer Money to Balance', value: '', required: false, onInput: this.inputChangeHandler}
        ],
        loanId: null,
        redirect: null
    };


    render() { 
        const { navbarLinks, redirect, inputs } = this.state; 

        return (
            <React.Fragment>
                <NavBar links={ navbarLinks } />
                <div className="form-block">
                    <h2>Update User</h2>
                    <Form inputs={ [inputs[0]] } submitHandler={ this.loadUserHandler } submitBtnText='Load' btnColor='green'/>
                    <br/><br/>
                    <Form inputs={ [inputs[1], inputs[2], inputs[3]] } submitHandler={ this.updateUserHandler } submitBtnText='Update'/>
                    <p className="color-gray" onClick={ this.deleteUserHandler }>Delete User's Account</p>
                </div>
                { redirect ? <Navigate to={ redirect } />: '' }
            </React.Fragment>
        );
    }
}

export default Admin;