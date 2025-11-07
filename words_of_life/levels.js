// Dados dos 9 níveis (Frutos do Espírito)
const levels = [
    {
        id: "nivel_01_amor",
        title: "Amor",
        gridSize: 6,
        wordList: ["AMOR", "AGAPE", "SERVIR", "PERDAO", "CRUZ", "VIDA", "PROXIMO", "LUZ"],
        versicle: {
            ref: "1 João 4:19",
            text: "Nós amamos porque Ele nos amou primeiro."
        },
        impact: "Amar é escolher trazer luz ao outro.",
        themeColor: "#FF6F61",
        hints: 1
    },
    {
        id: "nivel_02_alegria",
        title: "Alegria",
        gridSize: 6,
        wordList: ["ALEGRIA", "GOZO", "FORCA", "CANTICO", "ESPERANCA", "SORRISO", "GRATIDAO", "VIDA"],
        versicle: {
            ref: "Neemias 8:10",
            text: "A alegria do Senhor é a nossa força."
        },
        impact: "A alegria que vem de Deus não oscila com as circunstâncias.",
        themeColor: "#FFC107",
        hints: 1
    },
    {
        id: "nivel_03_paz",
        title: "Paz",
        gridSize: 7,
        wordList: ["PAZ", "SHALOM", "DESCANSO", "CONFIAR", "ABRIGO", "CALMA", "GUARDA", "CORACAO"],
        versicle: {
            ref: "João 14:27",
            text: "A Minha paz vos dou."
        },
        impact: "A paz verdadeira é presença, não ausência de lutas.",
        themeColor: "#81D4FA",
        hints: 1
    },
    {
        id: "nivel_04_paciencia",
        title: "Paciência",
        gridSize: 7,
        wordList: ["PACIENCIA", "LONGANIMIDADE", "ESPERAR", "FIRMEZA", "FIDELIDADE", "TEMPO", "CAMINHO"],
        versicle: {
            ref: "Romanos 12:12",
            text: "Perseverai na oração."
        },
        impact: "Esperar em Deus molda o nosso coração.",
        themeColor: "#90EE90",
        hints: 1
    },
    {
        id: "nivel_05_benignidade",
        title: "Benignidade",
        gridSize: 8,
        wordList: ["BENIGNIDADE", "GENTILEZA", "CUIDADO", "ACOLHER", "SERVICO", "PALAVRA", "OLHAR"],
        versicle: {
            ref: "Efésios 4:32",
            text: "Sede bondosos e compassivos."
        },
        impact: "A benignidade é a linguagem que todos entendem.",
        themeColor: "#FFB6C1",
        hints: 1
    },
    {
        id: "nivel_06_bondade",
        title: "Bondade",
        gridSize: 8,
        wordList: ["BONDADE", "JUSTICA", "VERDADE", "ATO", "MANHA", "SEMENTE", "FRUTO", "CAMINHAR"],
        versicle: {
            ref: "Efésios 5:9",
            text: "O fruto da luz consiste em toda a bondade…"
        },
        impact: "A bondade é luz em movimento.",
        themeColor: "#98D8C8",
        hints: 1
    },
    {
        id: "nivel_07_fidelidade",
        title: "Fidelidade",
        gridSize: 9,
        wordList: ["FIDELIDADE", "ALIANCA", "PROMESSA", "VERDADEIRO", "FIRME", "ROCHA", "LEAL", "CONSTANTE"],
        versicle: {
            ref: "Lamentações 3:22-23",
            text: "Grande é a Tua fidelidade."
        },
        impact: "Deus é fiel — ponto final.",
        themeColor: "#7E57C2",
        hints: 1
    },
    {
        id: "nivel_08_mansidao",
        title: "Mansidão",
        gridSize: 9,
        wordList: ["MANSIDAO", "HUMILDADE", "BRANDURA", "SUAVIDADE", "DISCERNIR", "OUVIR", "CORACAO"],
        versicle: {
            ref: "Mateus 11:29",
            text: "Aprendei de Mim, que sou manso e humilde…"
        },
        impact: "A verdadeira força sabe ser mansa.",
        themeColor: "#B39DDB",
        hints: 1
    },
    {
        id: "nivel_09_dominio_proprio",
        title: "Domínio Próprio",
        gridSize: 10,
        wordList: ["DOMINIO", "PROPRIO", "DISCIPLINA", "SOBRIEDADE", "VIGIAR", "VONTADE", "FOCO", "RENOVA"],
        versicle: {
            ref: "2 Timóteo 1:7",
            text: "Deus não nos deu espírito de covardia… mas de domínio próprio."
        },
        impact: "Direção sobre impulso. Luz sobre caos.",
        themeColor: "#FFD54F",
        hints: 1
    }
];

