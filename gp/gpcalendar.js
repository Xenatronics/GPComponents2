Number.prototype.zeroPad = function (length) {
    length = length || 2; // defaults to 2 if no parameter is passed
    return (new Array(length).join('0') + this).slice(length * -1);
};

String.prototype.toTimestamp = function (date) {
    date = date.split("-");
    let newDate = new Date(date[0], date[1] - 1, date[2]);//YYY MM DD
    return (newDate.getTime());
}

class GPEventRange {
    constructor(start, end, title = "") {
        this._id = this._id.toTimestamp(start);
        this._start = start;
        this._end = end;
        this._title = title;
    }

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get end() {
        return this._end;
    }

    set end(value) {
        this._end = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get id() {
        return this._id;
    }

}

const toDate = (_date) => {
    let date = _date.split("-");
    return new Date(date[0], date[1] - 1, date[2]);//YYY MM DD
};

class GPCalendar extends HTMLElement {

    static get observedAttributes() {
        return ['date', "start", "end"];
    }

    constructor(actualDate = null) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.eventsArr = [];
        this.arrHolidays = [];
        this.bPress = false;
        this.startElement = null;
        this.endElement = null;
        //this.activeDay = null;
        this.daysName = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
        this.months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        this.calendar = null;
        if (actualDate == null) this.nowDay = new Date(); else this.nowDay = actualDate;
        this._month = this.nowDay.getMonth();
        this._year = this.nowDay.getFullYear();
        this.arrayDays = [];
    }

    setDate(date) {
        this.nowDay = date;
        this.render();
    }

    setStart(sDate) {
        this.startDate = sDate;
        const arr = Array.from(this.daysContainer);
    }

    setEnd(eDate) {
        this.endDate = eDate;
    }

    createDaysName() {
        let sDays = "";
        for (let i = 0; i < this.daysName.length; i++) {
            sDays += `<div>${this.daysName[i]}</div>`;
        }
        this.weekdays.innerHTML = sDays;
    }

