function creditCost() {
    const amount = document.querySelector('#credit_cost_block > input').value;
    document.querySelectorAll('#credit_cost_block > input')[1].value = amount * 1.01;
}

const t = document.querySelector('#credit_cost_block > button');
t.addEventListener('click', creditCost);
