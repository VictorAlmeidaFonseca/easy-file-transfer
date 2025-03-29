# 📁 FileTransferApp

**FileTransferApp** é uma aplicação leve feita com **Electron**, **HTML**, **CSS (Tailwind)** e **JavaScript puro**, que permite enviar arquivos do celular para o computador de forma simples e rápida, via rede local.

## ✨ Funcionalidades

- Envie arquivos do seu celular diretamente para o computador
- Visualização por QR Code
- Interface leve, responsiva e amigável
- Visualização de miniaturas e arquivos duplicados
- Suporte a arquivos especiais `.jwpub`, `.jw` com ícone personalizado
- Armazenamento organizado por data
- Limpeza automática dos arquivos temporários
- Log de erros no sistema para auditoria local

---

## 🚀 Como usar

### 1. Abra o aplicativo no computador
- Ao iniciar o app, será exibida a tela com o QR Code.

### 2. Conecte-se à mesma rede Wi-Fi
- O celular e o computador devem estar na mesma rede local.

### 3. Escaneie o QR Code com o celular
- Isso abrirá a interface de upload no navegador do seu celular.

### 4. Selecione os arquivos
- Clique ou arraste arquivos para a área destacada.

### 5. Envie!
- Acompanhe o progresso e receba confirmação ao final.

---

## 📦 Instalação

### Windows / macOS / Linux

Baixe o instalador mais recente diretamente na aba [Releases](https://github.com/seu-usuario/file-transfer-app/releases) do repositório.

Ou clone manualmente:

```bash
git clone https://github.com/seu-usuario/file-transfer-app.git
cd file-transfer-app
pnpm install
pnpm start
```

---

## 🗂️ Estrutura do projeto

```text
📦 file-transfer-app
├── electron/
│   ├── main.cjs        # Processo principal do Electron
│   ├── preload.cjs     # Bridge segura para IPC
│   ├── server.cjs      # Servidor Express para uploads
│   └── internal/index.html # Interface principal do app
├── public/             # Página acessada via QR Code
│   └── upload.html     # Upload dos arquivos via navegador
├── uploads_tmp/        # Arquivos temporários (auto-limpeza)
├── assets/             # Ícones da aplicação
├── package.json
└── README.md
```

---

## 🛡️ Segurança

- Os arquivos são armazenados com nomes seguros (`sanitize-filename`)
- Toda tentativa de path traversal é bloqueada
- O app não expõe seu computador na internet
- Os uploads são limitados a 50MB por arquivo
- Diretório de upload temporário é oculto e limpo automaticamente

---

## 🔍 Logs

Erros são registrados automaticamente em:

- **macOS**: `~/Library/Application Support/FileTransferApp/logs/error.log`
- **Windows**: `%APPDATA%/FileTransferApp/logs/error.log`
- **Linux**: `~/.config/FileTransferApp/logs/error.log`

---

## 👨‍💻 Autor

Desenvolvido por **Victor Fonseca**  
📬 [@VictorAlmeidaFonseca](https://github.com/VictorAlmeidaFonseca)

---

## 📃 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
