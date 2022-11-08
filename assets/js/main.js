var QUESTIONS = [
  {
    question: "To see if two variables are equal in an if / else statement you would use ____.",
    options: ["a. =", "b. ==", "c. 'equals'", "d. !="],
    answer: 1
  },
  {
    question: "The first index of an array is ____.",
    options: ["a. 0", "b. 1", "c. 8", "d. any "],
    answer: 0
  },
  {
    question: "Who invented JavaScript?",
    options: ["a. Douglas Crockford", "b. Sheryl Sandberg", "c. Brendan Eich", "d. Ben Javascript "],
    answer: 2
  },
  {
    question: "How to write an IF statement in JavaScript?",
    options: ["a. if i == 5 then", "b. if i = 5 then", "c. if(i == 5)", "d. if i = 5  "],
    answer: 2
  },
  {
    question: "How do you add a comment in a JavaScript?",
    options: ["a. //This is a comment", "b. <!--This is a comment-->", "c. 'This is a comment", "d.   * This is a comment *"],
    answer: 0
  },
  {
    question: "Which event occurs when the user clicks on an HTML element?",
    options: ["a. onclick", "b. onchange", "c. onmouseover", "d. onmouseclick "],
    answer: 0
  },
  {
    question: "String values must be enclosed within _____ when being assigned to variables.",
    options: ["a. commas", "b. curly brackets", "c. quotes", "d. parenthesis"],
    answer: 2
},
{
  question: "Arrays in JavaScript can be used to store _____.",
  options: ["a. numbers and strings", "b. other arrays", "c. booleans", "d. all of the above"],
  answer: 1
},
{
  question: "Commonly used data types DO NOT include:",
  options: ["a. strings", "b. booleans", "c. alerts", "d. numbers"],
  answer: 2
},
{
  question: "How do you create a function in JavaScript?",
  options: ["a. function = myFunction()", "b. function myFunction()", "c. function:myFunction()", "d. createMyFunction()"],
  answer: 1
},
{
  question: "How do you call a function named myFunction?",
  options: ["a. call myFunction()", "b. call function myFunction()", "c. myFunction()", "d. call myFunction"],
  answer: 2
},

 
];
//time 
var QUESTIONS_COUNT = QUESTIONS.length;
var QUIZ_DURATION_SECS = 70;
var WRONG_ANS_PENALTY_SECS = 10;
var TIMEOUT_BETWEEN_QUESTION_SECS = 1;
//btn
var showHighScoresTextSpan = document.querySelector('.show-high-scores-text');
var timerTextWrapperSpan = document.querySelector('.timer-text-wrapper');
var timerTextSpan = document.querySelector('.timer-text');
var startGameContainer = document.querySelector('.start-game-container');
var quizForm = document.querySelector('.quiz-form');
var quizEndForm = document.querySelector('.quiz-end-form');
var highScoresContainer = document.querySelector('.high-scores-container');
var quizScreens = [startGameContainer, quizForm, quizEndForm, highScoresContainer];
var startGameBtn = document.querySelector('.start-game-btn');
var quizQuestionDiv = document.querySelector('.quiz-question');
var quizOptionsWrapper = document.querySelector('.quiz-options-wrapper');
var quizQuestionVerdictPara = document.querySelector('.quiz-question-verdict');
var scoredPointsTextSpan = document.querySelector('.scored-points-text');
var saveScoreNameInp = document.querySelector('.save-score-name-inp');
var highScoresTbody = document.querySelector('.high-scores-tbody');
var goBackBtn = document.querySelector('.go-back-btn');
var clearHighScoresBtn = document.querySelector('.clear-high-scores-btn');

let game = {};
let timer;

function start() {
  hideAllQuizScreens();
  quizForm.classList.remove('d-none');
  timerTextWrapperSpan.classList.remove('d-none');

  game = {
    questionIdx: -1,
    score: 0,
    penalty: 0,
    startedAt: new Date()
  };

  startTimer();
  next();
}

