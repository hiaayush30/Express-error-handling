const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const tryCatch = require('./utils/tryCatch');
const app = express();
const zod = require('zod');
const { INVALID_SUBSCRIPTION } = require('./constants/errorCode');
const AppError = require('./AppError');
app.use(express.json());
const getUser = () => undefined;
const getSub = () => undefined;

app.get('/test', (req, res) => {
    // const name=user.name;    //programmer error
    return res.status(200).json({
        success: true
    })
})

app.get('/test2', (req, res) => {
    const user = getUser();  //operational error
    try {
        if (!user) {
            throw new Error("User not found!")
            //js goes up and up in the call stack until the thrown error is 
            //caught and handled somewhere else it will just crash or throw error
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(200).json({
        success: true
    })
})
//but this gets repeatative and code gets clunky fast
//using error handler middleware
app.get('/login', (req, res, next) => {
    const user = getUser();
    try {
        if (!user) {
            throw new Error("User not found!")
        }
    } catch (err) {
        return next(err);
    }
    return res.status(200).json({
        success: true
    })
})
//getting rid of the try catch block
app.get('/login2', tryCatch((req, res) => {
    const user = getUser();
    if (!user) throw new Error("User not found!")
    return res.status(200).json({
        success: true
    })
}))
//when the /login2 endpoint is hit the async function
//returned by the tryCatch fn will run

const userSchema = zod.object({
    name: zod.string(),
    password: zod.string()
})
app.post('/login', tryCatch((req, res) => {
    const validBody = userSchema.safeParse(req.body);
    if (!validBody.success) throw new Error(validBody.error)
    return res.status(200).json({ success: true });
}))

app.get('/subscribe', tryCatch((req, res) => {
    const subscription = getSub();
    if (!subscription) throw new AppError(INVALID_SUBSCRIPTION,"subscription not found",400);
    return res.status(200).json({
        success: true
    })
}))

app.use(errorHandler);
app.listen(3000);