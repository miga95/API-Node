const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    postModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get Data : ' + err)
    })
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
        console.log("Id unknown" + req.params.id)
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
}