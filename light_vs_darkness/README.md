# 🎮 Luz vs. Trevas

Um jogo de reflexo e agilidade com mensagem cristã, desenvolvido para eventos como a Aldeia Be The Light.

## 📋 Sobre o Jogo

**Luz vs. Trevas** é um tap game onde o jogador deve tocar apenas nas esferas de luz que aparecem na tela, evitando as esferas de trevas. Cada acerto ilumina o caminho e aumenta a pontuação, enquanto cada erro reduz uma vida.

### Características

- ⚡ 60 segundos de gameplay intenso
- ❤️ 3 vidas para cometer erros
- ✨ Sistema de combo (x1.5 após 5 acertos seguidos)
- 📱 Otimizado para mobile web
- 🎨 Design minimalista e simbólico
- 💬 Mensagens de reflexão e evangelísticas

## 🚀 Como Rodar o Jogo

### Opção 1: Abrir diretamente no navegador

1. Abra o arquivo `index.html` no seu navegador:
   - **Windows:** Clique duas vezes no arquivo ou arraste-o para o navegador
   - **Mac/Linux:** Clique com o botão direito → "Abrir com" → Seu navegador

2. O jogo deve carregar automaticamente!

### Opção 2: Usar um servidor local (recomendado)

Para uma melhor experiência, especialmente em dispositivos móveis, use um servidor local:

#### Com Python (se instalado):

```bash
# Python 3
cd light_vs_darkness
python -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

#### Com Node.js (se instalado):

```bash
# Instalar http-server globalmente (se ainda não tiver)
npm install -g http-server

# Entrar na pasta do jogo
cd light_vs_darkness

# Iniciar servidor
http-server -p 8000
```

Depois acesse: `http://localhost:8000`

#### Com PHP (se instalado):

```bash
cd light_vs_darkness
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### Opção 3: Testar em dispositivo móvel

1. Inicie um servidor local usando uma das opções acima
2. Descubra o IP da sua máquina:
   - **Windows:** Abra o PowerShell e digite `ipconfig` (procure por "IPv4")
   - **Mac/Linux:** Abra o terminal e digite `ifconfig` ou `ip addr`
3. No seu celular, conectado à mesma rede Wi-Fi, acesse: `http://SEU_IP:8000`
   - Exemplo: `http://192.168.1.100:8000`

### Opção 4: Deploy para produção

Para hospedar o jogo online (Netlify, GitHub Pages, Vercel, etc.):

1. Faça upload dos arquivos da pasta `light_vs_darkness` para o serviço
2. Configure o domínio/apontamento
3. Acesse via URL pública ou gere um QR Code

## 📱 Testando no Mobile

1. Use um servidor local (não apenas abrir o arquivo)
2. Acesse pelo navegador do celular na mesma rede Wi-Fi
3. Para melhor experiência, adicione à tela inicial (menu do navegador → "Adicionar à tela inicial")

## 🎯 Como Jogar

1. Toque no botão **"Começar"**
2. Toque **apenas nas esferas douradas (luz)** para pontuar
3. **Evite tocar nas esferas escuras (trevas)** - você perde uma vida
4. Mantenha o combo para multiplicar seus pontos!
5. Tente sobreviver os 60 segundos e iluminar o máximo possível

## 📁 Estrutura de Arquivos

```
light_vs_darkness/
├── index.html      # Estrutura HTML do jogo
├── style.css       # Estilos e animações
├── game.js         # Lógica do jogo
└── README.md       # Este arquivo
```

## 🛠 Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e gradientes)
- JavaScript (Vanilla JS)
- Web Audio API (para sons)
- Google Fonts (Montserrat e Roboto)

## 📝 Notas de Desenvolvimento

- O jogo funciona offline após o primeiro carregamento
- Sons são gerados programaticamente (não requer arquivos de áudio)
- Totalmente responsivo e otimizado para touch
- Compatível com todos os navegadores modernos

## 🎨 Personalização

Para alterar cores, edite as variáveis CSS em `style.css`:

```css
:root {
    --bg-dark: #0A0A0A;      /* Fundo escuro */
    --light-gold: #FFD700;   /* Cor da luz */
    --dark-gray: #222222;    /* Cor das trevas */
    --white: #FFFFFF;        /* Textos */
    --combo-glow: #FFF7D1;   /* Brilho do combo */
}
```

## 📞 Suporte

Para questões ou melhorias, consulte o documento de design original ou entre em contato com o desenvolvedor.

---

**Versículo Base:** "A luz brilha nas trevas, e as trevas não a derrotaram." – João 1:5

