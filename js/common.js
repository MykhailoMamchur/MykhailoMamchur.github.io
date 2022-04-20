/* eslint-disable no-unused-vars */
const SERVER = 'http://127.0.0.1:5000';
let counter = 0;

function showNotification(message, timeout = 5000) {
    const notification = document.createElement('div');
    const text = document.createTextNode(message);

    notification.id = 'NOTIFICATION_SPAWNED';
    notification.onclick = () => { document.body.removeChild(document.querySelector('#NOTIFICATION_SPAWNED')); };
    notification.classList.add('notification');
    notification.appendChild(text);
    document.body.appendChild(notification);

    setTimeout(() => {
        try {
            document.body.removeChild(document.querySelector('#NOTIFICATION_SPAWNED'));
        } catch (e) { counter += 1; }
    }, timeout);
}

function logout(sendToIndex = true) {
    const apiKey = localStorage.getItem('api_key');

    const request = new XMLHttpRequest();
    request.open('GET', `${SERVER}/user/logout`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.send();

    request.onload = () => {
        if (request.status !== 200) {
            if ([401, 403, 404].indexOf(request.status) !== -1) {
                window.location = 'login.html';
            }
            const responseMessage = JSON.parse(request.response).message;
            if (responseMessage) {
                showNotification(responseMessage);
            } else {
                showNotification(`Error! Code: ${request.status}; Description: ${request.statusText}`);
            }
        } else {
            localStorage.clear();
            if (sendToIndex) { window.location = 'index.html'; }
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

try {
    document.querySelector('#logout_btn').addEventListener('click', logout);
} catch (e) { counter += 1; }