function startTimer() {
  timer = setInterval(function(){
    const spentTime = Math.floor((new Date().getTime() - game.startedAt.getTime()) / 1000) + (game.penalty);
    const remainingTime = QUIZ_DURATION_SECS - spentTime;
    if(remainingTime < 0) {
      end();
      clearInterval(timer);
    } else {
      timerTextSpan.innerText = remainingTime;
    }
  }, 100);
}

function next() {
  game.questionIdx++;

  if(game.questionIdx == QUESTIONS_COUNT) {
    end();
    return;
  }

  quizQuestionDiv.innerText = QUESTIONS[game.questionIdx].question;
  quizOptionsWrapper.innerHTML = '';
  QUESTIONS[game.questionIdx].options.forEach(function(option, idx){
    var div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `<input type="radio" id="option-inp-${idx}" class="d-none" name="option-inp" value="${idx}">
    <label for="option-inp-${idx}">${option}</label>`;
    quizOptionsWrapper.appendChild(div);
  });
  quizQuestionVerdictPara.innerText = '';

  const optionInps = document.querySelectorAll('[name="option-inp"]');
  optionInps.forEach(function(optionInp){
    optionInp.addEventListener('change', check);
  });
}

function check() {
  const selectedOption = this.value;

  const correctOptionLabel = document.querySelector(`[name="option-inp"][value="${QUESTIONS[game.questionIdx].answer}"] + label`);
  const selectedOptionLabel = document.querySelector(`[name="option-inp"][value="${selectedOption}"] + label`);
  correctOptionLabel.classList.add('correct');
  
  if(selectedOption == QUESTIONS[game.questionIdx].answer) { // correct
    game.score++;
    quizQuestionVerdictPara.className = 'quiz-question-verdict text-success';
    quizQuestionVerdictPara.innerText = 'Correct!';
  } else { // wrong
    game.penalty += WRONG_ANS_PENALTY_SECS;
    selectedOptionLabel.classList.add('wrong');
    quizQuestionVerdictPara.className = 'quiz-question-verdict text-danger';
    quizQuestionVerdictPara.innerText = 'Wrong!';
  }

  setTimeout(function() {
    next();
  }, TIMEOUT_BETWEEN_QUESTION_SECS * 1000);
}

function end() {
  hideAllQuizScreens();
  quizEndForm.classList.remove('d-none');
  saveScoreNameInp.value = '';
  timerTextWrapperSpan.classList.add('d-none');
  clearInterval(timer);
  scoredPointsTextSpan.innerText = game.score;
}

function saveScoreHandler(e) {
  e.preventDefault();
  const name = saveScoreNameInp.value;
  const score = game.score;
  const savedScores = JSON.parse(localStorage.getItem('saved-scores')) || [];
  savedScores.push({ name, score });
  localStorage.setItem('saved-scores', JSON.stringify(savedScores));
  showHighScores();
}

function showHighScores() {
  hideAllQuizScreens();
  highScoresContainer.classList.remove('d-none');

  const savedScores = JSON.parse(localStorage.getItem('saved-scores')) || [];
  const savedScoresSorted = savedScores.sort(function(a, b){
    return b.score - a.score;
  });
  
  highScoresTbody.innerHTML = '';
  savedScoresSorted.forEach(function(savedScore, idx){
    const tr = document.createElement('tr');
    tr.className = 'high-scores-tr';
    tr.innerHTML = `<td class="high-scores-td">${idx + 1}</td>
    <td class="high-scores-td">${savedScore.name}</td>
    <td class="high-scores-td">${savedScore.score}</td>`;
    highScoresTbody.appendChild(tr);
  });
}

function goBackHandler() {
  hideAllQuizScreens();
  startGameContainer.classList.remove('d-none');
}

function clearHighScores() {
  localStorage.removeItem('saved-scores');
  highScoresTbody.innerHTML = '';
}

function hideAllQuizScreens() {
  quizScreens.forEach(function(quizScreen){
    quizScreen.classList.add('d-none');
  });
}

startGameBtn.addEventListener('click', start);
quizEndForm.addEventListener('submit', saveScoreHandler);
goBackBtn.addEventListener('click', goBackHandler);
clearHighScoresBtn.addEventListener('click', clearHighScores);
showHighScoresTextSpan.addEventListener('click', showHighScores);