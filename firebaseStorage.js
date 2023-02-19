  const admin = require('firebase-admin');
const express = require('express');
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');
const nodemailer = require('nodemailer');
const passport=require('passport')
require('./pasportconfig')
require('dotenv').config();
// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host:process.env.SMTP_host,
  port:process.env.SMTP_PORT,  
  secure:false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

const app = express();
app.use(express.json());
app.use(passport.initialize());
 app.use(passport.session());
 app.use(express.urlencoded({extended:true}))
 app.use('/signup',require('./signup'))
app.use('/login',require('./login'))
// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:process.env.BUCKET_URL
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
const filename="uploads\1676132599245-NaN.jpg"
const file=bucket.file(filename);
file.save().then(()=>{
  console.log("successfully save")
}).catch(()=>{
  console.log('error')
})

// API endpoint to create a new folder and upload files into it
app.post('/api/folder', passport.authenticate('jwt',{session:false}),upload.array('files', 10), async (req, res) => {
  try {
    const folderName = req.body.folderName;

    if (!folderName) {
      res.status(400).send('Missing folder name');
      return;
    }

    ;
    

    // Loop through each uploaded file and upload it to the new folder
    const files = req.files;

    for (const file of files) {
      const originalFileName = file.originalname;
      const newFileName = `${Date.now()}_${originalFileName}`;

      // Create a new file object in the new folder
      const fileObject = bucket.file(newFileName);

      // Upload the file content to the new file object
      const fileStream = file.buffer;
      const fileOptions = {
        metadata: {
          contentType: file.mimetype,
        },
      };
      await fileObject.createWriteStream(fileOptions).end(fileStream);
    }

    res.status(200).send('Folder created and files uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating folder and uploading files');
  }
});

//list all files
app.get('/api/files',passport.authenticate('jwt',{session:false}), async (req, res) => {
    try {
      // List all files in the bucket
      const [files] = await bucket.getFiles();
  
      // Map the list of files to an array of file names
      const fileNames = files.map(file => file.name);
  
      res.status(200).send(fileNames);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error listing files');
    }
  });

  //delete specific files 

  app.delete('/api/files/:fileName', passport.authenticate('jwt',{session:false}),async (req, res) => {
    const fileName = req.params.fileName;
  
    try {
      // Get a reference to the file
      const file = bucket.file(fileName);
  
      // Delete the file
      await file.delete();
  
      res.status(200).send(`File ${fileName} deleted successfully`);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error deleting file ${fileName}`);
    }
  });

  //delete all files

  app.delete('/api/files', passport.authenticate('jwt',{session:false}),async (req, res) => {
    try {
      // Get all the files in the bucket
      const [files] = await bucket.getFiles();
  
      // Delete all the files
      await Promise.all(files.map(file => file.delete()));
  
      res.status(200).send('All files deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting files');
    }
  });
  //get the url of the file

  app.get('/api/files/:fileName', passport.authenticate('jwt',{session:false}),async (req, res) => {
    const fileName = req.params.fileName;
  
    try {
      const file = bucket.file(fileName);
  
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2023' // Expires on March 17, 2023
      });
  
      res.status(200).json({ url });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error getting download URL for file ${fileName}`);
    }
  });

  //send mail
  app.post('/send-download-link',passport.authenticate('jwt',{session:false}), async (req, res) => {
    const { emailFrom,emailTo, fileName } = req.body;
  
    try {
      const file = bucket.file(fileName);
  
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2023' // Expires on March 17, 2023
      });
  
      const mailOptions = {
        from: emailFrom,
        to: emailTo,

        subject: 'Download link for ' + fileName,
        text:'Download link: ' + url
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: `Download link sent to ${emailTo}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while sending the download link' });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
