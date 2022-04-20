/* global showNotification logout SERVER:true */
/* eslint no-undef: "error" */

function userLogin(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const loginValues = Object.fromEntries(data.entries());

    const request = new XMLHttpRequest();
    request.open('GET', `${SERVER}/user/login`, true);

    const auth = btoa(`${loginValues.phone}:${loginValues.password}`);
    request.setRequestHeader('Authorization', `Basic ${auth}`);

    request.send();
    request.onload = () => {
        if (request.status !== 200) {
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            const resp = JSON.parse(request.response);
            localStorage.setItem('api_key', resp.api_key);
            localStorage.setItem('userId', resp.userId);
            if (resp.isAdmin) { window.location = 'admin.html'; } else { window.location = 'home.html'; }
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

const loginForm = document.querySelector('#login_form');
loginForm.addEventListener('submit', userLogin);

if ('userId' in localStorage) {
    logout(false);
}