    connectedCallback() {
        this.shadow.innerHTML = `   
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous"/>
        </head>           
        <style>            
            :root {
                --color1: #cc9bfa;
                --color2: #84399d;
                --carre:14.28%;
                --color5: #d4bbfd;
                --color3: #47317a;
                --color4: #31186a;
                --h:45px;
                --w:100%;
                --gapx:5px;
                --nb:2;
            }
            * {                
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Poppins", "Arial","sans-serif";
            }
            /* nice scroll bar */
            ::-webkit-scrollbar {
                width: 5px;
            }
            ::-webkit-scrollbar-track {
                background: #f5f5f5;
                border-radius: 50px;
            }
            ::-webkit-scrollbar-thumb {
                background: var(--color1);
                border-radius: 50px;
            }
            body {
                position: relative;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom: 30px;
                background-color: #e2e1dc;
            }
            .container {
                position: relative;
                width: 100%;
                min-height: 750px;
                margin: 0 auto;
                padding: 15px;
                color: #fff;
                display: flex;
                border-radius: 10px;
                background-color: #373c4f;
            }
            .date{
                width:300px;
            }
            .calendar {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                justify-content: start;
                color: #878895;
                border-radius: 5px;
                background-color: #fff;
                padding-bottom:5px;
            }
            .calendar::after{
                content:"";
                position: absolute;
                width:100%;
                height:4px;
                margin-bottom:10px;
                background-color: var(--color2);
            }
            .month_name {
                width: 100%;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align:center;
                padding: 0 20px;
                font-size: 1.2rem;
                font-weight: 500;
                text-transform: capitalize;
            }
            .prev,
            .next {
                cursor: pointer;
            }
            .prev:hover,
            .next:hover {
                color: #cc9bfa;
            }
            .weekdays {
                width: 100%;
                height: 58px;
                display: flex;
                align-items: center;
                justify-content: start;
                padding: 0 20px;
                font-size: 1rem;
                font-weight: 500;
                text-transform: capitalize;
            }
            .weekdays div {
                width: var(--carre);
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .days {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: start;
                padding: 0 20px;
                font-size: 1rem;
                font-weight: 500;
                margin-bottom: 20px;
            }
            .day {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 3px;
                width: var(--carre);
                height:100px;               
                color: var(--color2);
                border: 1px solid #f5f5f5;
            }
            .weekend{                
                color:  var(--color1);
            }            
            .prev-btn,
            .next-btn {
                color: #4d4d4d;   
                padding:8px 22px;                
            }            
            .prev-btn:hover,
            .next-btn:hover {
                color: #9d5ab9;                           
            }
            .active {
                position: relative;                
                background-color: #e4c7ffc7;
                border: 1px solid #4a266e;
                border-radius: 4px;
            }
            .sel-active {
                position: relative;
                font-size: 1rem;                
                background-color: var(--color5);
            }            
            .today {
                font-size: 1.1rem;
                background:#f3e5f5b0;    
                border-radius: 4px;            
            }   
            .event{
                text-align: left;
                position: relative;
                display: flex;
                align-items: start;   
                top:50%;
                bottom: 10%;
                width: calc(var(--nb)*100%);      
                left: 0;   
                height: 20px;
                filter: brightness(4);
                background-color: var(--color2);
                color: white;
                z-index: 1;      
                border-radius: 8px;         
            }
            .event:hover{
                /*background-color: tomato;*/
                filter: brightness(.9);
                cursor:pointer;                
            }     
            .event::after, .event::before{
                clear: both;
                content: "";
                display: table;
            }                   
            .day-inner{
            
            }                                   
            .events {
                width: 100%;
                height: 100%;
                max-height: 600px;
                overflow-x: hidden;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                padding-left: 4px;                
            }          
            button {
                padding: 5px 10px;
                border: 1px solid var(--color1);
                border-radius: 5px;
                background-color: transparent;
                cursor: pointer;
                color: var(--color1);
            }
            button:hover {
                color: #fff;
                background-color: var(--color1);
            }
            .spacer{
                width:150px;
            }            
            .prev-date, .next-date{
                color:#8e8e8e;
            }
            /* pour éviter les sélections intempestives */
            .noselect {
            -webkit-touch-callout: none;
                /* iOS Safari */
                -webkit-user-select: none;
                /* Safari */
                -khtml-user-select: none;
                /* Konqueror HTML */
                -moz-user-select: none;
                /* Firefox */
                -ms-user-select: none;
                /* Internet Explorer/Edge */
                user-select: none;
                /* Non-prefixed version, currently
                supported by Chrome and Opera */
            }
            .holidays{
                background: #523e81;
            }
            /*.day:nth-child(7n + 1) {*/
            /*    border-left: 2px solid #f5f5f5;*/
            /*}           */
            
        </style>        
        <div class="calendar noselect">        
            <div class="month_name">
                <button class="today-btn">Aujourd'hui</button>
                <div class="spacer"></div>
                <div class="prev prev-btn"><i class="fas fa-arrow-left"></i></div>                                                    
                <div class="date">december 2015</div>
                <div class="next next-btn"><i class="fas fa-arrow-right"></i></div>     
                <div class="spacer"></div>                   
            </div>                
            <div class="weekdays"></div>
            <div class="days"></div>            
        </div>              
        `;
        //
        this.calendar = this.shadow.querySelector(".calendar");
        this.date = this.shadow.querySelector(".date");
        this.weekdays = this.shadow.querySelector(".weekdays");
        this.daysContainer = this.shadow.querySelector(".days");
        //
        this.prev = this.shadow.querySelector(".prev");
        this.next = this.shadow.querySelector(".next");
        //
        this.todayBtn = this.shadow.querySelector(".today-btn");
        this.getEvents();
        this.render();
        this.initEvent();
        this.unSelect();
    }
    disconnectedCallback() {
        this.resetEvent();
    }

