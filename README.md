
# File Sharing App

This project takes the file from the user and uploads it to the firebase storage and sends the download url of the file to the e-mail and user download the file by clicking the download link,
first they can authenticate the user and only if the user is authenticated they can able to upload files and the file upload on a folder which are created by user_id which are extract by 
user authentication jwt token

## API Reference

#### Get all files

```http
  GET /api/files
```

 |  GET   | Description = this will fetch all the user files data from mongodb (user folder only)            |
| :-------- | :------- | :------------------------- |
 **Required**. user authentication to fetch the files

#### post files

```http
  post /api/files/
```

 |   POST    | Description  =                     this takes the files from user and upload in to firebase storage and save the url and file name and user_id (which user upload) of the file on  mongodb:-------- | :------- | :-------------------------------- |
 **Required**. user authentication to upload the files

#### Delete single file

```http
  delete /api/files/:filename
```

| DELETE | Description  = this takes the filename from user in the paramters of a url, and delete the file from the user's folder in the firebase storage, and also delete file data from   mongodb:-------- | :------- | :-------------------------------- |
 **Required**. user authentication to upload the files

 

 #### Delete folder

```http
  delete /api/files/
```

| DELETE | Description  = this delete the user's folder from firebase storage and delete all the files data which are stored  in   mongodb:-------- | :------- | :-------------------------------- |
 **Required**. user authentication to upload the files


 #### Send url link

```http
  post /send-downlaoad-link
```

| POST | Description  = this takes the emailfrom and emailTo  and filename in req.body and send the download url to the emailfrom:-------- | :------- | :-------------------------------- |
 **Required**. user authentication to upload the files


#### Get single file url

```http
  GET /api/files/:filename
```

 |  GET   | Description = this will give download url of a single file (user folder only)            |
| :-------- | :------- | :------------------------- |
 **Required**. user authentication to fetch the files



all api's keep in firebaseStorage.js file

