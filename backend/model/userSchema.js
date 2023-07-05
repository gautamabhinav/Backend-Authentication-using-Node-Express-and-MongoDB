const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        unique : [true,'Email already exists'],
        required: [true,'user email is Required'],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        select: false // hide the field from response object when queried using find() method
    },
    forgetPasswordToken: {
        type: String,
    },
    forgotPasswordExpiryDate: {
        type: Date,
    }
}, { 
        timestamps: true
});

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            {id: this._id, email: this.email},
            process.env.SECRET,
            { expiresIn: '24h'}
        )
    }
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;