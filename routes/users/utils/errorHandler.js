//make a function that takes in our errors coming in from our userController
//mix of mongodb error and other errors in our controller
//in users: only used in the create and update

//err.code
//err.keyValue
//err.keyPattern
const parsedError = (err) => {
    let objectKeys = Object.keys(err.keyValue);
    let objectValues = Object.values(err.keyValue);
    console.log("key", objectKeys[0]);
    console.log("value", objectValues[0]);
    console.log(`${objectKeys[0]} ${objectValues[0]} is already in use`)
    return `${objectKeys[0]} ${objectValues[0]} is already in use`;
  };
  
  const errorHandler = (err) => {
    let message = "";
  
    if (err.code) {
      switch (err.code) {
        case 11000:
          message = parsedError(err);
          break;
        default:
          message = "something is wrong, contact support";
      }
    }
    return message;
  };
  
  module.exports = {
    errorHandler,
  };