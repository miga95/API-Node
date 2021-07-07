const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    postModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get Data : ' + err)
    }).sort({createdAt : -1})
}

module.exports.createPost = async (req, res) => {
    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    })
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);
    const updatedRecord = {
        message: req.body.message
    }

    postModel.findByIdAndUpdate(
        req.params.id, {
            $set: updatedRecord
        }, {
            new: true
        },
        (err, docs) => {
            if (!err) res.send(docs);
            else return res.status(500).send({
                message: err
            })
        }

    )
}

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);

    postModel.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs)
            else res.status(200).send(err)
        })
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);
    try {
        await postModel.findByIdAndUpdate(
            req.params.id, 
            {
                $addToSet: { likers: req.body.id }
            }, 
            { new: true },
            (err, docs) => {
                if (err){
                    console.log("Id unknown" + err)
                    return res.status(400).send(err)
                } 
                
            })
            
        await userModel.findByIdAndUpdate(
            req.body.id, {
                $addToSet: { likes: req.params.id }
            }, 
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs)
                else return res.status(400).send(err);
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
}


module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);
    
    try {
        await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            {new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err)
            }
        );
        await userModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id},
            },
            {new: true },
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err)
            }
        )
    } catch (err) {
        return res.status(400).send(err)
    }
}


module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);

    try {
        return postModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commentorId: req.body.commentorId,
                        commentorUsername: req.body.commentorUsername,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                 }
            },
            { new: true },
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
        )
    } catch (error) {
        return res.status(400).send(error)
    }

}


module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);

    try {
        return postModel.findById(req.params.id, (err, docs) => {

            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            )
            if(!theComment) return res.status(404).send('Comment not found')
            
            theComment.text = req.body.text
            return docs.save((err) => {
                if(!err) return res.status(200).send(docs)
                return res.status(500).send(err)
            })
        })

    } catch (error) {
        return res.status(400).send(error)
    }    
}


module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown" + req.params.id);
    
    try {
        return postModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }
                }
            },
            {new: true },
            (err, docs) => {
                if(!err) res.send(docs)
                return res.status(400).send(err)
            }
        )
    } catch (error) {
        return res.status(400).send(error)
    }
}