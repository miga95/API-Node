const userModel = require('../models/userModel')
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await userModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo =  (req, res) => {
    
    if(!ObjectID.isValid(req.params.id))
      return res.status(400).send('ID unknown : '+ req.params.id)

    userModel.findById(req.params.id, (err,docs) => {
        if(!err) res.send(docs)
        else console.log(' ID unknown : '+ err)
    }).select('-password')
    
}


module.exports.updateUser =  async (req, res) => {
    
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id)
    
    try{
        await userModel.findByIdAndUpdate(
            {_id: req.params.id},
            { 
                $set: {
                    username: req.body.username,
                    rib : req.body.rib
                }
            },
            {new :true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if(!err) return res.send(docs)
                if(err) return res.status(500).send({message: err})
            })
    }catch(err){
        if(err) return res.status(500).json({message: err})
    }
    
}