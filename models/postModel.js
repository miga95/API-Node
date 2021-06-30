const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxlength: 500
        },
        picture: {
            type: String,
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true,
        },
        comments: {
            type: [
                {
                    commentorId: String,
                    commentorUsername: String,
                    text: String,
                    timestamp: Number
                }
            ],
            required: true
        }
    },
    {
        timestamps: true,
    }   
)

const postModel = mongoose.model('post', PostSchema)
module.exports = postModel 