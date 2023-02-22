const admin = require('firebase-admin');
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');
const nodemailer = require('nodemailer');
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('./pasportconfig')
require('dotenv').config();
const File = require('./model/files')

const router = require('./login')
// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_host,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }))
app.use('/signup', require('./signup'))
app.use('/login', require('./login'))
// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountkey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_URL
});

// Initialize Cloud Storage
const storage = new Storage({
  keyFilename: 'serviceAccountkey.json',
})

const bucket = storage.bucket(process.env.BUCKET_URL)

// Multer middleware to handle file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});


//create a folder in firebase


// create a folder in firebase storage


// API endpoint to create a new folder and upload files into it
app.post('/api/files', passport.authenticate('jwt', { session: false }), upload.array('files', 10), async (req, res) => {
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id
  if (!req.files || req.files.length === 0) {
    res.status(400).send('No files uploaded.');
    return;
  }

  const urls = [];

  for (const file of req.files) {
    console.log(file)
    const storageRef = file.originalname
    const newFileName = `${Date.now()}_${storageRef}`;
    var fileobject = bucket.file(`${userid}/${newFileName}`)

    const stream = fileobject.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Failed to upload file.');
    });


    const publicUrl = await fileobject.getSignedUrl({
      action: 'read',
      expires: '03-17-2023', // Expires on March 17, 2023
      //  save the url in db

    });
    const userUrl = new File({
      userId: userid,
      filename: newFileName,
      url: publicUrl.toString()
    })
    await userUrl.save();
    urls.push(publicUrl);
    if (urls.length === req.files.length) {
      res.status(200).send(urls);
    }


    //url and file upload on mongodb
    stream.end(file.buffer);
  }
}
)





//list all files
app.get('/api/files', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id
  const limit=req.body.limit
  const skip=req.body.skip
  /*const projection = {
    createdAt:req.body.createdAt,
    updatedAt:req.body.updatedAt,
       }*/
  try {
    // List all files in the bucket
    //  const [files] = await bucket.getFiles({ prefix: userid })
    //

    const files = await File.find({ userId: userid} ).skip(skip).limit(limit)
    res.status(200).json(files);
    // Map the list of files to an array of file names
    // const fileNames = files.map(file => file.name);
    
  

  } catch (error) {
    console.error(error);
    res.status(500).send('Error listing files');
  }
});

//delete specific files 

app.delete('/api/file/:fileName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const filename = req.params.fileName;
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id
  const bucket = admin.storage().bucket();

  // Specify the name of the file to be deleted
  const foldername = `${userid}/${filename}`;

  // Delete the file
  bucket.file(foldername).delete()
    .then(async () => {
      res.send(`File ${filename} deleted successfully.`);
      await File.deleteOne({ filename })
    })
    .catch((error) => {
      res.send(`Error deleting file ${filename}: ${error}`);
    });
})


//delete all files

app.delete('/api/files', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id
  try {
    // Get all the files in the bucket
    const [files] = await bucket.getFiles({ prefix: userid });

    // Delete all the files
    await Promise.all(files.map(file => file.delete()));

    res.status(200).send('All files deleted successfully');
    await File.deleteMany({ userId: userid })
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting files');
  }
});
//get the url of the file

app.get('/api/files/filename', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id
  const file = req.params.filename;
  try {
    const filepath = bucket.file(`${userid}/${file}`);

    const [url] = await filepath.getSignedUrl({
      action: 'read',
      expires: '03-17-2023' // Expires on March 17, 2023
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error getting download URL for file ${fileName}`);
  }
});
//all folder url

app.get('/api/files/:folderName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const folderName = req.params.folderName;

  try {
    const folder = bucket.file(folderName);
    folder.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2023' // Expires on March 17, 2023
      });

      res.status(200).json({ url });
    })

  } catch (error) {
    console.error(error);
    res.status(500).send(`Error getting download URL for file ${folderName}`);
  }
});

//send mail
app.post('/send-download-link', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const jwttoken = req.headers.authorization
  const token = jwttoken.slice(7)
  const decode = jwt.decode(token, { complete: true })
  const userid = decode.payload._id


  const { emailFrom, emailTo, fileName } = req.body;

  try {
    const files = await File.findOne({ $and: [{ filename: fileName }, { userId: userid }] })
    if (files) {
      const filename = files.filename
      const url = files.url
      const mailOptions = {

        from: emailFrom,
        to: emailTo,

        subject: 'Download link for ' + filename,
        text: 'Download link: ' + url
      };

      await transporter.sendMail(mailOptions);
    } else {
      res.send(`${fileName} not exist in your folder`)
    }


    res.status(200).json({ message: `Download link sent to ${emailTo}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while sending the download link' });
  }
})


// Start the server
const PORT = process.env.Firebase_PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
