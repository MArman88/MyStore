
//#region ----UI layer
const subtotal = document.getElementById('subtotal');
const noItem = document.getElementById('no-item');
const btnPlaceOrder = document.getElementById('btnOrder');
btnPlaceOrder.addEventListener('click', () => {
    window.location.href = './thank-you.html';
});


const sectionGrocery = document.getElementById('food-grocery');
const divGrocery = document.getElementById('container-grocery');

const sectionPersonal = document.getElementById('personal-care');
const divPersonal = document.getElementById('container-personal');

const sectionMakeup = document.getElementById('make-up-items');
const divMakeup = document.getElementById('container-makeup-items');

const cartContainer = document.getElementById('cart-container');
const userLabel = document.getElementById('userLabel');
const logoutButton = document.getElementById('btnLogout');
logoutButton.addEventListener('click', () => {
    let userInfo = getUserInformation();
    if (userInfo != undefined) {
        clearUserInformation();
    }
    window.location.href = "./login.html";
});

function setUI() {

    let userInfo = getUserInformation();
    if (userInfo != undefined) {
        userLabel.style.display = 'inline';
        logoutButton.innerText = "LOGOUT";
        userLabel.innerHTML = `<strong>${userInfo.name}</strong>`;
    } else {
        userLabel.style.display = 'none';
        userLabel.innerHTML = '';
        logoutButton.innerText = "LOGIN";
    }
    setupCards();
    setupCartItems();
}

function setupCards() {
    for (product of products) {
        let card = generateCardForProduct(product)
        if (product.type == TYPE_FOOD_GROCERY) {
            divGrocery.appendChild(card);
        } else if (product.type == TYPE_MAKE_UP_ITEMS) {
            divMakeup.appendChild(card)
        } else {
            divPersonal.appendChild(card);
        }

    }

    clearSelectedItem();
}

function generateCardForProduct(product) {
    let div = document.createElement('div');
    div.classList.add('card', 'shadow-sm', 'p-1', 'm-2', 'bg-white', 'rounded');
    div.style.width = '260px';

    let img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = product.img;
    img.classList.add('w-100', 'ratio', 'ratio-4x3')

    div.appendChild(img);

    let divcardbody = document.createElement('div');
    divcardbody.classList.add('card-body');

    // let h5 = document.createElement('h5');
    // h5.classList.add('card-title');
    // h5.innerText = product.name;
    let label = document.createElement('label');
    label.classList.add('card-title', 'fw-bold');
    label.innerText = product.name;


    let p = document.createElement('p');
    p.classList.add('card-text');
    p.innerText = 'BDT ' + product.price;

    divcardbody.appendChild(label);
    divcardbody.appendChild(p);

    let action = document.createElement('div');
    action.id = `action-${product.id}`

    setupButtonsInActionSection(product, action);

    divcardbody.appendChild(action);
    div.appendChild(divcardbody);
    return div;
}

function clearAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function setupButtonsInActionSection(product, action) {
    clearAllChildren(action);

    let btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-primary', 'w-100');
    btn.innerText = 'ADD TO CART';

    let numberStepper = generateNumberStepper(product, (input) => {
        //add callback
        let quantity = parseInt(input.value);
        if (quantity == NaN) {
            quantity = 0;
        }
        let entry = addOrRemoveItem(product, quantity, ACTION_ADD);
        if (entry == null) {
            hideNumberStepper();
            clearCartItem(product);
        } else {
            showNumberStepper();
            input.value = entry.quantity;
            updateCart(entry);
        }
    }, (input) => {
        //subtract callback
        let quantity = parseInt(input.value);
        if (quantity == NaN) {
            quantity = 0;
        }
        let entry = addOrRemoveItem(product, quantity, ACTION_DEL);
        if (entry == null) {
            hideNumberStepper();
            clearCartItem(product);
        } else {
            showNumberStepper();
            input.value = entry.quantity;
            updateCart(entry);
        }
    });

    numberStepper.classList.add('w-100', 'd-none');

    action.appendChild(btn);
    action.appendChild(numberStepper);

    let hideNumberStepper = () => {
        numberStepper.classList.remove('d-block');
        btn.classList.remove('d-none');
        numberStepper.classList.add('d-none');
        btn.classList.add('d-block');
    };

    let showNumberStepper = () => {
        numberStepper.classList.remove('d-none');
        btn.classList.remove('d-block');
        numberStepper.classList.add('d-block');
        btn.classList.add('d-none');
    };

    btn.addEventListener('click', () => {
        if (getUserInformation() != undefined) {
            let cartEntry = addOrRemoveItem(product, 1, ACTION_ADD);
            showNumberStepper();
            addCartItems(cartEntry)
        } else {
            hideNumberStepper();
            putSelectedItem(product.id);
            window.location.href = './login.html';
        }
    });

    let selectedItem = getSelectedItem();
    if (getUserInformation() == undefined) {
        hideNumberStepper();
    } else {
        let cartEntry = findProductInCart(product);
        if (cartEntry != null) {
            showNumberStepper();
            let input = document.getElementById(`quantity-${cartEntry.product.id}`);
            if (input != undefined) {
                input.value = cartEntry.quantity;
            }

        } else if (product.id == selectedItem) {
            let cartEntry = addOrRemoveItem(product, 1, ACTION_ADD);
            showNumberStepper();
            let input = document.getElementById(`quantity-${cartEntry.product.id}`);
            if (input != undefined) {
                input.value = cartEntry.quantity;
            }
        } else {
            hideNumberStepper();
        }

    }
}

