const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const passwordConfirmInput = document.getElementById('passwordConfirmInput');
const btnLogin = document.getElementById('btnLogin');

const toastBody = document.getElementById('toastBody');
const toastDiv = document.getElementById('toastDiv');

function isPasswordMatch() {
    let isPasswordGiven = (passwordInput.value || '').length > 0
    let passwordMatch = passwordInput.value == passwordConfirmInput.value;
    passwordInput.classList.remove('is-invalid')
    if (!isPasswordGiven) {
        passwordInput.classList.add('is-invalid')
    }
    passwordConfirmInput.classList.remove('is-invalid');
    if (!passwordMatch) {
        passwordConfirmInput.classList.add('is-invalid');
    }
}

function isEmailValid() {
    let email = emailInput.value || '';
    emailInput.classList.remove('is-invalid');
    const dotPosition = email.indexOf('.');
    const atPosition = email.indexOf('@');
    let isValidEmail = email.length > 0 && atPosition != -1 && dotPosition != -1 && atPosition < dotPosition && (dotPosition + 1) < email.length;
    if (!isValidEmail) {
        emailInput.classList.add('is-invalid');
    }
}

passwordConfirmInput.addEventListener('focus', isPasswordMatch);
passwordInput.addEventListener('focus', isPasswordMatch);

passwordInput.addEventListener('keyup', isPasswordMatch);
passwordConfirmInput.addEventListener('keyup', isPasswordMatch);

emailInput.addEventListener('focus', isEmailValid);
emailInput.addEventListener('keyup', isEmailValid);


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