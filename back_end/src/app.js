"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cors = require("cors");
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const app = (0, express_1.default)();
const port = 3000;
app.use(cors());
app.use(express_1.default.static(__dirname + '/public'));
// Autoriser l'accès à uploads/processed
app.use('/uploads/processed', express_1.default.static(__dirname + '/uploads/processed'));
// configuration de Multer pour stocker les fichiers dans le dossier ./uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// servir les fichiers statiques à partir du dossier ./build
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
// gérer les demandes pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'build', 'index.html'));
});
// gérer la soumission du formulaire
app.post('/upload', upload.single('fileToUpload'), (req, res) => {
    if (!req.file) {
        return res.send('Aucun fichier n\'a été sélectionné.');
    }
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const targetDir = path_1.default.join(__dirname, '..', 'uploads', 'processed');
    const targetPath = path_1.default.join(targetDir, fileName);
    // Crée le dossier cible s'il n'existe pas déjà
    if (!fs_1.default.existsSync(targetDir)) {
        fs_1.default.mkdirSync(targetDir);
    }
    // conversion de la vidéo en basse résolution
    (0, fluent_ffmpeg_1.default)(filePath)
        .outputOptions('-flags:v +ildct+ilme')
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('1M')
        .size('320x240')
        .outputOptions('-r 30')
        .output(targetPath)
        .on('end', () => {
        // Supprime le fichier original une fois la conversion terminée
        fs_1.default.unlink(filePath, () => {
            res.send('Le fichier a été téléchargé avec succès.');
        });
    })
        .on('error', (err) => {
        console.error(err);
        res.status(500).send('Une erreur est survenue lors de la conversion du fichier.');
    })
        .run();
});
app.get('/files', (req, res) => {
    const videosPath = path_1.default.join(__dirname, '..', 'uploads', 'processed');
    console.log('Chemin des vidéos:', videosPath);
    fs_1.default.readdir(videosPath, (err, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        console.log('Fichiers récupérés:', files);
        const videoFiles = files.filter((file) => {
            const fileExtension = path_1.default.extname(file).toLowerCase();
            return fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov';
        });
        res.json(videoFiles);
    });
});
// app.get('/files/:filename', (req: Request, res: Response) => {
//   const videosPath = path.join(__dirname, '..', 'uploads', 'processed');
//   const filename = req.params.filename;
//   const file = path.join(videosPath, filename);
//   const stat = fs.statSync(file);
//   const range = req.headers.range;
//   if (range) {
//     const parts = range.replace(/bytes=/, '').split('-');
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
//     const chunksize = end - start + 1;
//     const fileStream = fs.createReadStream(file, { start, end });
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${stat.size}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'video/mp4',
//     };
//     res.writeHead(206, head);
//     fileStream.pipe(res);
//   } else {
//     const head = {
//       'Content-Length': stat.size,
//       'Content-Type': 'video/mp4',
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(file).pipe(res);
//   }
// });
// démarrer le serveur
app.listen(port, () => {
    console.log(`My Eole project start on port ${port}`);
});
