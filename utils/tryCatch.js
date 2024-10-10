const tryCatch = (controller) => async (req, res, next) => {
    // await is necessary if the function passed as controller is async
    try {
        await controller(req, res);  //async fn will return a promise
    } catch (err) {
        return next(err);
    }
}

module.exports = tryCatch;
 //When you use await inside the controller function, the asynchronous operation(like a db
// query,file reads, or HTTP requests) is awaited within the controller, meaning the
// controller will wait for the asynchronous operation to finish before proceeding to
// the next line.
// However, if the controller itself (which returns a Promise as it is async) is not 
// awaited in the tryCatch wrapper, the try-catch in the wrapper will not be able to catch 
// errors that occur during the asynchronous execution. The wrapper will return immediately,
// without waiting for the controller’s Promise to resolve or reject.