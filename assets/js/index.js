var agreed = []; 
var disagreed = []; 
var noChoice = [];
var done = [];

var calculatedResults = null;
var selectParties = null;

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
    moreWeight = document.getElementById('moreWeight');

    agreed.push(subject);
    if (moreWeight.checked) agreed.push(subject);

    nextSubject(subject, 'agreed');
  });

  // Disagree button click event
  document.getElementById('disagreeButton').addEventListener('click', function () {
    moreWeight = document.getElementById('moreWeight');

    disagreed.push(subject);
    if (moreWeight.checked) agreed.push(subject);

    nextSubject(subject, 'disagreed');
  });

  // No choice button click event
  document.getElementById('nochoiceButton').addEventListener('click', function () {
    noChoice.push(subject);

    nextSubject(subject, 'noChoice');
  });

  // Skip button click event
  document.getElementById('skipButton').addEventListener('click', function () {
    nextSubject(subject);    
  });

  document.getElementById('previousButton').addEventListener('click', () => {
    previousSubject();
  })
}

function nextSubject(question, status) {
  if (status) {
    if (status === 'noChoice') noChoice.pop()
    if (status === 'disagreed') disagreed.pop()
    if (status === 'agreed') agreed.pop()
  }

  moreWeight = document.getElementById('moreWeight');
  if (moreWeight.checked) moreWeight.checked = false;

  done.push(question)
  subjectIndex++;

  if (subjectIndex > 0) document.getElementById('previousButton').classList.remove('w3-hide');

  if (done.length === subjects.length) {
    document.getElementById('buttons').classList.add('w3-hide');
    document.getElementById('subjectArea').classList.add('w3-hide');
    
    document.getElementById('results').classList.remove('w3-hide');

    if (selectParties) {
      showResults(selectParties);
    } else {
      showSelectParties();
    }

    return;
  }

  subject = subjects[subjectIndex];

  subjectArea.innerHTML = subject.statement;
}

function calculateResults() {
  moreWeight = document.getElementById('moreWeight');

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
  
  calculatedResults = parties;

  return parties;
}

function showResults(selectParties) {
  calculateResults();

  const result = calculatedResults;

  result.sort(function(a, b) {return b.points - a.points})

  for (var i = 0; i < result.length; i++) {
    if (selectParties === 'grote') {
      if (result[i].size < 10) {
        continue;
      }
    } else {
      if (!result[i].secular) {
        continue;
      }
    }

    var div = document.createElement('div');
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

function showSelectParties() {
  result = calculatedResults;
  document.getElementById('selectPartijen').classList.remove('w3-hide');

  document.getElementById('allePartijen').addEventListener('click', () => {
    selectParties = 'all';

    showResults(selectParties);
    document.getElementById('selectPartijen').classList.add('w3-hide');
  })

  document.getElementById('grotePartijen').addEventListener('click', () => {
    selectParties = 'grote';    

    showResults(selectParties);
    document.getElementById('selectPartijen').classList.add('w3-hide');
  })

  document.getElementById('seculierePartijen').addEventListener('click', () => {
    selectParties = 'seculiere';

    showResults(selectParties);

    document.getElementById('selectPartijen').classList.add('w3-hide');
  })
}
