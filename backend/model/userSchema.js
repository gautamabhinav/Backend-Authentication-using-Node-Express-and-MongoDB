const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true,'Name is Required'],
        trim: true,
        minlength:[5,"Minimum 5 characters are allowed"],
        maxlength:[50,"Maximum length of Name can be up to 50 character"]
    },
    email: {
        type: String,
        unique : [true,'user email already exists'],
        unique: true,
        lowercase: true,
        required: [true,'user email is Required'],
    },
    password: {
        type: String,
        select: false // hide the field from response object when queried using find() method
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiryDate: { type: Date,}

}, 
    { timestamps: true }
);

// Hashes password before saving to the database
userSchema.pre("save", async function (next) {
    // if password is not modified then do not hash it.
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    return next();
});

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: 24 * 60 * 60 * 1000 } // 24
        );
    },

    // userSchema method for generating and return forgetPassword token
    getForgotPasswordToken() {
        const forgotToken = crypto.randomBytes(20).toString("hex");
        // step 1 - save to DB
        this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(forgotToken)
            .digest("hex");

        // forgot password expiry date
        this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000;  // 20 min

        // step 2 - return value to user
        return forgotToken;
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;