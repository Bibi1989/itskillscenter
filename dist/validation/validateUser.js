"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.validateUserRegister = (value) => {
    const { username, email, password } = value;
    const error = {};
    if (!username) {
        error.username = "First nane field is empty";
    }
    if (!email) {
        error.email = "Email field is empty";
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            error.email = "This is not a valid mail";
        }
    }
    if (!password) {
        error.password = "Password field is empty";
    }
    return { value, error };
};
exports.validateUserLogin = (value) => {
    const { email, password } = value;
    const error = {};
    if (!email) {
        error.email = "Email field is empty";
    }
    if (!password) {
        error.password = "Password field is empty";
    }
    return { value, error };
};
//# sourceMappingURL=validateUser.js.map