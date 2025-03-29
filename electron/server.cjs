const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const localIp = require('local-ip-address');
const sanitize = require('sanitize-filename');
const { app: electronApp } = require('electron');

// Diretórios principais
const MEDIA_ROOT = path.join(os.homedir(), 'Desktop', 'midias');
const TMP_DIR = path.join(MEDIA_ROOT, '.tmp');
const LOG_DIR = path.join(electronApp.getPath('userData'), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'error.log');

// Inicializa diretórios necessários
[MEDIA_ROOT, TMP_DIR, LOG_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Logger simples para erros
function logError(err) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${err.stack || err}\n`;
  fs.appendFileSync(LOG_FILE, message);
}

// Cria pasta com base na data atual
function createDailyFolder(basePath) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const folderName = `${pad(now.getDate())}_${pad(now.getMonth() + 1)}_${now.getFullYear()}`;
  const fullPath = path.join(basePath, folderName);

  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
  return fullPath;
}

function getUniqueFilename(folder, baseName) {
    const ext = path.extname(baseName);
    const name = path.basename(baseName, ext);
    let candidate = baseName;
    let counter = 1;
  
    while (fs.existsSync(path.join(folder, candidate))) {
      candidate = `${name} (${counter})${ext}`;
      counter++;
    }
  
    return path.join(folder, candidate);
  }

const app = express();
const PORT = 8080;

const upload = multer({
  dest: TMP_DIR,
});

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Redireciona para página de upload
app.get('/', (_req, res) => {
  res.redirect('/upload.html');
});

// Endpoint para upload de arquivos
app.post('/upload', upload.array('file'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const uploadFolder = createDailyFolder(MEDIA_ROOT);

    for (const file of req.files) {
      try {
        const safeName = sanitize(file.originalname);
        const dest = getUniqueFilename(uploadFolder, safeName);

        if (!dest.startsWith(uploadFolder)) {
          throw new Error('Caminho de destino inválido!');
        }
        
        fs.renameSync(file.path, dest);
      } catch (err) {
        logError(err);
        return res.status(500).send(`Erro ao salvar o arquivo: ${file.originalname}`);
      }
    }

    // Limpeza do diretório temporário após uso
    fs.readdirSync(TMP_DIR).forEach((file) => {
      try {
        fs.unlinkSync(path.join(TMP_DIR, file));
      } catch (err) {
        logError(err);
      }
    });

    res.send('✅ Arquivos salvos com sucesso!');
  } catch (err) {
    logError(err);
    res.status(500).send('❌ Erro ao processar o upload.');
  }
});

// Inicia o servidor
function startServer() {
  const ip = localIp();
  const url = `http://${ip}:${PORT}`;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: ${url}`);
  });

  return url;
}

module.exports = { startServer };
