/* global showNotification SERVER:true */
/* eslint no-undef: "error" */

function deleteUser() {
    const apiKey = localStorage.getItem('api_key');
    const userId = localStorage.getItem('userId');

    const request = new XMLHttpRequest();
    request.open('DELETE', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();

    request.onload = () => {
        if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
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
}

document.querySelector('#user_delete_btn').addEventListener('click', deleteUser);

function changeUserInfo() {
    const userInfoBlock = document.querySelectorAll('#user_info_block > input');

    const apiKey = localStorage.getItem('api_key');
    const userId = localStorage.getItem('userId');

    const body = { firstName: userInfoBlock[0].value, lastName: userInfoBlock[1].value };

    const request = new XMLHttpRequest();
    request.open('PUT', `${SERVER}/user/${userId}`, true);
    request.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(body));

    request.onload = () => {
        if ([401, 403, 404, 422].indexOf(request.status) !== -1) {
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
}

document.querySelector('#user_info_block > input[type=button]').addEventListener('click', changeUserInfo);

function displayUserInfo(data) {
    const userInfoBlock = document.querySelectorAll('#user_info_block > input');

    userInfoBlock[0].value = data.firstName;
    userInfoBlock[1].value = data.lastName;
    userInfoBlock[2].value = data.phone;
}

function loadUserInfo() {
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
            displayUserInfo(resp);
        }
    };

    request.onerror = () => {
        showNotification('Request failed! Please check your connection.');
    };
}

loadUserInfo();