    isHoliday = (date) => {
        if (this.arrHolidays.length === 0) return;
        return (this.arrHolidays.find(val => val.date === date) !== undefined);
    }
    isToday = (day) => {
        return (day === new Date().getDate() && this._year === new Date().getFullYear() && this._month === new Date().getMonth());
    }

    isEventDay = (date) => {
        let obj = this.eventsArr.find((val) => {
            return (val.day === date.getDate() && val.month === date.getMonth()+1 && val.year === date.getFullYear());
        });
        return (obj !== undefined);
    }
    getEventDayTitle = (date) => {
        return this.eventsArr.find((val) => (val.day === date.getDate() && val.month === date.getMonth()+1 && val.year === date.getFullYear()));
    }


    updateEvents(date) {
        let event = this.eventsArr.find(val => val.day === date.getDate() && val.month === date.getMonth() && val.year === date.getFullYear());
        let index = -1

        if (this.startElement !== null) {
            index = this.startElement.getAttribute("indx");
            this.dispatchEvent(new CustomEvent('onEvent', {
                bubbles: true, detail: {value: event, index: index}
            }));
        }

    }


    render() {
        this.firstDay = new Date(this._year, this._month, 1);
        this.prevDay = new Date(this._year, this._month, 0);
        this.presentDay = new Date(this._year, (this._month + 1), 0);
        //
        const nbPrevDays = this.prevDay.getDate();
        const nbNowDay = this.presentDay.getDate();
        //
        let d = this.firstDay.getDay();
        if (d === 0) {
            d = 7;
        }
        const day = nbPrevDays - d + 2;
        const delta = (nbPrevDays - day) + 1;
        let offset = 42 - (nbNowDay + delta);
        if (offset === 0) offset = 7;

        this.createDaysName();
        this.date.innerHTML = this.months[this._month] + " " + this._year;
        let sDays = ``;
        let index = 0;
        for (let i = day; i <= nbPrevDays; i++) {
            let _date=new Date(this._year, this._month - 2, i);
            let isEvent = this.isEventDay(_date);
            sDays += `<div indx='${index}' dDate="${this._year}-${(this._month).zeroPad(2)}-${i.zeroPad(2)}" class="day prev-date">${i}<div class="day-inner ${isEvent === true ? 'event' : ''} "></div></div>`;
            index++;
        }
        for (let i = 1; i <= nbNowDay; i++) {
            //check if event is present on that day
            let _date=new Date(this._year, this._month - 1, i);
            const weekend = this.isWeekend(i, this.nowDay);
            let isEvent = this.isEventDay(_date);
            if (isEvent){
                let _event=this.getEventDayTitle(_date);
            }
            let today = this.isToday(i);
            if (today) {
                this.getActiveDay(_date);
                this.updateEvents(_date);
            }
            sDays += `<div indx='${index}' dDate="${this._year}-${(this._month + 1).zeroPad(2)}-${i.zeroPad(2)}" class="day ${today === true ? 'today' : ''} ${weekend ? "weekend" : ''}" >${i}<div class="day-inner ${isEvent === true ? 'event' : ''} "></div></div>`;
            index++;
        }
        for (let i = 1; i <= offset; i++) {
            let _date=new Date(this._year, this._month, i);
            let isEvent = this.isEventDay(_date);
            sDays += `<div indx='${index}' dDate="${this._year}-${(this._month + 2).zeroPad(2)}-${i.zeroPad(2)}" class="day next-date">${i}<div class="day-inner ${isEvent === true ? 'event' : ''} "></div></div>`;
            index++;
        }
        this.daysContainer.innerHTML = sDays;
        this.days = this.shadow.querySelectorAll(".day");
        this.events = this.shadow.querySelectorAll(".event");
        this.addDayListener();
    }

