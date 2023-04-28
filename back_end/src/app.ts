import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';
import path from 'path';
import multer, { Multer } from 'multer';
const cors = require("cors");
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port = 3000;
app.use(cors());

app.use(express.static(__dirname + '/public'));


app.use('/uploads/processed', express.static(__dirname + '/uploads/processed'));

interface FileRequest extends Request {
  file: Express.Multer.File;
}


const storage = multer.diskStorage({
    destination: function (req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, cb: any) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${file.originalname}`);
    },
});

const upload: Multer = multer({ storage: storage });


app.use(express.static(path.join(__dirname, 'build')));

// Home router
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Upload Submit Route
app.post('/upload', upload.single('fileToUpload'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.send('Aucun fichier n\'a été sélectionné.');
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;

  const targetDir = path.join(__dirname, '..', 'uploads', 'processed');
  const targetPath = path.join(targetDir, fileName);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  
  // Video conversion with ffmpeg
  ffmpeg(filePath)
    .outputOptions('-flags:v +ildct+ilme')
    .videoCodec('libx264')
    .audioCodec('aac')
    .audioBitrate('1M')
    .size('320x240')
    .outputOptions('-r 30')
    .output(targetPath)
    .on('end', () => {
      
      fs.unlink(filePath, () => {
        res.send('File upload successfully');
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Fail Upload');
    })
    .run();
});

app.get('/files', (req: Request, res: Response) => {
  const videosPath = path.join(__dirname, '..', 'uploads', 'processed');
  console.log('Videos Path:', videosPath);
  fs.readdir(videosPath, (err, files) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
     console.log('Files:', files);
    const videoFiles = files.filter((file) => {
      const fileExtension = path.extname(file).toLowerCase();
      return fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov';
    });
    res.json(videoFiles);
  });
});

app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..' ,'uploads', 'processed', req.params.filename);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});


app.listen(port, () => {
  console.log(`My Eole project start on port ${port}`)
})