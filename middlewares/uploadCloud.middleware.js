const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

module.exports.uploadSingle = (req, res, next) => {
    if(req.file) {
        const streamUpload = (buffer) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(buffer).pipe(stream);
          });
        }
    
        const uploadToCloudinary = async (buffer) => {
          const result = await streamUpload(buffer);
          req.body[req.file.fieldname] = result.url;
          console.log(result)
          next();
        }
    
        uploadToCloudinary(req.file.buffer);
      } else {
       next();
       console.log('1')
      }
}