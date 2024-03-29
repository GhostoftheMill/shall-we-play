//Left to fix
//timer start at x time
//time stop at endquiz
//maybe make choice class column?

// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

// sound effects
var sfxRight = new Audio('assets/correct.wav');
var sfxWrong = new Audio('assets/incorrect.wav');

let startTimer;

function startQuiz() {
    // hide start screen
    var startScreenEl = document.getElementById('quizbox');
    startScreenEl.setAttribute('class', 'hide');
    
    // un-hide questions section
    questionsEl.removeAttribute('class');
    //start timer (high)
    startTimer = setInterval(clockTick, 1000);
    //show starting time (high)
    timerEl.textContent = time;
    getQuestion();
}
    
function getQuestion() { //this function is going to get the data from the questions array
    // get current question object from array
    var currentQuestion = questions[currentQuestionIndex]
    
    // update title with current question
    var titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;
    
    // clear out any old question choices
    choicesEl.innerHTML = ''; //Study this later
    
    // create a for loop that creates the choice elements
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        // create new button for each choice
        var choice = currentQuestion.choices[i];
        var buttonEl = document.createElement('button')
        buttonEl.setAttribute('class', 'choice')
        buttonEl.setAttribute('value', choice)
        buttonEl.textContent = i + 1 + '.' + choice;
        choicesEl.appendChild(buttonEl)
    }
}
    
function questionClick(event) {
    var buttonEl = event.target;
    
    // if the clicked element is not a choice button, do nothing.
    if (!buttonEl.matches('.choice')) {
        return;
    }
    
    // check if user guessed right or wrong
    if (buttonEl.value !== questions[currentQuestionIndex].answer) { //replace true with a conditional statement that checks if the clicked choice button's value is the same as the questions[currentQuestionIndex]'s answer
    //incorrect answer scenario
    
    // penalize time
            time -= 20;
            sfxWrong.play();
        if (time < 0) {
            time = 0;
        }
        // display new time on page
        timerEl.textContent = time;
        feedbackEl.textContent = "Oops."
    } else {
        feedbackEl.textContent = "1up";
        sfxRight.play();
    }

    // flash right/wrong feedback on page
    feedbackEl.setAttribute('class', 'feedback');
    setTimeout(function () {
        feedbackEl.setAttribute('class', 'feedback hide');
    }, 3000)
        // move to next question
        currentQuestionIndex++;
    
    // check if we've run out of questions
    if (time <= 0 || currentQuestionIndex === questions.length) {
        quizEnd();
        
    } else {
        getQuestion();
    }
}
    
function quizEnd() {
        // stop clockTick for heaven's sake!!!
    clearInterval(startTimer);
        
    // show end screen
    var endScreenEl = document.getElementById('end-screen');
    endScreenEl.removeAttribute('class');
    
    // show final score
    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    
    // hide questions section
    questionsEl.setAttribute('class', 'hide');
    //timerEl.textContent = '0';
}
 
// update time    
function clockTick() {
    time--;
    timerEl.textContent = time;
    
    if (time <=0) {
       timerEl.textContent = '0';
    }
    //check if user ran out of time
    /*if (time <= 0) {
        quizEnd();  
    };*/
    /*if (time <= 0 || currentQuestionIndex === questions.length) {
        quizEnd();
        return;
        
    }*/ 
}
    
    
function saveHighscore() {
// get value of input box
    var initials = initialsEl.value.trim();
    
    // make sure value wasn't empty
    if (initials !== '') {
    
            //JSON.parse
            // get saved scores from localstorage (highscores), or if not any, set to empty array
        var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
    
            // format new score object for current user
        var newScore = {
            score: time,
            initials
        };
    
        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem('highscores', JSON.stringify(highscores));
    
        // redirect to next page
        window.location.href = 'highscore.html';
    }
}
    
function checkForEnter(event) {
    if (event.key === 'Enter') {
            saveHighscore();
    }
}
    
// user clicks button to submit initials
submitBtn.onclick = saveHighscore;
    
// user clicks button to start quiz
startBtn.onclick = startQuiz;
    
// user clicks on element containing choices
choicesEl.onclick = questionClick;
    
initialsEl.onkeyup = checkForEnter;