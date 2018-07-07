'use strict';

let studentNames = [
    'Grigol Tchkoidze 1',
    'Grigol Tchkoidze 2',
    'Grigol Tchkoidze 3',
    'Grigol Tchkoidze 4',
    'Grigol Tchkoidze 5',
    'Grigol Tchkoidze 6',
    'Grigol Tchkoidze 7',
    'Grigol Tchkoidze 8',
    'Grigol Tchkoidze 9',
    'Grigol Tchkoidze 10',
];

let studentCount = 10;
let techubStudents = [];

for (let i = 0; i < studentCount; i++) {
    techubStudents.push(new Student(studentNames[i], i));
}

function updateTotalGradeAvg() {
    let gradesTotal = 0;
    for (let student of techubStudents) {
        gradesTotal += student.getGradeAvg();
    }
    document.querySelector('#avg-grade').textContent =
        Math.round(gradesTotal / techubStudents.length * 10) / 10;
}

/* adds prmopt window on each grade box in newly added column*/
function addPromptWindows() {
    let gradeBoxes = Array.from(document.querySelectorAll('.grade__item'));
    for (let node of gradeBoxes) {
        node.addEventListener('click', gradePrompt); // !!!important (when used arrow function, prompt window appears on other columns more than once after deleting a column)
    }
}


let totalTechubStudents = document.querySelector('#tot-stud');

totalTechubStudents.dataset.count = techubStudents.length;
totalTechubStudents.textContent = totalTechubStudents.dataset.count;


let missedLessons = document.querySelector('#miss-less');



function gradePrompt() {
    // let studentGrade = myPrompt("Enter a Student's Grade");
    myPrompt("Enter a Student's Grade");
    let studentGrade;
    if (validateString(input.value)) {
        studentGrade = Math.round(Number(studentGrade));
        studentGrade = (studentGrade < 0) ? 0 : ((studentGrade > 5) ? 5 : studentGrade); // make sure grade is between 0 and 5;
        debugger;
        alert(studentGrade);
    }
    // if (isNaN(Number(studentGrade)) || studentGrade == '') { // if user enters an invalid string prompt again
    //     alert("Error! Please Enter a Number!");
    //     return gradePrompt.call(this);
    // }
    // if (studentGrade == null) return; // stop if user pressed ESC or Cancel

    debugger;
    setGradeAndColor.call(this, studentGrade); // set box color according to grade

    techubStudents[Number(this.dataset.id)]
        .setGrade(studentGrade, Number(this.parentElement.dataset.colIndex));
    if (studentGrade != 0) {
        if (this.dataset.missed == 'true') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = false;
        }
    } else {
        if (this.dataset.missed == 'false') {
            missedLessons.dataset.count = Number(missedLessons.dataset.count) + 1;
            missedLessons.textContent = missedLessons.dataset.count;
            this.dataset.missed = true;
        }
    }
    document.querySelector(`#stud-${this.dataset.id}`).textContent =
        techubStudents[Number(this.dataset.id)].getGradeAvg();
    updateTotalGradeAvg();
}



let promptWindow = document.querySelector('.prompt');

let promptOk = document.querySelector('#ok');

let promptCancel = document.querySelector('#cancel');

// promptOk.addEventListener('click', hide);

promptCancel.addEventListener('click', hidePrompt);

let promptButtons = document.querySelector('.prompt__buttons');

let promptContent = document.querySelector('.prompt__content');

let input = document.querySelector('.prompt__input');


function myPrompt(message) {
    input.value = '';

    promptWindow.classList.add('show'); // display prompt
    input.focus();

    let promptMessage = document.querySelector('.prompt__message'); // Insert message
    promptMessage.innerHTML = message;

    input.addEventListener('input', ({ target }) => validateString(target.value));
}

promptOk.addEventListener('click', () => {
    if (validateString(input.value))
        hidePrompt();
})


function validateString(val) {
    let popup = document.querySelector('.prompt__popup');
    if (isNaN(Number(val))) {
        popup.classList.add('show');
        return false;
    }
    popup.classList.remove('show');
    if (val == '') return false;
    return true;
}


function hidePrompt() {
    promptWindow.classList.remove('show');
}






/* newColumnObj is template for new column added by "Add Day" button */
let newColumnObj = {
    mainSelector: '.grades',
    parent: {
        element: 'div',
        index: 0,
        attributes: {
            'class': 'grade__col'
        }
    },
    firstChild: {
        element: 'div',
        content: '',
        attributes: {
            'class': 'grade__date'
        }
    },
    otherChilds: {
        element: 'div',
        count: 10,
        content: '0',
        attributes: {
            'class': 'grade__item',
            'data-missed': 'true'
        },
        uniqueIDs: true
    }
}


// Add event on mouse click to create new day in table
let addDayBtn = document.querySelector("#add-day");
addDayBtn.addEventListener('click', createNewDay);
addDayBtn.addEventListener('click', addPromptWindows);

// Add event on mouse click to remove last day from table
let removeDayBtn = document.querySelector("#rm-day");
removeDayBtn.addEventListener('click', removeLastDay);

let totalDays = document.querySelector('#tot-days'); // gets total days box reference node

function createNewDay() {
    totalDays.classList.toggle('animator');
    missedLessons.classList.toggle('animator');
    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hide');

    newColumnObj.firstChild.content = new Techubdate().getFullDate(); // to create new Techubdate every time user adds new day
    generateHTML(newColumnObj);
    newColumnObj.parent.index += 1;

    totalDays.dataset.count = Number(totalDays.dataset.count) + 1;
    totalDays.textContent = totalDays.dataset.count;

    missedLessons.dataset.count = Number(missedLessons.dataset.count) + techubStudents.length;
    missedLessons.textContent = missedLessons.dataset.count;

    for (let student of techubStudents) {
        student.pushGrade(0);
        document.querySelector(`#stud-${student.getID()}`).textContent =
            student.getGradeAvg();
    }
    updateTotalGradeAvg();
    setTimeout(() => {
        totalDays.classList.toggle('animator');
        missedLessons.classList.toggle('animator');
    }, 150);
}


let gradeTable = document.querySelector('.grades'); // gets grade table reference node

function removeLastDay() {
    totalDays.classList.toggle('animator');
    missedLessons.classList.toggle('animator');
    Techubdate.resetToPrevDate();
    newColumnObj.parent.index -= 1;

    for (let item of gradeTable.lastChild.children)
        if (item.dataset.missed == "true")
            missedLessons.dataset.count = Number(missedLessons.dataset.count) - 1;
    missedLessons.textContent = missedLessons.dataset.count;

    gradeTable.removeChild(gradeTable.lastChild); // removes last column (day) from grade table

    if (gradeTable.children.length == 0) removeDayBtn.classList.toggle('hide');

    totalDays.dataset.count = Number(totalDays.dataset.count) - 1;
    totalDays.textContent = totalDays.dataset.count;

    for (let student of techubStudents) {
        student.popGrade();
        document.querySelector(`#stud-${student.getID()}`).textContent =
            student.getGradeAvg();
    }
    updateTotalGradeAvg();
    setTimeout(() => {
        totalDays.classList.toggle('animator');
        missedLessons.classList.toggle('animator');
    }, 150);
}