/* global showNotification logout SERVER:true */
/* eslint no-undef: "error" */

function userRegister(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const regValues = Object.fromEntries(data.entries());

    if (regValues.password !== regValues.cpassword) {
        showNotification('Passwords should match!');
        return;
    }

    delete regValues.cpassword;

    const request = new XMLHttpRequest();
    request.open('POST', `${SERVER}/user`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.send(JSON.stringify(regValues));
    request.onload = () => {
        if (request.status !== 201) {
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            window.location = 'login.html';
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

const regForm = document.querySelector('#register_form');
regForm.addEventListener('submit', userRegister);

if ('userId' in localStorage) {
    logout(false);
}
