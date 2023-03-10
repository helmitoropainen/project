const mongoose = require("mongoose")
const Schema = mongoose.Schema

let userSchema = new Schema({
    username: String,
    fullname: String,
    bio: String,
    password: String,
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)