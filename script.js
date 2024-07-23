// User data (in-memory, for demonstration purposes)
const users = {};
let currentUser = null;
const quizzes = {};

// Show login form
function showLogin() {
    const authDiv = document.getElementById('auth');
    authDiv.innerHTML = `
        <h2>Login</h2>
        <input type="text" id="login-username" placeholder="Username">
        <button onclick="login()">Login</button>
    `;
}

// Show registration form
function showRegister() {
    const authDiv = document.getElementById('auth');
    authDiv.innerHTML = `
        <h2>Register</h2>
        <input type="text" id="register-username" placeholder="Username">
        <button onclick="register()">Register</button>
    `;
}

// Register a new user
function register() {
    const username = document.getElementById('register-username').value;
    if (username in users) {
        alert('User already exists');
    } else {
        users[username] = { username };
        alert('Registration successful');
        showLogin();
    }
}

// Login user
function login() {
    const username = document.getElementById('login-username').value;
    if (username in users) {
        currentUser = username;
        document.getElementById('auth').innerHTML = `
            <p>Welcome, ${currentUser}</p>
            <button onclick="logout()">Logout</button>
        `;
        document.getElementById('quiz-options').style.display = 'block';
    } else {
        alert('User not found');
    }
}

// Logout user
function logout() {
    currentUser = null;
    document.getElementById('auth').innerHTML = `
        <button onclick="showLogin()">Login</button>
        <button onclick="showRegister()">Register</button>
    `;
    document.getElementById('quiz-options').style.display = 'none';
}

// Show create quiz form
function showCreateQuiz() {
    document.getElementById('app').innerHTML = `
        <h2>Create a New Quiz</h2>
        <input type="text" id="quiz-name" placeholder="Quiz Name"><br>
        <div id="questions">
            <div class="question">
                <input type="text" placeholder="Question" class="question-text"><br>
                <input type="text" placeholder="Option 1" class="question-option"><br>
                <input type="text" placeholder="Option 2" class="question-option"><br>
                <input type="text" placeholder="Option 3" class="question-option"><br>
                <input type="text" placeholder="Option 4" class="question-option"><br>
                <input type="text" placeholder="Correct Answer" class="question-correct-answer"><br>
            </div>
        </div>
        <button onclick="addQuestion()">Add Another Question</button><br>
        <button onclick="createQuiz()">Create Quiz</button>
    `;
}

// Add another question to the quiz
function addQuestion() {
    const questionsDiv = document.getElementById('questions');
    const newQuestionDiv = document.createElement('div');
    newQuestionDiv.classList.add('question');
    newQuestionDiv.innerHTML = `
        <input type="text" placeholder="Question" class="question-text"><br>
        <input type="text" placeholder="Option 1" class="question-option"><br>
        <input type="text" placeholder="Option 2" class="question-option"><br>
        <input type="text" placeholder="Option 3" class="question-option"><br>
        <input type="text" placeholder="Option 4" class="question-option"><br>
        <input type="text" placeholder="Correct Answer" class="question-correct-answer"><br>
    `;
    questionsDiv.appendChild(newQuestionDiv);
}

// Create quiz and store it
function createQuiz() {
    const quizName = document.getElementById('quiz-name').value;
    const questions = document.querySelectorAll('.question');
    const quiz = { quizName, questions: [] };

    questions.forEach(question => {
        const questionText = question.querySelector('.question-text').value;
        const options = Array.from(question.querySelectorAll('.question-option')).map(opt => opt.value);
        const correctAnswer = question.querySelector('.question-correct-answer').value;
        quiz.questions.push({ questionText, options, correctAnswer });
    });

    const quizId = `quiz-${Object.keys(quizzes).length + 1}`;
    quizzes[quizId] = quiz;

    alert('Quiz created successfully!');
    showQuizListing();
}

// Show list of quizzes
function showQuizListing() {
    let quizList = '<h2>Available Quizzes</h2><ul>';
    for (const quizId in quizzes) {
        quizList += `<li><button onclick="takeQuiz('${quizId}')">${quizzes[quizId].quizName}</button></li>`;
    }
    quizList += '</ul>';

    document.getElementById('app').innerHTML = quizList;
}

// Take a quiz
function takeQuiz(quizId) {
    const quiz = quizzes[quizId];
    let quizForm = `<h2>${quiz.quizName}</h2><form id="quiz-form">`;

    quiz.questions.forEach((question, index) => {
        quizForm += `<div>
            <p>${question.questionText}</p>
            ${question.options.map(option => `<label><input type="radio" name="question-${index}" value="${option}">${option}</label><br>`).join('')}
        </div>`;
    });

    quizForm += '<button type="button" onclick="submitQuiz(\'' + quizId + '\')">Submit Quiz</button></form>';

    document.getElementById('app').innerHTML = quizForm;
}

// Submit quiz and show results
function submitQuiz(quizId) {
    const quiz = quizzes[quizId];
    const form = document.getElementById('quiz-form');
    const userAnswers = Array.from(form.elements).filter(el => el.checked).map(el => el.value);
    let score = 0;

    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === userAnswers[index]) {
            score++;
        }
    });

    let resultHtml = `<h2>Quiz Results</h2><p>Your score: ${score} / ${quiz.questions.length}</p>`;
    resultHtml += '<h3>Correct Answers:</h3><ul>';
    quiz.questions.forEach((question, index) => {
        resultHtml += `<li>Question ${index + 1}: ${question.correctAnswer}</li>`;
    });
    resultHtml += '</ul>';

    document.getElementById('app').innerHTML = resultHtml;
}
