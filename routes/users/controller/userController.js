const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/errorHandler');

// function to check for special characters or numbers
// const charNum = (str) => {
//     if(str.match(/[!`\-_=@#$%^&*()\[\],.?":;{}|<>1234567890]/g)){
//         return true;
//     } else {
//         return false;
//     }
// };

// const noSpecialCharSpace = (str) => {
//     if(str.match(/[!`\-_=@#$%^&*()\[\],.?":;{}|<>\s]/g)) {
//         return true;
//     } else {
//         return false;
//     }
// };

// const validateEmail = (str) => {
//     if(!str.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
//         return true;
//     } else {
//         return false;
//     }
// };

// const isPasswordStrong = (str) => {
//     return !str.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g)
// };

// const checkIfEmpty = (str) => {
//     console.log(str);
//     if(str.length === 0 || str === null) return true;
// };

const createUser = async (req, res) => {
    try {
        // let errObj = {};
        const { firstName, lastName, username, email, password } = req.body;

        // let body = req.body;

        // if(charNum(firstName)){
        //     errObj.firstName = 'First name should only have letters, no special characters or numbers';
        // }

        // if(charNum(lastName)){
        //     errObj.lastName = 'Last name should only have letters, no special characters or numbers';
        // }

        // if(noSpecialCharSpace(username)){
        //     errObj.username = 'Username should only contain letters or numbers, no special characters or spaces';
        // }

        // if(validateEmail(email)){
        //     errObj.email = 'Please enter a valid email';
        // }

        // if(isPasswordStrong(password)){
        //     errObj.password = 'Please enter a strong password';
        // }

        // let checkedObj = Object.keys(errObj); // creates an array of the object keys

        // if(checkedObj.length > 0){
        //     return res.json(errObj)
        // }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let newUser = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword
        });

        let savedUser = await newUser.save();

        res.status(200).json({ message: 'New user has been saved', payload: savedUser });
    } catch (error) {
        res.status(500).json({ error: errorHandler(error) });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({  email: email });
        if(foundUser === null) throw { message: 'Email and password do not match' };

        const comparedPassword = await bcrypt.compare(password, foundUser.password);

        if(!comparedPassword) throw { message: 'Email and password do not match' };

        const jwtToken = jwt.sign({
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            username: foundUser.username,
        }, process.env.SECRET_KEY, { expiresIn: '12h' });
        res.status(200).json({ payload: jwtToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
    
const updateProfile = async (req, res) => {
    try {
        const decodedToken = res.locals.decodedToken;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        req.body.password = hashedPassword;
        const updatedUser = await User.findOneAndUpdate({ email: decodedToken.email }, req.body, { new: true });
        res.status(200).json({ message: 'updated user', payload: updatedUser });
    } catch (error) {
        res.status(500).json({ error: errorHandler(error) });
    }
}

// create a jwt middleware


module.exports = {
    createUser,
    userLogin,
    updateProfile
}