const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");

const signup = async(req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if(!name || !email || !password || !confirmPassword ) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email id"
        })
    }

    if ( password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "password and confirm password doesn't match"
        })
    }


    try {
        const user = await userModel.create(req.body)

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch(e) {
        if(e.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists with provided email id',
            }) 
        }
        return res.status(400).json({
            success: false,
            message: e.message,
        })
    }
    
}

const signin = async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory",
        })
    }

    const user = await userModel
        .findOne({
            email
        })
        .select('+password');

    if(!user || user.password !== password) {
        return res.status(400).json({
            success: false,
            message: "invalid credentials",
        })
    }

    const token = user.jwtToken();
    

}

module.exports = {
    signup,
    signin
}