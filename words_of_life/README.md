# 🎮 Palavras de Vida

Um jogo de caça-palavras cristão baseado nos 9 Frutos do Espírito (Gálatas 5:22-23).

## 📋 Sobre o Jogo

**Palavras de Vida** é um word search onde o jogador encontra palavras relacionadas a cada um dos 9 Frutos do Espírito. Cada nível corresponde a um fruto diferente, com dificuldade crescente.

### Características

- 🎯 9 níveis temáticos (um para cada Fruto do Espírito)
- 📱 Otimizado para mobile web
- 🎨 Design minimalista e elegante
- 💡 Sistema de dicas (1 por nível)
- 📊 Sistema de pontuação
- ✨ Versículos e frases de impacto após cada nível
- 🎵 Feedback sonoro e vibração
- ♿ Acessibilidade (alto contraste)

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
cd words_of_life
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
cd words_of_life

# Iniciar servidor
http-server -p 8000
```

Depois acesse: `http://localhost:8000`

#### Com PHP (se instalado):

```bash
cd words_of_life
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

1. Faça upload dos arquivos da pasta `words_of_life` para o serviço
2. Configure o domínio/apontamento
3. Acesse via URL pública ou gere um QR Code

## 🎯 Como Jogar

1. **Selecione um nível** - Escolha um dos 9 Frutos do Espírito
2. **Encontre as palavras** - Arraste o dedo (ou mouse) sobre as letras para formar as palavras da lista
3. **Direções válidas:**
   - Horizontal (→)
   - Vertical (↓)
   - Diagonal (↘ e ↙)
   - Palavras também funcionam invertidas (de trás para frente)
4. **Use a dica** - Clique no ícone 💡 para ver a primeira letra de uma palavra não encontrada (1 vez por nível)
5. **Complete o nível** - Encontre todas as palavras para ver o versículo e frase de impacto!

### Pontuação

- **+100 pontos** por palavra encontrada
- **+200 pontos** bônus ao completar o nível
- **Multiplicador x1.2** se terminar em menos de 60 segundos

## 📁 Estrutura de Arquivos

```
words_of_life/
├── index.html      # Estrutura HTML do jogo
├── style.css       # Estilos e animações
├── game.js         # Lógica do jogo
├── levels.js       # Dados dos 9 níveis
└── README.md       # Este arquivo
```

## 🛠 Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e gradientes)
- JavaScript (Vanilla JS)
- Web Audio API (para sons)
- Google Fonts (Montserrat e Inter)

## 📝 Níveis do Jogo

1. **Amor** (6×6) - 8 palavras
2. **Alegria** (6×6) - 8 palavras
3. **Paz** (7×7) - 8 palavras
4. **Paciência** (7×7) - 7 palavras
5. **Benignidade** (8×8) - 7 palavras
6. **Bondade** (8×8) - 8 palavras
7. **Fidelidade** (9×9) - 8 palavras
8. **Mansidão** (9×9) - 7 palavras
9. **Domínio Próprio** (10×10) - 7 palavras

## 🎨 Personalização

Para alterar cores, edite as variáveis CSS em `style.css`:

```css
:root {
    --bg-dark: #0B0F14;          /* Fundo escuro */
    --text-light: #ECEFF4;        /* Texto claro */
    --found-glow: #FFD54F;       /* Cor das palavras encontradas */
    --selection-highlight: rgba(255, 224, 130, 0.3); /* Realce de seleção */
}
```

## ⚙️ Configurações

O jogo salva automaticamente suas preferências:
- **Som** - Liga/desliga sons do jogo
- **Vibração** - Liga/desliga vibração (apenas mobile)
- **Alto Contraste** - Modo de alto contraste para melhor acessibilidade

## 📱 Recursos Mobile

- Interface totalmente responsiva
- Touch otimizado para seleção de palavras
- Prevenção de scroll acidental durante o jogo
- Área de toque mínima de 44px para todos os botões

## 📞 Suporte

Para questões ou melhorias, consulte o documento de design original ou entre em contato com o desenvolvedor.

---

**Versículo Base:** "O fruto do Espírito é amor, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão e domínio próprio." – Gálatas 5:22-23

