const userModel = require("../model/userSchema.js");
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');
// const crypto = require('crypto');


const signup = async(req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if( !name || !email || !password || !confirmPassword ) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    // validste email using npm package "email-validator"
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email id"
        })
    }

    try {
        // send password not match err id password != confirmPassword
        if ( password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password doesn't match"
            })
        }

        // const userInfo = new userModel(req.body);
        // const result = await userInfo.save();

    //     const user = await userModel.create({
    //         name,
    //         email,
    //         password
    //     })
    //     console.log(user);

    //     return res.status(200).json({
    //         success: true,
    //         data: user
    //     });

    // } catch (error) {
    //     console.log(error);
    //     return res.status(400).json({
    //         message: error.message
    //     });
    // }

        const user = await userModel.create({
            name,
            email,
            password
        });

        console.log(user);

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
            return res.status(400).json({
                success: false,
                error: "Username already exists"
            });
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            error: "An error occurred while creating the user"
        });
    }

    
}

const signin = async (req,res,next) => {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Every field is mandatory",
            });
        }


        try {
            const user = await userModel
            .findOne({
                email
            })
            .select('+password');

            if(!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({
                    success: false,
                    message: "invalid credentials",
                })
            }

            const token = user.jwtToken();
            user.password = undefined;

            const cookieOption = {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true
            };

            res.cookie("token", token, cookieOption,);
            res.status(200).json({
                success: true,
                data: user
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
        })
    }  
}


const getUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            message: user
    })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// const forgotPassword = async (req, res, next) => {
//     const email = req.body.email;

//     if(!email) {
//         return res.status(400).json({
//             success: false,
//             message: "Email is required"
//         });
//     }

//     try {
//         const user = await userModel.findOne({
//             email
//         });

//         if(!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "user not found"
//             });
//         }

//         const forgotPasswordToken = user.getForgotPasswordToken();

//         await user.save();
//         return res.status(200).json({
//             success: true,
//             message: forgotPasswordToken
//         })
//     } catch (error) {
//        return  res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


const crypto = require('crypto');
const { log } = require("console");

const forgotPassword = async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex');

        // Set the token and expiry date in the user object
        user.forgotPasswordToken = token;
        user.forgotPasswordExpiryDate = Date.now() + 3600000; // Token expires in 1 hour

        // Save the user object with the updated token and expiry date
        await user.save();

        return res.status(200).json({
            success: true,
            message: token
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// const resetPassword = async (req, res, next) => {
//     const { token } = req.params;
//     const { password, confirmPassword } = req.body;

//     if (!token) {
//         return res.status(400).json({
//             success: false,
//             message: "Token is required",
//         });
//     }

//     if(!password || !confirmPassword) {
//         return res.status(400).json({
//             success: false,
//             message: "password and confirmPassword is required"
//         });
//     }

//     if(password !== confirmPassword) {
//         return res.status(400).json({
//             success: false,
//             message: "password and confirmPassword does not match"
//         });
//     }

//     // const hashToken = crypto.createHash("sha256").update(token).digest("hex");
//     const hashToken = crypto.createHash("sha256").update(token).digest("hex");


//     try {
//         const user = await userModel.findOne({
//             forgotPasswordToken: hashToken,
//             forgotPasswordExpiryDate: {
//                 Sgt: new Date() // forgotPasswordExpiryDate() less than current date
//             }
//         });

//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Token or token is expired"
//             });
//         }

//         user.password = password;
//         await user.save();

//         user.forgotPasswordExpiryDate = undefined;
//         user.forgotPasswordToken = undefined;
//         user.password = undefined;

//         return res.status(200).json({
//             success: true,
//             message: user
//         });

//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required",
        });
    }

    if (!password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirmPassword are required",
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirmPassword do not match",
        });
    }

    try {
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await userModel.findOne({
            forgotPasswordToken: hashToken,
            forgotPasswordExpiryDate: {
                $gt: new Date() // forgotPasswordExpiryDate greater than current date
            }
        });
        console.log(user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token or token has expired",
            });
        }

        user.password = password;
        await user.save();

        user.forgotPasswordExpiryDate = undefined;
        user.forgotPasswordToken = undefined;
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};



const logout = async (req, res, next) => {
    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        };

        res.cookie("token", null, cookieOption);
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    signup,
    signin,
    getUser,
    logout,
    resetPassword,
    forgotPassword
}