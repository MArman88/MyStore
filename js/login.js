const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const passwordConfirmInput = document.getElementById('passwordConfirmInput');
const btnLogin = document.getElementById('btnLogin');

const toastBody = document.getElementById('toastBody');
const toastDiv = document.getElementById('toastDiv');

btnLogin.addEventListener('click', () => {
    let email = emailInput.value;
    let password = passwordInput.value;
    let passwordConfirm = passwordConfirmInput.value;


    if (password == passwordConfirm) {
        if (isReadyForLogin(email, password)) {
            window.location.href = './index.html'
        } else {
            passwordConfirmInput.value = '';
            passwordInput.value = '';
            toastBody.innerText = "Email/Password is invalid";
            new bootstrap.Toast(toastDiv).show();
        }
    } else {
        passwordConfirmInput.value = '';
        passwordInput.value = '';
        toastBody.innerText = "Passwords didn't match. Try again";
        new bootstrap.Toast(toastDiv).show();
    }

});

function checkLoginStatus() {
    let userInfo = getUserInformation();
    if (userInfo != undefined) {
        window.location.href = "./index.html";
    }
}

checkLoginStatus();