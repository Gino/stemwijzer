var agreed = []; 
var disagreed = []; 
var noChoice = [];
var done = [];

var subjectIndex = 0
var subject = subjects[subjectIndex];

window.onload = function () {
  const button = document.getElementById('startButton');
  const buttons = document.getElementById('buttons');
  const subjectArea = document.getElementById('subjectArea');

  // Start button click event
  button.addEventListener('click', function () {
    subjectArea.classList.remove('w3-hide');
    subjectArea.innerHTML = subject.statement;

    button.remove();
    buttons.classList.remove('w3-hide');
  })

  // Agree button click event
  document.getElementById('agreeButton').addEventListener('click', function () {
    agreed.push(subject);

    nextSubject(subject);
  });

  // Disagree button click event
  document.getElementById('disagreeButton').addEventListener('click', function () {
    disagreed.push(subject);

    nextSubject(subject);
  });

  // No choice button click event
  document.getElementById('nochoiceButton').addEventListener('click', function () {
    noChoice.push(subject);

    nextSubject(subject);
  });

  // Skip button click event
  document.getElementById('skipButton').addEventListener('click', function () {
    nextSubject(subject);    
  });

  document.getElementById('previousButton').addEventListener('click', () => {
    previousSubject();
  })
}

function nextSubject(question) {
  done.push(question)
  subjectIndex++;

  if (subjectIndex > 0) document.getElementById('previousButton').classList.remove('w3-hide');

  if (done.length === subjects.length) {
    document.getElementById('buttons').classList.add('w3-hide');
    document.getElementById('subjectArea').classList.add('w3-hide');
    
    document.getElementById('results').classList.remove('w3-hide');

    showResults();

    return;
  }

  subject = subjects[subjectIndex];

  subjectArea.innerHTML = subject.statement;
}

function calculateResults() {
  for (var i = 0; i < agreed.length; i++) {
    for (var x = 0; x < agreed[i].parties.length; x++) {
      for (var y = 0; y < parties.length; y++) {
        if (isNaN(parties[y].points)) parties[y].points = 0
        if (agreed[i].parties[x].name === parties[y].name) {

          if (agreed[i].parties[x].position === 'pro') parties[y].points += 1;
        }
      }
    }
  }

  for (var i = 0; i < disagreed.length; i++) {
    for (var x = 0; x < disagreed[i].parties.length; x++) {
      for (var y = 0; y < parties.length; y++) {
        if (isNaN(parties[y].points)) parties[y].points = 0
        if (disagreed[i].parties[x].name === parties[y].name) {

          if (disagreed[i].parties[x].position === 'pro') parties[y].points -= 1;
        }
      }
    }
  }

  for (var i = 0; i < noChoice.length; i++) {
    for (var x = 0; x < noChoice[i].parties.length; x++) {
      for (var y = 0; y < parties.length; y++) {
        if (isNaN(parties[y].points)) parties[y].points = 0
      }
    }
  }

  return parties;
}

function showResults() {
  const result = calculateResults();

  result.sort(function(a, b) {return b.points - a.points})

  for (var i = 0; i < result.length; i++) {
    var div = document.createElement("div");
    var percentage = Math.floor((result[i].points * 100) / subjects.length);
    var text = document.createTextNode(result[i].name + ' ' + percentage + '%');
    
    if (percentage > 0) {
      div.classList.add('w3-green')
      div.style.width = Math.floor(percentage) + '%';
    } else {
       div.classList.add('w3-red');
       div.style.width = -Math.floor(percentage) + '%';
    }
    div.appendChild(text);

    document.getElementById('results').appendChild(div);
  }
}

function previousSubject() {
  subjectIndex = subjectIndex - 1;
  if (subjectIndex === 0) document.getElementById('previousButton').classList.add('w3-hide');

  subject = subjects[subjectIndex];
  subjectArea.innerHTML = subject.statement;
}