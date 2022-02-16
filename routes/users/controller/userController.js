const { trusted } = require('mongoose');
const User = require('../model/User');

// function to check for special characters or numbers
const charNum = (str) => {
    if(str.match(/[!`\-_=@#$%^&*()\[\],.?":;{}|<>1234567890]/g)){
        return true;
    } else {
        return false;
    }
}

const noSpecialCharSpace = (str) => {
    if(str.match(/[!`\-_=@#$%^&*()\[\],.?":;{}|<>\s]/g)) {
        return true;
    } else {
        return false;
    }
}

const validateEmail = (str) => {
    if(!str.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        return true;
    } else {
        return false;
    }
}

const isPasswordStrong = (str) => {
    return !str.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g)
}

const createUser = async (req, res) => {
    try {
        let errObj = {};
        const { firstName, lastName, username, email, password } = req.body;
        if(charNum(firstName)){
            errObj.firstName = 'First name should only have letters, no special characters or numbers';
        }
        if(charNum(lastName)){
            errObj.lastName = 'Last name should only have letters, no special characters or numbers';
        }
        if(noSpecialCharSpace(username)){
            errObj.username = 'Username should only contain letters or numbers, no special characters or spaces';
        }
        if(validateEmail(email)){
            errObj.email = 'Please enter a valid email';
        }
        if(isPasswordStrong(password)){
            errObj.password = 'Please enter a strong password';
        }
        let checkedObj = Object.keys(errObj); // creates an array of the object keys
        if(checkedObj.length > 0){
            return res.json(errObj)
        }
        res.status(200).json(req.body);
    } catch (error) {
       res.status(500).json(error);
    }
};

module.exports = {
    createUser,
};