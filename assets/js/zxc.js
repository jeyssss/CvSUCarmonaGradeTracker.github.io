let signupShowCheckbox = document.getElementById('showpassword')
let passwordInput = document.getElementById('password')
let confirmPassword = document.getElementById('confirm-password')

let forgotPassCheckBox = document.getElementById('forgot-show-password')
let forgotInput = document.getElementById('forgot-password')
let confirmForgot = document.getElementById('confirm-forgot')

let popup = document.getElementById("popup");
let popin = document.getElementById("popin");
let forgotpop = document.getElementById("popf")

let professorCheckbox = document.getElementById('professor')
let studentCheckBox = document.getElementById('student')
let studNumberLabel = document.getElementById('stud')

const fnameInput = document.getElementById('fname');
const lnameInput = document.getElementById('lname');

professorCheckbox.addEventListener('change', updateStudentNumberLabel)
studentCheckBox.addEventListener('change', updateStudentNumberLabel)

function updateStudentNumberLabel(){
    if (professorCheckbox.checked){
        studNumberLabel.textContent = "License Number"
    }else{
        studNumberLabel.textContent = "Student Number"
    }
}

//Show password function for signup
signupShowCheckbox.onclick = function(){
    let passwordType = this.checked ? "text" : "password"
    passwordInput.type = passwordType
    confirmPassword.type = passwordType
}

// Show password function for signin
document.getElementById('signin-showpassword').onclick = function(){
    if (this.checked){
        document.getElementById('signin-password').type = "text"
    } else{
        document.getElementById('signin-password').type = "password"
    }
};

//Show password function for forgot password
forgotPassCheckBox.onclick = function(){
    let passwordType = this.checked ? "text" : "password"
    forgotInput.type = passwordType
    confirmForgot.type = passwordType
}

//Signin Toggle Function Starting Point
function toggleSignin(){
    if(popin.classList.contains("open-popin")){
        closePopin()
    }else{
        closePopup()
        openPopin()
    }
}

function openPopin(){
    popin.classList.add("open-popin")
    closePopf()
}

function closePopin(){
    popin.classList.remove("open-popin")
}

//Signup Toggle Function Starting Point
function toggleSignup(){
    if (popup.classList.contains("open-popup")){
        closePopup()
    }else{
        closePopin()
        openPopup()
        closePopf();
    }
}

function openPopup(){
    popup.classList.add("open-popup");
}

function closePopup(){
    popup.classList.remove("open-popup");

}


//Forgot Password Function Starting Point
function togglePopf(){
    if(forgotpop.classList.contains("open-pop-forgot")){
        closePopf()
    }else{
        closePopin()
        closePopup()
        openPopf()
    }
}

function openPopf(){
    forgotpop.classList.add("open-pop-forgot")
}

function closePopf(){
    forgotpop.classList.remove("open-pop-forgot")
}

//To let the program accept only 9 numbers
document.addEventListener("DOMContentLoaded", function() {
    let studnumberInput = document.getElementById("studnumber");

    studnumberInput.addEventListener("input", function() {
        let sanitizedValue = studnumberInput.value.replace(/[^0-9]/g, '').slice(0, 9);
        studnumberInput.value = sanitizedValue;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let forgotNumberInput = document.getElementById("forgot-number");

    forgotNumberInput.addEventListener("input", function() {
        let inputText = forgotNumberInput.value;

        if (inputText.length > 9) {
            forgotNumberInput.value = inputText.slice(0, 9);
        }
    });
});

//Error message if password and confirm password does not match
document.addEventListener("DOMContentLoaded", function() {
    let passwordInput = document.getElementById("password");
    let confirmInput = document.getElementById("confirm-password");
    let passwordError = document.getElementById("password-error");
    let confirmPasswordError = document.getElementById("confirm-password-error");

    function checkPasswordMatch() {
        let password = passwordInput.value;
        let confirm = confirmInput.value;

        if (password === confirm) {
            passwordError.textContent = "";
            confirmPasswordError.textContent = "";
        } else {
            confirmPasswordError.textContent = "Passwords do not match";
        }
    }

    passwordInput.addEventListener("input", checkPasswordMatch);
    confirmInput.addEventListener("input", checkPasswordMatch);
});

//Function to not accept when the length of student/license number is less than 9
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const errorElement = document.getElementById("student-number-error");

    form.addEventListener("submit", function (event) {
        const studentNumberInput = document.getElementById("studnumber");
        const studentNumber = studentNumberInput.value;

        if (studentNumber.length < 9) {
            // Prevent form submission and show an error message
            event.preventDefault();
            errorElement.textContent = "Min. Length: 9";
        } else {
            // Clear the error message if the input is valid
            errorElement.textContent = "";
        }
    });
});

