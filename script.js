const questionBank = {
    programming: [
        { q: "What is HTML?", options: ["Language", "Database", "OS", "Browser"], ans: 0 },
        { q: "What is JS used for?", options: ["Styling", "Logic", "Database", "Design"], ans: 1 },
        { q: "CSS stands for?", options: ["Style Sheet", "Code Script", "None", "System"], ans: 0 }
    ],
    aptitude: [
        { q: "5 + 3 = ?", options: ["5", "8", "10", "12"], ans: 1 },
        { q: "10 * 2 = ?", options: ["20", "15", "25", "10"], ans: 0 }
    ],
    gk: [
        { q: "Capital of India?", options: ["Delhi", "Mumbai", "Chennai", "Kolkata"], ans: 0 },
        { q: "National Animal?", options: ["Tiger", "Lion", "Elephant", "Horse"], ans: 0 }
    ],
    science: [
        { q: "H2O is?", options: ["Oxygen", "Water", "Hydrogen", "Salt"], ans: 1 },
        { q: "Sun is a?", options: ["Planet", "Star", "Comet", "Moon"], ans: 1 }
    ]
};

let selectedTopic = null;
let questions = [];

let current = 0;
let score = 0;
let selected = null;

let reviewQueue = [];
let reviewIndex = 0;

let mode = "quiz";

let timer;
let timeLeft = 60;

// ---------------- TOPIC ----------------
function selectTopic(topic, event) {
    selectedTopic = topic;

    document.querySelectorAll(".topic")
        .forEach(t => t.classList.remove("active"));

    event.target.classList.add("active");

    document.getElementById("startBtn").disabled = false;
}

// ---------------- START ----------------
function startQuiz() {
    let num = parseInt(document.getElementById("numQ").value);
    const bank = questionBank[selectedTopic];

    let shuffled = [...bank].sort(() => Math.random() - 0.5);

    questions = [];
    while (questions.length < num) {
        for (let i = 0; i < shuffled.length && questions.length < num; i++) {
            questions.push(shuffled[i]);
        }
    }

    current = 0;
    score = 0;
    reviewQueue = [];
    mode = "quiz";

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    loadQuestion();
}

// ---------------- LOAD ----------------
function loadQuestion() {
    clearInterval(timer);
    timeLeft = 60;
    selected = null;

    let q = (mode === "quiz")
        ? questions[current]
        : reviewQueue[reviewIndex];

    document.getElementById("progress").innerText =
        mode === "quiz"
            ? `Q ${current + 1} / ${questions.length}`
            : `Review ${reviewIndex + 1} / ${reviewQueue.length}`;

    document.getElementById("question").innerText = q.q;

    const optDiv = document.getElementById("options");
    optDiv.innerHTML = "";

    q.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.classList.add("option");
        div.innerText = opt;

        div.onclick = () => {
            document.querySelectorAll(".option")
                .forEach(o => o.classList.remove("selected"));
            div.classList.add("selected");
            selected = i;
        };

        optDiv.appendChild(div);
    });

    updateStatus();
    startTimer();
}

// ---------------- TIMER ----------------
function startTimer() {
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) nextQuestion();
    }, 1000);
}

// ---------------- STATUS ----------------
function updateStatus() {
    let answered = current;
    let remaining = questions.length - current;
    let review = reviewQueue.length;

    document.getElementById("statusText").innerText =
        `Answered: ${answered} | Review: ${review} | Remaining: ${remaining}`;
}

// ---------------- NEXT ----------------
function nextQuestion() {
    submitAnswer();

    if (mode === "quiz") {
        current++;

        if (current < questions.length) loadQuestion();
        else startReview();
    } else {
        reviewIndex++;

        if (reviewIndex < reviewQueue.length) loadQuestion();
        else showResult();
    }
}

// ---------------- SUBMIT ----------------
function submitAnswer() {
    let q = (mode === "quiz")
        ? questions[current]
        : reviewQueue[reviewIndex];

    if (selected === q.ans) score++;

    clearInterval(timer);
}

// ---------------- SKIP ----------------
function skipQuestion() {
    clearInterval(timer);

    if (mode === "quiz") {
        current++;
        if (current < questions.length) loadQuestion();
        else startReview();
    } else {
        reviewIndex++;
        if (reviewIndex < reviewQueue.length) loadQuestion();
        else showResult();
    }
}

// ---------------- REVIEW ----------------
function markReview() {
    if (mode === "quiz") {
        reviewQueue.push(questions[current]);
    }
    skipQuestion();
}

function startReview() {
    if (reviewQueue.length > 0) {
        mode = "review";
        reviewIndex = 0;
        loadQuestion();
    } else {
        showResult();
    }
}

// ---------------- RESULT ----------------
function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("result").innerHTML = `
        <h2>Final Score</h2>
        <h3>${score} / ${questions.length}</h3>
        <p>Quiz Completed 🎉</p>
        <button onclick="location.reload()">Restart</button>
    `;
}