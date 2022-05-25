import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './shared/navbar';
import Chat from './chat';
import socket from '../websocket';


class Home extends Component {
    loadDataHandler = () => {
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
                this.setState({ loanId: resp.loanId });

                const r = new XMLHttpRequest();
                r.open('GET', `http://localhost:5000/loan/${resp.loanId}`, true);
                r.setRequestHeader('Authorization', `Bearer ${apiKey}`);
                r.setRequestHeader('Content-Type', 'application/json');
                r.send();

                r.onload = () => {
                    if (r.status !== 200) {
                        if ([401, 403, 404, 422].indexOf(r.status) !== -1) { this.setState({redirect: '/logout'}) }
                        const responseMessage = JSON.parse(r.response).message;
                        if (responseMessage) {
                            alert(responseMessage);
                        } else {
                            alert(`Error! Code: ${r.status}; Description: ${r.statusText}`);
                        }
                    } else {
                        const loanData = JSON.parse(r.response);
                        const loanPayments = loanData.payments;
                        const loanAmount = loanData.amount;
                        let lastPayments = [];

                        if (loanPayments.length === 0) {
                            this.setState({ debt: loanAmount });
                        } else {
                            let debt = loanAmount;
                            for (let i = 0; i < loanPayments.length; i += 1) {
                                debt -= loanPayments[i];
                                if (loanPayments.length - i - 1 < 3) {
                                    lastPayments.push({ balance: debt, amountPaid: loanPayments[i]})
                                }
                            }
                            this.setState({ debt: debt, lastPayments: lastPayments.reverse() });
                        }
                    }
                };
                r.onerror = () => { alert('Request failed! Please check your connection.') };
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') };
    }


    payLoanHandler = () => {
        const apiKey = localStorage.getItem('api_key');
        const request = new XMLHttpRequest();
        request.open('POST', `http://localhost:5000/pay/${this.state.loanId}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ amount: parseFloat(this.state.payLoanValue) }));

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
                this.loadDataHandler();
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') }
    }


    getLoanHandler = () => {
        const apiKey = localStorage.getItem('api_key');
        const request = new XMLHttpRequest();
        request.open('PUT', `http://localhost:5000/loan/${this.state.loanId}`, true);
        request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ amount_add: parseFloat(this.state.getLoanValue) }));

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
                this.loadDataHandler();
            }
        };
        request.onerror = () => { alert('Request failed! Please check your connection.') }
    }


    componentDidMount = () => {
        socket.emit('auth', localStorage.getItem('api_key'));
        
        socket.on('message', (message) => {
            let msgs = this.state.messages;
            msgs.push(message);
            this.setState({messages: msgs});
        });

        this.loadDataHandler();
    }


    chatSendMessageHandler = (message) => {
        socket.emit('message', message);
    }


    state = {
        lastPayments: [
            {amountPaid: '---', balance: '---'},
            {amountPaid: '---', balance: '---'},
            {amountPaid: '---', balance: '---'}
        ],
        payLoanValue: 0,
        getLoanValue: 0,
        debt: 0,
        messages: []
    };


    render() {
        const { redirect, debt, lastPayments } = this.state; 
        
        return (
            <React.Fragment>
                <NavBar links={[
                    {text: 'Home', url: '', selected: true},
                    {text: 'Profile', url: '/profile', selected: false},
                    {text: 'Logout', url: '/logout', selected: false}
                ]} />
                <div className="home-block">
                    <div className="home-column">
                        <h2>Statistics</h2>
                        <div>
                            <h3 className="add-left-padding">Credit Debt</h3>
                            <div className="debt-block">
                                <h2>{ debt }</h2>
                                <h4>USD</h4>
                            </div>
                        </div>
                        <div>
                            <h3 className="add-left-padding">Last Payments</h3>
                            <div className="payments-block">
                                <ul>
                                    { lastPayments.map((payment, i) => {
                                        return(
                                        <li key={i}>
                                            <span className="color-green">{payment.amountPaid} USD</span>
                                            <span><b>Unpaid:</b> {payment.balance} USD</span>
                                        </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="home-column">
                        <h2>Quick Actions</h2>
                        <div>
                            <div className="add-special-padding">
                                <h3>Pay a Credit</h3>
                                <input 
                                    onInput={(e) => this.setState({payLoanValue: e.target.value })}
                                    className="input big bg-gray"
                                    type="number"
                                    min="1"
                                    placeholder="Amount"
                                />
                                <br/><br/>
                                <button onClick={ this.payLoanHandler } className="btn big green">Repay</button>
                            </div>
                            <div className="add-special-padding">
                                <h3>Get a Credit</h3>
                                <input 
                                    onInput={(e) => this.setState({getLoanValue: e.target.value })}
                                    className="input big bg-gray"
                                    type="number"
                                    min="1"
                                    placeholder="Amount"
                                />
                                <br/><br/>
                                <button onClick={ this.getLoanHandler } className="btn big blue">Request</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Chat messages={ this.state.messages } sendMessageHandler={ this.chatSendMessageHandler } chatId={ localStorage.getItem('userId') }/>

                { redirect ? <Navigate to={ redirect } /> : '' }
            </React.Fragment>
        );
    }
}
 
export default Home;
