/* global showNotification SERVER:true */
/* eslint no-undef: "error" */

let LOAN_ID;

function updateHomeScreen(loanAmount, loanPayments) {
    const paymentsLi = document.querySelectorAll('#payments > li');
    const debtOutput = document.querySelector('#debt_amount');

    if (loanPayments.length === 0) {
        debtOutput.innerHTML = loanAmount;
    } else {
        let debt = loanAmount;

        for (let i = 0; i < loanPayments.length; i += 1) {
            debt -= loanPayments[i];

            if (loanPayments.length - i - 1 < 3) {
                const paymentsSpans = paymentsLi[loanPayments.length - i - 1].querySelectorAll('span');
                paymentsSpans[0].innerHTML = `+${loanPayments[i]} USD`;
                paymentsSpans[1].innerHTML = `<b>Unpaid:</b> ${debt} USD`;
            }
        }
        debtOutput.innerHTML = debt;
    }
}

function reloadLoans(loanId) {
    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('GET', `${SERVER}/loan/${loanId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            const loanData = JSON.parse(request.response);
            updateHomeScreen(loanData.amount, loanData.payments);
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

function reloadUser() {
    const apiKey = localStorage.getItem('api_key');
    const userId = localStorage.getItem('userId');

    const request = new XMLHttpRequest();
    request.open('GET', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
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
            LOAN_ID = resp.loanId;
            reloadLoans(resp.loanId);
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

function payCredit() {
    const inputEl = document.querySelector('#payCredit_block > input');

    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('POST', `${SERVER}/pay/${LOAN_ID}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ amount: parseFloat(inputEl.value) }));

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            inputEl.value = '';
            reloadUser();
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

function getCredit() {
    const inputEl = document.querySelector('#getCredit_block > input');

    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('PUT', `${SERVER}/loan/${LOAN_ID}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ amount_add: parseFloat(inputEl.value) }));

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            inputEl.value = '';
            reloadUser();
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

reloadUser();

const payCreditBtn = document.querySelector('#payCredit_block > button');
payCreditBtn.addEventListener('click', payCredit);

const getCreditBtn = document.querySelector('#getCredit_block > button');
getCreditBtn.addEventListener('click', getCredit);