    getDayName = (day, date, short = true) => {
        try {
            const mydate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), day));

            const options = (short === true) ? {weekday: "short"} : {weekday: "long"};
            return new Intl.DateTimeFormat("fr-Fr", options).format(mydate);
        } catch (e) {
        }
    }

    isWeekend = (day, date) => {
        let d = new Date(this._year, this._month, day).getDay();
        return (d === 0 || d === 6);
    }

    prevMonth() {
        this._month--;
        if (this._month < 0) {
            this._month = 11;
            this._year--;
        }
        this.render();
        this.updateEvents(new Date(this._year, this._month - 1, 1));
    }

    nextMonth() {
        this._month++;
        if (this._month > 11) {
            this._month = 0;
            this._year++;
        }
        this.render();
        this.updateEvents(new Date(this._year, this._month - 1, 1));
    }

    resetEvent() {
        this.prev.removeEventListener("click");
        this.next.removeEventListener("click");
        this.todayBtn.removeEventListener("click");
        this.events.forEach(event => {
            event.removeEventListener("click")
        });
    }

    initEvent() {
        this.prev.addEventListener("click", () => {
            this.prevMonth();
        });
        this.next.addEventListener("click", () => {
            this.nextMonth();
        });
        this.todayBtn.addEventListener("click", () => {
            this._month = this.nowDay.getMonth();
            this._year = this.nowDay.getFullYear();
            this.render();
        });
    }

    getArrEvents() {
        return this.eventsArr;
    }

    getActiveDay(date) {
        // const date = new Date(this._year, Number(this._month - 1), day);
        const dayName = this.getDayName(date.getDate(), date, false);
        let sDate = dayName + " " + date.getDate() + " " + this.months[Number(date.getMonth())] + " " + date.getFullYear();
        this.dispatchEvent(new CustomEvent('showDate', {
            bubbles: true, detail: {value: sDate, date: date}
        }));
    }

    toDay() {
        const date = new Date();
        const dayName = this.getDayName(date.getDate(), date, false);
        let sDate = dayName + " " + date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
        this.dispatchEvent(new CustomEvent('showDate', {
            bubbles: true, detail: {value: sDate, date: date}
        }));
    }

    unSelect() {
        for (let i = 0; i < this.days.length; i++) {
            this.days[i].classList.remove("sel-active");
            this.days[i].classList.remove("active");
        }
    }

    log(text) {
        this.dispatchEvent(new CustomEvent('log', {
            bubbles: true, detail: {value: text}
        }));
    }

    setSelection() {
        let startDate = this.startElement?.getAttribute('dDate');
        let endDate = this.endElement?.getAttribute('dDate');
        this.dispatchEvent(new CustomEvent('onSelection', {
            bubbles: true, detail: {start: startDate, end: endDate}
        }));
    }

    saveEvents() {
        localStorage.setItem("events", JSON.stringify(this.eventsArr));
    }

    async loadEvents(json_file) {
        this.eventsArr = [];
        localStorage.events = [];
        try {
            let rep = await fetch(json_file);
            this.eventsArr = await rep.json();

            this.saveEvents();// en localStorage
        } catch (e) {
            console.log(e);
        }
    }

    //function to get events from local storage
    getEvents() {
        this.eventsArr = [];

        //check if events are already saved in local storage then return event else nothing
        if (localStorage.getItem("events") === null) {
            return;
        }
        try {
            this.eventsArr.push(...JSON.parse(localStorage.getItem("events")));
        } catch (e) {
            console.log(e);
        }
    }

    detectIndices() {
        this.days = this.shadow.querySelectorAll(".day");
        let start = Number(this.startElement.getAttribute("indx"));
        let end = Number(this.endElement.getAttribute("indx"));

        if (start === end) {
            this.unSelect();
            this.endElement.classList.add("active");
            this.startElement.classList.add("active");
        } else {
            for (let i = Math.min(start, end); i < Math.max(start, end); i++) {
                this.days[i].classList.add("sel-active");
            }
            this.startElement.classList.add("sel-active");
            this.endElement.classList.add("active");
        }
    }

    addDayListener() {

        this.days.forEach((day) => {
            day.addEventListener('mousedown', (e) => {
                let elem = e.target;
                if (elem.classList.contains("day-inner"))
                    elem = e.target.parentElement;
                this.bPress = true;
                this.startElement = elem;
                this.endElement = elem;
            });
            day.addEventListener('mouseover', (e) => {
                let elem = e.target;
                if (elem.classList.contains("day-inner")) {
                    elem = e.target.parentElement;
                }
                if (this.bPress) {
                    this.unSelect();
                    this.endElement = elem;
                    this.detectIndices();
                }
            });
            day.addEventListener('mouseup', (e) => {
                let elem = e.target;
                if (elem.classList.contains("day-inner")) {
                    elem = e.target.parentElement;
                }
                this.endElement = elem;
                this.setSelection();
                this.bPress = false;
                elem.classList.add("active");
            });
            day.addEventListener("click", (e) => {
                let elem = e.target;
                if (elem.classList.contains("day-inner"))
                    elem = e.target.parentElement;

                this.day = Number(elem.innerText);
                this._date = elem.getAttribute('dDate')
                this.tab = this._date.split('-');

                //this._month = Number(this.tab[1]) - 1;
                this.getActiveDay(toDate(this._date));
                this.startElement = elem;
                this.endElement = elem;
                this.detectIndices();
                this.unSelect();
                //
                e.target.classList.add("active");
                this.updateEvents(toDate(this._date));
            });
        });
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "date" && oldvalue !== newvalue) {
            this.setDate(newvalue);
            this.render();
        }
        if (name === "start" && oldvalue !== newvalue) {
            this.setStart(newvalue);
        }
        if (name === "end" && oldvalue !== newvalue) {
            this.setEnd(newvalue);
        }
    }

    getDayByText(elem) {
        let m = elem.getAttribute("dDate");
        let d = elem.innerText;
        return (this.arrayDays.find(val => val.day === d && val.month === m));

    }

    findEvent(event) {
        return this.eventsArr.find((val) => val.day === event.day && val.month === event.month && val.year === event._year);
    }

    removeEventByTitle(event) {
        let messages = event.message.split(" - ");
        let _dateS = messages[0].split("-");
        let _event = this.eventsArr.find((val) => val.day === Number(_dateS[2]) && val.month === Number(_dateS[1]) - 1 && val.year === Number(_dateS[0]));
        let _index = _event.events.findIndex((val) => val.title === event.name);
        if (_index === -1) return;
        _event.events.splice(_index, 1);
        if (_event.events.length === 0) {
            _index = this.eventsArr.findIndex((val) => val.day === Number(_dateS[2]) && val.month === Number(_dateS[1]) - 1 && val.year === Number(_dateS[0]));
            this.eventsArr.splice(_index, 1);
        }
    }

    addEvent(event) {
        if (event === null) return;

        let _ev = this.findEvent(event);
        if (_ev === undefined) {
            this.eventsArr.push(event);
        } else {
            let _events = event.events;
            _ev.events.push(_events[0]);
        }
        this.saveEvents();
        let child = this.startElement.children[0];
        child.classList.add("event");
        child.innerText = "" + event.events[0].title;
        if (this.startElement !== null) {
            let index = this.startElement.getAttribute("indx");
            this.dispatchEvent(new CustomEvent('onEvent', {
                bubbles: true, detail: {value: event, index: index}
            }));
        }
    }

    deleteEvent(event) {
        if (event === null) return;
        event.remove();
        this.startElement.children[0].classList.remove("event");
        this.removeEventByTitle(event);
        this.saveEvents();
    }

    setReadonly(readonly) {
        this.readonly = readonly;
        if (this.readonly) {

        }
    }
}

customElements.define("gp-calendar", GPCalendar);





