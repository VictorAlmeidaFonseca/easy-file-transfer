const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const localIp = require('local-ip-address');

// Caminho da área de trabalho/midias
const MEDIA_ROOT = path.join(os.homedir(), 'Desktop', 'midias');
const TMP_DIR = path.join(__dirname, '..', 'uploads_tmp');

// Garante que as pastas existam
if (!fs.existsSync(MEDIA_ROOT)) fs.mkdirSync(MEDIA_ROOT, { recursive: true });
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// Função que cria uma subpasta com data e hora
function createDailyFolder(basePath) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
  
    const folderName = `${pad(now.getDate())}_${pad(now.getMonth() + 1)}_${now.getFullYear()}`;
    const fullPath = path.join(basePath, folderName);
  
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  
    return fullPath;
  }
  

const app = express();
const PORT = 8080;

const upload = multer({ dest: TMP_DIR });

// Página pública acessada pelo celular
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.redirect('/upload.html');
  });
  

// Endpoint para upload
app.post('/upload', upload.array('file'), (req, res) => {
  const uploadFolder = createDailyFolder(MEDIA_ROOT);

  for (const file of req.files) {
    const dest = path.join(uploadFolder, file.originalname);
    fs.renameSync(file.path, dest);
  }

  res.send('✅ Arquivos salvos com sucesso!');
});

// Função para iniciar o servidor
function startServer() {
  const ip = localIp();
  const url = `http://${ip}:${PORT}`;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: ${url}`);
  });

  return url;
}

module.exports = { startServer };
