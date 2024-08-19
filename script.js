const users = JSON.parse(localStorage.getItem("users")) || [];
const questions = JSON.parse(localStorage.getItem("questions")) || [];
let currUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const answersMarked = [];
let score = 0;

function showSignup() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("register").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function signup() {
  const username = document.getElementById("signup_username").value;
  const password = document.getElementById("signup_password").value;

  if (username && password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let userExists = users.some(user => user.username === username);

    if (userExists) {
      alert("Username already exists!");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Sign up successful!");
    showLogin();
  } else {
    alert("Please enter both username and password.");
  }
}

function login() {
  const username = document.getElementById("login_username").value;
  const password = document.getElementById("login_password").value;

  if (username && password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
      currUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      showCreateQuiz();
    } else {
      alert("Invalid username or password.");
    }
  } else {
    alert("Please enter both username and password.");
  }
}

function showCreateQuiz() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("createQuiz").classList.remove("hidden");
}

document.getElementById("quizForm1").addEventListener("submit", function (event) {
  event.preventDefault();
  const question = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const answer = document.getElementById("answer").value;

  if (question && option1 && option2 && option3 && answer) {
    questions.push({
      question,
      option1,
      option2,
      option3,
      answer,
      createdBy: currUser.username,
    });
    localStorage.setItem("questions", JSON.stringify(questions));
  } else {
    alert("Please enter all the fields.");
  }
  document.getElementById("quizForm1").reset();
});

function showQuestions() {
  document.getElementById("createQuiz").classList.add("hidden");
  document.getElementById("viewQuestions").classList.remove("hidden");
  viewUsers();
}

function viewUsers() {
  const usersWithQuestions = [...new Set(questions.map(q => q.createdBy))];
  const userList = document.getElementById("questions");
  userList.innerHTML = '<h2>Select a user to view their questions:</h2>';

  usersWithQuestions.forEach(user => {
    const userItem = document.createElement("div");
    userItem.classList.add("user-item");
    userItem.innerHTML = `<a href="#" onclick="viewQuestionsByUser('${user}')">${user}</a>`;
    userList.appendChild(userItem);
  });
}

function viewQuestionsByUser(username) {
  const userQuestions = questions.filter(q => q.createdBy === username);
  const questionList = document.getElementById("questions");
  questionList.innerHTML = `<h2>Questions by ${username}</h2>`;

  userQuestions.forEach((question, index) => {
    questionList.innerHTML += `
      <h3>Question ${index + 1}: ${question.question}</h3>
      <ul>
        <li>${question.option1}</li>
        <li>${question.option2}</li>
        <li>${question.option3}</li>
      </ul>`;
  });

  if (userQuestions.length > 0) {
    questionList.innerHTML += '<button onclick="startQuiz()">Start Quiz</button>';
  } else {
    questionList.innerHTML += '<p>No questions created yet by this user.</p>';
  }
}

function startQuiz() {
  document.getElementById("viewQuestions").classList.add("hidden");
  document.getElementById("startQuiz").classList.remove("hidden");
  takeQuiz();
}

function takeQuiz() {
  const selectedUserQuestions = document.getElementById("questions").querySelectorAll("h3");
  const quizContainer = document.getElementById("quiz_questions");
  quizContainer.innerHTML = '';

  selectedUserQuestions.forEach((questionElem, index) => {
    const questionText = questionElem.innerText.replace(`Question ${index + 1}: `, '');
    const question = questions.find(q => q.question === questionText);

    quizContainer.innerHTML += `
      <h3>${question.question}</h3>
      <div>
        <input value="${question.option1}" type="radio" name="answer${index}">${question.option1}</input><br>
        <input value="${question.option2}" type="radio" name="answer${index}">${question.option2}</input><br>
        <input value="${question.option3}" type="radio" name="answer${index}">${question.option3}</input><br>
      </div>`;
  });

  if (selectedUserQuestions.length > 0) {
    quizContainer.innerHTML += '<button onclick="getAnswers()">Submit</button>';
  } else {
    quizContainer.innerHTML += '<p>No questions to display for the quiz.</p>';
  }
}

function getAnswers() {
  const selectedUserQuestions = document.getElementById("questions").querySelectorAll("h3");
  answersMarked.length = 0; // Clear previous answers
  score = 0;

  selectedUserQuestions.forEach((questionElem, index) => {
    const questionText = questionElem.innerText.replace(`Question ${index + 1}: `, '');
    const question = questions.find(q => q.question === questionText);
    const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);

    if (selectedAnswer && selectedAnswer.value === question.answer) {
      score++;
    }
  });

  showScore(selectedUserQuestions.length);
}

function showScore(totalQuestions) {
  document.getElementById("startQuiz").classList.add("hidden");
  document.getElementById("score").classList.remove("hidden");
  document.getElementById("score").innerHTML = `Your score is ${score} out of ${totalQuestions}`;
}