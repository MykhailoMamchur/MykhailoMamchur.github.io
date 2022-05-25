import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';
import socket from '../websocket';
import Chat from './chat';

class Admin extends Component {
    inputChangeHandler = (i, value) => {
        let inputs = [...this.state.inputs];
        inputs[i] = value;
        this.setState({inputs: inputs});
    }


    componentDidMount = () => {
        if (localStorage.getItem('userId') === null || localStorage.getItem('api_key') === null) {
            this.setState({redirect: '/logout'});
        }
        this.chatAuthHandler();
    }


    loadUserHandler = (e) => {
        e.preventDefault();
        
        const userIdToChange = this.state.inputs[0];
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
                inputs[1] = resp.firstName;
                inputs[2] = resp.lastName;
                this.setState({inputs: inputs, loanId: resp.loanId});

                this.joinChatHandler(parseInt(userIdToChange));
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    updateUserHandler = (e) => {
        e.preventDefault();
        const { inputs, loanId } = this.state;

        const userIdToChange = inputs[0];
        const firstName = inputs[1];
        const lastName = inputs[2];
        const addMoneyAmount = inputs[3];

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
        const userIdToChange = this.state.inputs[0];
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


    chatAuthHandler = () => {
        socket.emit('auth', localStorage.getItem('api_key'));
        
        socket.on('message', (message) => {
            let msgs = this.state.messages;
            msgs.push(message);
            this.setState({messages: msgs});
        });
    }

    chatSendMessageHandler = (message) => {
        if (this.state.inputs[0] === ''){alert('Please load a user to chat with!'); return;}
        socket.emit('message', message, parseInt(this.state.inputs[0]));
    }


    joinChatHandler = (userId) => {
        this.setState({messages: []});
        socket.emit('joinChat', userId);
    }


    state = {
        inputs: ['', '', '', ''],
        loanId: null,
        messages: []
    };


    render() { 
        const { redirect, inputs } = this.state; 

        return (
            <React.Fragment>
                <NavBar links={[
                    {text: 'Admin', url: '', selected: true},
                    {text: 'Logout', url: '/logout', selected: false}
                ]} />
                <div className="form-block">
                    <h2>Update User</h2>
                    <input value={ inputs[0] } onInput={ (e) => this.inputChangeHandler(0, e.target.value) } className="input" type="text" placeholder="User's ID"/><br/><br/>
                    <button onClick={ this.loadUserHandler } className="btn green">Load</button>
                    <br/><br/><br/>
                    <form className="custom-form" onSubmit={ this.updateUserHandler }>
                        <input value={ inputs[1] } onInput={ (e) => this.inputChangeHandler(1, e.target.value) } className="input" type="text" name="firstName" placeholder="New First Name"/><br/>
                        <input value={ inputs[2] } onInput={ (e) => this.inputChangeHandler(2, e.target.value) } className="input" type="text" name="lastName" placeholder="New Last Name"/><br/>
                        <input value={ inputs[3] } onInput={ (e) => this.inputChangeHandler(3, e.target.value) } className="input" type="number" name="add_money" placeholder="Transfer Money to Balance"/><br/><br/>
                        <input className="btn blue" type="submit" value="Update"/>
                    </form>
                    <p className="color-gray" onClick={ this.deleteUserHandler }>Delete User's Account</p>
                </div>
                <Chat messages={ this.state.messages } sendMessageHandler={ this.chatSendMessageHandler } chatId={ this.state.inputs[0] }/>
                { redirect ? <Navigate to={ redirect } />: '' }
            </React.Fragment>
        );
    }
}

export default Admin;