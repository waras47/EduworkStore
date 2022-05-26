const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');
const DeliveryAddress = require('./model');


//insert
const store = async(req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({...payload, user: user._id});
    await address.save();
    return json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError')  {
      return res.json({
        error: 1,
        message : err.message,
        fields: err.errors
      });
    }

    next(err);
  }
}

//update
const update = async (req, res, next) => {
  try{
    let {_id, ...payload} = req.body;
    let {id} = req.params;
    let  address = await DeliveryAddress.findById(id);
    let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user});
    let policy = policyFor(req.user);
    if(!policy.can('update', subjectAddress)){
      return res.json({
        error: 1,
        message: 'You Are not Allowed to Modify Resource'
      });
    }

    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {new: true});
    return res.json(address);      
  }catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error : 1,
        message : err.message,
        fields : err.errors
      });
    }
    
    next(err);
  }
}

//view
const index = async (req, res, next) => {
  try {
    let {skip=0, limit= 10} = req.query;
    let count = await DeliveryAdresss.find({user: req.user._id}).countDocuments();
    let address = 
      await DeliveryAdress
      .find({user: req.user._id})
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort('-createdAt');

      return res.json({data: address, count});
 
  }catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error : 1,
        message : err.message,
        fields : err.errors
      });
    }
    next(err);
  }
}
//delete
const destroy = async (req, res, next) => {
  try{
    let {id} = req.params;
    let  address = await DeliveryAddress.findById(id);
    let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user});
    let policy = policyFor(req.user);
    if(!policy.can('update', subjectAddress)){
      return res.json({
        error: 1,
        message: 'You Are not Allowed to Delete Resource'
      });
    }

    address = await DeliveryAddress.findByIdAndDelete(req.params.id);
    return res.json(address);
  }catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error : 1,
        message : err.message,
        fields : err.errors
      });
    }
    
    next(err);
  }
}
module.exports = {
  store,
  index,
  update,
  destroy
}

module.exports = {
  store,
  update,
  index,
  destroy
}