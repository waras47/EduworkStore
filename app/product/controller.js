
const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');

const store = async (req, res, next) => {
  try{
    let payload = req.body;

    if(req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1 ];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/product/${filename}`);


      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {

          let product = new Product({...payload, image_url: filename});
          await product.save();
          return res.json(product);

        }catch(err) {

          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError') {
            return res.json({
              error : 1,
              message : err.message,
              fields : err.errors
            })
          }

          next(err);
        }
      });

      src.on('error', async () => {
        next(err);
      });

    }else {

      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
    
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
  store
}