//Checks if the password length is atleast 8 characters
function validatePasswordLength() {
    let passwordInput = document.getElementById("password").value;

    if (passwordInput.length < 8) {
        let passwordError = document.getElementById("password-error");
        passwordError.innerHTML = "Password must be at least 8 characters long.";
        return false; 
    }

    return true; 
}

//Ajax Part
document.getElementById("signupform").addEventListener("submit", function(event) {
    event.preventDefault();
    let emailInput = document.getElementById("email").value;
    let emailMessage = document.getElementById("email-check-message");
    let passwordInput = document.getElementById("password").value;
    let confirmPasswordInput = document.getElementById("confirm-password").value;
    let studentNumberInput = document.getElementById("studnumber").value;
    let role = document.querySelector('input[name="schoolrole"]:checked');
    let roleValue = role ? role.value : null;
    

    let url = '/check_email/';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            emailMessage.innerHTML = response.message;

            if (response.valid === false || passwordInput.length < 8 || passwordInput !== confirmPasswordInput || studentNumberInput.length !== 9) {
            } else {
                checkStudentNumber(studentNumberInput, emailInput, roleValue);
            }
        }
    };

    let data = "email=" + emailInput + "&schoolrole=" + roleValue;
    xhr.send(data);
});


function checkStudentNumber(studentNumber, email, role) {
    let xhr = new XMLHttpRequest();
    let url = '/check_student_number/';

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let studentNumberError = document.getElementById("student-number-error");
            let role = document.querySelector('input[name="schoolrole"]:checked');
            let roleValue = role ? role.value : null; 
            
            if(roleValue === 'student' && response.valid === false){
                studentNumberError.innerHTML = response.message
            }else if(roleValue === 'professor' && response.valid === false){
                studentNumberError.innerHTML = response.message
            }else if(response.valid === true){
                studentNumberError.innerHTML = ""
                showSuccessPopup()
            }
        }
    };

    let data = "student_number=" + studentNumber + "&email=" + email + "&schoolrole=" + role + "&studnumber=" + studentNumber;
    
    xhr.send(data);
}

//Function to show if the form is successfull
function showSuccessPopup() {
    let popupContainer = document.getElementById("popup-container");
    popupContainer.style.display = "block";
    popupContainer.style.zIndex = "9999";

    let continueButton = document.getElementById("sButton");
    continueButton.addEventListener("click", function() {
        window.location.href = "/home";  
        document.getElementById("signupform").submit();
    });
}

// Function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//Function for forgot password
document.getElementById("forgotPasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let forgotInputEmail = document.getElementById("forgot-email").value;
    let forgotEmailError = document.getElementById("change-email-error");
    let forgotInputNumber = document.getElementById("forgot-number").value;
    let forgotNumberError = document.getElementById("change-number-error");
    let forgotPasswordInput = document.getElementById("forgot-password").value;
    let forgotPasswordError = document.getElementById("change-password-error");
    let forgotConfirmInput = document.getElementById("confirm-forgot").value;
    let confirmForgotError = document.getElementById("change-confirm-error");

    forgotEmailError.innerHTML = "";
    forgotNumberError.innerHTML = "";
    forgotPasswordError.innerHTML = "";
    confirmForgotError.innerHTML = "";

    if (forgotPasswordInput.length < 8) {
        forgotPasswordError.innerHTML = "Minimum Length of password is 8";
    } else {
        if (forgotPasswordInput !== forgotConfirmInput) {
            confirmForgotError.innerHTML = "Passwords do not match";
        } else {
            let url = '/check_forgot_password/';
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);

                    if (response.exists === false) {
                        forgotEmailError.innerHTML = response.message;
                    } else if (response.valid === false) {
                        forgotEmailError.innerHTML = "";
                        forgotNumberError.innerHTML = response.message;
                    } else if (response.valid === true) {
                        forgotNumberError.innerHTML = response.message;
                        showForgotPassPopup()

                    }    
                }
            }

            let data = "forgot-email=" + forgotInputEmail + "&forgot-number=" + forgotInputNumber + "&forgot-password=" + forgotPasswordInput;
            xhr.send(data);
        }
    }
});


function showForgotPassPopup(){
    let popupContainer = document.getElementById("forgot-popup-container");
    popupContainer.style.display = "block";
    popupContainer.style.zIndex = "9999";

    let forgotContinueButton = document.getElementById("forgot-sButton")
    forgotContinueButton.addEventListener("click", function(){
        window.location.href = "/home"
        document.getElementById("forgotPasswordForm").submit()
    })

}

document.getElementById("LagButton").addEventListener("click",function(){
    window.location.href="index.html"
})