function generateNumberStepper(product, addCallback, subtractCallback) {
    let div = document.createElement("div");
    div.classList.add('input-group', 'text-center');

    let quantity = document.createElement('input');
    quantity.setAttribute('type', 'number');
    quantity.name = 'quantity';
    quantity.classList.add('input-number', 'border-1', 'rounded', 'mx-2', 'text-center');
    quantity.style.width = '64px';
    quantity.style.height = '48px'
    quantity.value = 1;
    quantity.disabled = true;
    quantity.id = `quantity-${product.id}`;

    let buttonSub = generateButton('minus', 'quantity');

    let buttonAdd = generateButton('plus', 'quantity');

    div.appendChild(buttonSub);
    div.appendChild(quantity);
    div.appendChild(buttonAdd);

    buttonSub.addEventListener('click', () => {
        subtractCallback(quantity);
    })

    buttonAdd.addEventListener('click', () => {
        addCallback(quantity);
    })

    return div;
}

function generateButton(dataType, dataField) {
    let span = document.createElement('span');
    span.classList.add('input-group-btn');

    let button = document.createElement("button");
    button.setAttribute('type', 'button');
    button.setAttribute('data-type', dataType);
    button.setAttribute('data-field', dataField);
    let icon = document.createElement('span');

    if (dataType == 'minus') {
        button.classList.add('btn', 'btn-danger', 'btn-number', 'shadow-none');
        icon.classList.add('fa-solid', 'fa-minus');
    } else {
        button.classList.add('btn', 'btn-success', 'btn-number', 'shadow-none');
        icon.classList.add('fa-solid', 'fa-plus');
    }

    button.appendChild(icon);
    span.appendChild(button);

    return span;
}

//#endregion


function clearCartItem(product) {
    let item = document.getElementById(`cart-container-${product.id}`);
    if (item) {
        item.remove();
    }

    if (cartContainer.children.length > 0) {
        btnPlaceOrder.classList.remove('d-none');
        btnPlaceOrder.classList.add('d-inline');
        noItem.classList.remove('d-block');
        noItem.classList.add('d-none');
    } else {
        btnPlaceOrder.classList.remove('d-inline');
        btnPlaceOrder.classList.add('d-none');
        noItem.classList.remove('d-none');
        noItem.classList.add('d-block');
    }
    subtotal.innerText = getsubtotal();
}

function updateCart(cart) {
    let divPrd = document.getElementById(`cart-${cart.product.id}`);
    let divTotal = document.getElementById(`cart-total-${cart.product.id}`);

    divPrd.innerHTML = `<b>${cart.product.name}</b><br><i>${cart.quantity}x${cart.product.price}</i>`;
    divTotal.innerHTML = `<b>BDT ${cart.price}</b>`

    subtotal.innerText = getsubtotal();
}

function makeCartTable(cart) {
    let div = document.createElement('div');
    div.id = `cart-container-${cart.product.id}`;
    div.classList.add('shadow-sm', 'p-2', 'rounded', 'd-flex', 'align-items-center');

    let divPrd = document.createElement('div');
    divPrd.classList.add('w-100');
    divPrd.id = `cart-${cart.product.id}`
    divPrd.innerHTML = `<b>${cart.product.name}</b><br><i>${cart.quantity}x${cart.product.price}</i>`

    let divTotal = document.createElement('div');
    divTotal.id = `cart-total-${cart.product.id}`
    divTotal.classList.add('px-2', 'flex-shrink-0');
    divTotal.innerHTML = `<b>BDT ${cart.price}</b>`

    let divDelete = document.createElement('div');
    divDelete.classList.add('px-2');
    divDelete.innerHTML = `<i class="fa-sharp fa-solid fa-trash" style="color: #c62a2a;"></i>`


    divDelete.addEventListener('click', () => {
        addOrRemoveItem(cart.product, 0, ACTION_SET);
        div.remove();
        const action = document.getElementById(`action-${cart.product.id}`);
        if (action) {
            setupButtonsInActionSection(cart.product, action);
        }

        subtotal.innerText = getsubtotal();
    });
    div.appendChild(divPrd);
    div.appendChild(divTotal);
    div.appendChild(divDelete);

    return div;
}

function addCartItems(cart) {
    if (cartContainer.children.length < 1) {
        btnPlaceOrder.classList.remove('d-none');
        btnPlaceOrder.classList.add('d-inline');
        noItem.classList.remove('d-block');
        noItem.classList.add('d-none');
    }
    let cartItem = makeCartTable(cart);
    cartContainer.appendChild(cartItem);

    subtotal.innerText = getsubtotal();
}

function setupCartItems() {

    for (entry of cart) {
        addCartItems(entry)
    }
}

setUI();