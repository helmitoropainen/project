const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let postSchema = new Schema({
    user: ObjectId,
    title: String,
    content: String,
    parentPost: ObjectId,
    votes: [ { user:  ObjectId, vote: Boolean } ],
},
{
    timestamps: true
})

module.exports = mongoose.model("Post", postSchema)