/* global showNotification SERVER:true */
/* eslint no-undef: "error" */
let LOAN_ID;

function loadUser() {
    const userId = document.querySelector('#load_user_block > input').value;
    const parentDOMInsert = document.querySelector('#user_info_block');

    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('GET', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 422].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            const resp = JSON.parse(request.response);
            parentDOMInsert[0].value = resp.firstName;
            parentDOMInsert[1].value = resp.lastName;
            LOAN_ID = resp.loanId;
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

document.querySelector('#load_user_block > button').addEventListener('click', loadUser);

function updateUser() {
    const userId = document.querySelector('#load_user_block > input').value;
    const apiKey = localStorage.getItem('api_key');

    const inputs = document.querySelectorAll('#user_info_block > input');
    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const addMoneyAmount = inputs[2].value;

    const request = new XMLHttpRequest();
    request.open('PUT', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ firstName, lastName }));

    request.onload = () => {
        if ([401, 403, 422].indexOf(request.status) !== -1) {
            window.location = 'login.html';
        }
        const responseMessage = JSON.parse(request.response).message;
        if (responseMessage) {
            showNotification(responseMessage);
        } else {
            showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
        }
    };
    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };

    if (addMoneyAmount !== '') {
        const requestPayment = new XMLHttpRequest();
        requestPayment.open('POST', `${SERVER}/pay/${LOAN_ID}`, true);
        requestPayment.setRequestHeader('Authorization', `Bearer ${apiKey}`);
        requestPayment.setRequestHeader('Content-Type', 'application/json');
        requestPayment.send(JSON.stringify({ amount: parseInt(addMoneyAmount, 10) }));

        requestPayment.onload = () => {
            if ([401, 403, 422].indexOf(requestPayment.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(requestPayment.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${requestPayment.status}; Description: ${requestPayment.statusText}`);
            }
        };
        requestPayment.onerror = () => {
            showNotification('Request failed! Please check your connection.');
        };
    }
}

document.querySelector('#user_info_block>input[type=button]').addEventListener('click', updateUser);

function deleteUser() {
    const userId = document.querySelector('#load_user_block > input').value;
    if (userId === localStorage.getItem('userId')) {
        showNotification('You cannot remove this account.');
        return;
    }

    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('DELETE', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            window.location = 'register.html';
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

document.querySelector('#user_delete_btn').addEventListener('click', deleteUser);
