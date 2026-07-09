const {body, validationResult} = require("express-validator")
const createOrderResult = [
    body("fullName").notEmpty().withMessage("fullname is required"),
    body("email").isEmail().withMessage("invalid email"),
    body("phone").notEmpty().withMessage("phone is required"),
    body("address").notEmpty().withMessage("address is required"),
]
const createOrderValidator = (req, res, next) => {
    if(req.customer) return next()
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            errors: errors.array()
        })
    }
    next()
}
module.exports = {createOrderResult, createOrderValidator}