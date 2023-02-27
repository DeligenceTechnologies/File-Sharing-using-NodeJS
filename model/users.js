const mongoose = require('mongoose');
const schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const { boolean } = require('joi');

const fileSchema = new schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: false,
        lowercase: true
    },
    password: {
        type: String,
    },
    verified:{
        type:Boolean,
        default:false

    }
}, { timestamps: true }
)
fileSchema.pre("save", async function (next) {
    // const passwordHash= await bcrypt.hash(req.body.password,10);
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)

        // const passwordCompare=await bcrypt.compare(req.body.password,req.body.confirmPassword)
    }
    next();

})
module.exports = mongoose.model('user-authentication', fileSchema);