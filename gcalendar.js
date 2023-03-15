const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    weekdays = document.querySelector(".weekdays"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
const daysName = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function CreateDays() {
    let sDays = "";
    for (let i = 0; i < daysName.length; i++) {
        sDays += `<div>${daysName[i]}</div>`;
    }
    weekdays.innerHTML = sDays;
}

const eventsArr = [];
getEvents();
console.log(eventsArr);

const getDayName = (day, date) => {
    const mydate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), day));
    const options = {weekday: "short"}
    return new Intl.DateTimeFormat("fr-Fr", options).format(mydate);
}
const isWeekend = (day, date) => {
    let dname = getDayName(day, date);
    return (dname === "sam." || dname === "dim.");
}

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
    const nowDay = new Date(year, month, 1);
    const prevDay = new Date(year, month, 0);
    const nextDay = new Date(year, month + 1, 0);

    const prevDays = prevDay.getDate();
    const lastDay = nextDay.getDate();
    const day = nowDay.getDay() - 1;
    let offset = (day > 5) ? 7 : 14;

    let nextDays = offset - nextDay.getDay();
    CreateDays();
    date.innerHTML = months[month] + " " + year;
    let sDays = "";

    for (let x = day; x > 0; x--) {
        sDays += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        //check if event is present on that day
        let event = false;
        const weekend = isWeekend(i, nowDay);
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });
        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            sDays += `<div class="day today active ${event === true ? 'event' : ''} ${weekend ? "weekend" : ''}" >${i}</div>`;

        } else {
            sDays += `<div class="day  active ${event === true ? 'event' : ''} ${weekend ? "weekend" : ''}" >${i}</div>`;
        }
    }
    for (let j = 1; j <= nextDays; j++) {
        sDays += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = sDays;
    addListner();
    unSelect();
}

//function to add month and year on prev and next button
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();
let bPress = false;
let startElement = null;
let endElement = null;

//function to add active on day
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener('mousedown', (e) => {
            // bPress = true;
            // day.classList.add("active");
            startElement = day;
            endElement = day;
            bPress = true;
            day.classList.add("active");
        });
        day.addEventListener('mouseover', (e) => {
            if (bPress) {
                unSelect();
                endElement = day;
                setSelected();
                day.classList.add("active");
            }
        });
        day.addEventListener('mouseup', (e) => {
            bPress = false;
            setTimeout(() => addEventWrapper.classList.add("active"), 500);
            console.log(startElement.innerText, endElement.innerText);
            startElement = null;
            endElement = null;
        });
        day.addEventListener("click", (e) => {
            getActiveDay(e.target.innerHTML);
            activeDay = Number(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));
            //if clicked prev-date or next-date switch to that month
            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                //add active to clicked day afte month is change
                setTimeout(() => {
                    //add active where no prev-date or next-date
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                //add active to clicked day afte month is changed
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
            }
        });
    });
}

function setSelected() {
    const days = document.querySelectorAll(".day");
    let startIndex = -2;
    let endIndex = -3;
    for (const [index, day] of days.entries()) {
        if (day === startElement) {
            startIndex = Number(startElement.innerText);
        }
        if (day === endElement) {
            endIndex = Number(endElement.innerText);
            break;
        }
    }

    return false;
}

todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
    console.log("here");
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(day) {
    const date = new Date(year, month, day);
    const dayName = getDayName(day, date);
    eventDay.innerHTML = dayName + " " + day + " " + months[month] + " " + year;
    eventDate.innerHTML = "";
    //eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
            <h3>Pas d'évènement</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    //unSelect();
    saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
    unSelect();
});

document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
        //  unSelect();
    }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});


function isEventExist(title) {
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((event) => {
                if (event.title === title) {
                    eventExist = true;
                }
            });
        }
    });
    return eventExist;
}

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "") {
        alert("Saisissez un nom pour le rendez-vous");
        return;
    }


    //check if event is already added
    let eventExist = isEventExist(eventTitle);
    if (eventExist) {
        alert("Ce rendez-vous existe déjà!");
        return;
    }

    const newEvent = {
        title: eventTitle,
        time: eventTimeFrom + " - " + eventTimeTo,
    };
    console.log(newEvent);

    let eventAdded = false;

    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    console.log(eventsArr);
    addEventWrapper.classList.remove("active");

    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title === eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    //if no events left in a day then remove that day from eventsArr
                    if (event.events.length === 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        //remove event class from day
                        const activeDayEl = document.querySelector(".day.active");
                        if (activeDayEl.classList.contains("event")) {
                            activeDayEl.classList.remove("event");
                        }
                    }
                }
            });
            updateEvents(activeDay);
        }
    }
});

//function to save events in local storage
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
    //check if events are already saved in local storage then return event else nothing
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}


function unSelect() {
    const days = document.querySelectorAll(".day")
    days.forEach((day) => {
        day.classList.remove("active");
    });
}
