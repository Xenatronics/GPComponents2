Number.prototype.zeroPad = function(length) {
    length = length || 2; // defaults to 2 if no parameter is passed
    return (new Array(length).join('0')+this).slice(length*-1);
 };

class GPCalendar extends HTMLElement {
    static get observedAttributes() {
        return ['date', "start", "end"];
    }

    constructor(actualDate = null) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.eventsArr = [];
        this.bPress = false;
        this.startElement = null;
        this.endElement = null;
        this.activeDay = null;
        this.daysName = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
        this.months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        this.calendar = null;
        if (actualDate == null) this.nowDay = new Date(); else this.nowDay = actualDate;
        this._month = this.nowDay.getMonth();
        this.year = this.nowDay.getFullYear();
        this.arrayDays = [];
    }

    setDate(date) {
        this.nowDay = date;
        this.initCalendar();
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
                align-items: flex-end;
                padding: 3px;
                width: var(--carre);
                height:100px;               
                color: var(--color2);
                border: 1px solid #f5f5f5;
            }
            .weekend{                
                color:  var(--color1);
            }           
            .day:nth-child(7n + 1) {
                border-left: 2px solid #f5f5f5;
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
            }
            .sel-active {
                position: relative;
                font-size: 1rem;                
                background-color: var(--color5);
            }            
            .today {
                font-size: 1.1rem;
                background:#f3e5f5;                
            }                    
            .event::after {
                content: "";
                position: absolute;
                bottom: 10%;
                left: -1px;
                width: 102%;        
                height: 10px;
                background-color: #cc9bfa;
                z-index:99;
            }
            .eventE::after {
                content: "";
                position: absolute;
                bottom: 10%;
                right: 5px;
                width: 94%;
                margin-left:5px;
                height: 10px;
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;                
                background-color: #cc9bfa;
            }
            .eventS::after {
                content: "";
                position: absolute;
                bottom: 10%;
                left: 5px;
                width: 94%;        
                height: 10px;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;                
                background-color: #cc9bfa;
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
            .event {
                position: relative;                                  
            }
            .event:hover::after{
                cursor: pointer;
                background:var(--color3);
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

        this.prev = this.shadow.querySelector(".prev");
        this.next = this.shadow.querySelector(".next");
        //
        this.todayBtn = this.shadow.querySelector(".today-btn");
        this.getEvents();
        this.initCalendar();
        this.initEvent();
        this.unSelect();
    }

    disconnectedCallback() {
        this.resetEvent();
    }

    isToday = (day) => {
        return (day === new Date().getDate() && this.year === new Date().getFullYear() && this._month === new Date().getMonth());
    }

    isEventDay = (day) => {
        let obj = this.eventsArr.find((val) => {
            return (val.day === day && val.month === this._month + 1 && val.year === this.year);
        });
        return (obj !== undefined);
    }
    function

    updateEvents(day, month) {
        let event = this.eventsArr.find(val => val.day === day && val.month === month && val.year === this.year);
        this.dispatchEvent(new CustomEvent('onEvent', {
            bubbles: true, detail: {value: event}
        }));
    }

    initCalendar() {
        this.firstDay = new Date(this.year, this._month, 1);
        this.prevDay = new Date(this.year, this._month, 0);
        this.presentDay = new Date(this.year, (this._month + 1), 0);
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
        this.date.innerHTML = this.months[this._month] + " " + this.year;
        let sDays = ``;

        for (let x = day; x <= nbPrevDays; x++) {
            sDays += `<div monthDay="${this._month}" class="day prev-date">${x}</div>`;
        }
        for (let i = 1; i <= nbNowDay; i++) {
            //check if event is present on that day
            const weekend = this.isWeekend(i, this.nowDay);
            let event = this.isEventDay(i);
            this.activeDay = i;
            let today = this.isToday(i);
            if (today) {
                this.getActiveDay(i);
                this.updateEvents(i, this._month);
            }
            sDays += `<div monthDay="${this._month + 1}" class="day ${today === true ? 'today' : ''} ${event === true ? 'event' : ''} ${weekend ? "weekend" : ''}" >${i}</div>`;
        }
        for (let j = 1; j <= offset; j++) {
            sDays += `<div monthDay="${this._month + 2}" class="day next-date">${j}</div>`;
        }
        this.daysContainer.innerHTML = sDays;
        this.days = this.shadow.querySelectorAll(".day");
        this.events = this.shadow.querySelectorAll(".event");
        let arrDaysTemp = [...this.days];
        for (let i = 0; i < arrDaysTemp.length; i++) {
            let item = {
                index: i, year: this.year, month: arrDaysTemp[i].getAttribute('monthDay'), day: arrDaysTemp[i].innerText
            }
            this.arrayDays.push(item);
        }
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
        let d = new Date(this.year, this._month, day).getDay();
        return (d === 0 || d === 6);
    }

    prevMonth() {
        this._month--;
        if (this._month < 0) {
            this._month = 11;
            this.year--;
        }
        this.initCalendar();
        this.updateEvents(1, this._month);
    }

    nextMonth() {
        this._month++;
        if (this._month > 11) {
            this._month = 0;
            this.year++;
        }
        this.initCalendar();
        this.updateEvents(1, this._month);
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
            this.year = this.nowDay.getFullYear();
            this.initCalendar();
        });
    }

    getArrEvents() {
        return this.eventsArr;
    }

    getActiveDay(day) {
        const date = new Date(this.year, this._month, day);
        const dayName = this.getDayName(day, date, false);
        let sDate = dayName + " " + day + " " + this.months[this._month] + " " + this.year;
        this.dispatchEvent(new CustomEvent('showDate', {
            bubbles: true, detail: {value: sDate, date: date}
        }));
    }

    toDay() {
        const date = new Date();
        const dayName = this.getDayName(date.getDate(), date, false);
        let sDate = dayName + " " + date.getDate() + " " + this.months[this._month] + " " + this.year;
        this.dispatchEvent(new CustomEvent('showDate', {
            bubbles: true, detail: {value: sDate, date:date}
        }));
    }

    unSelect(bExcept = false) {
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
        let startMonth = Number(this.startElement?.getAttribute('monthDay')).zeroPad(2);
        let startDay = Number(this.startElement?.innerText).zeroPad(2);
        let endMonth = Number(this.endElement?.getAttribute('monthDay')).zeroPad(2);
        let endDay = Number(this.endElement?.innerText).zeroPad(2);
        let startDate=`${this.year}-${startMonth}-${startDay}`;
        let endDate=`${this.year}-${endMonth}-${endDay}`;
        if (startMonth === null) return;
        this.dispatchEvent(new CustomEvent('onSelection', {
            bubbles: true, detail: {start: startDate, end: endDate}
        }));
    }

    saveEvents() {
        localStorage.setItem("events", JSON.stringify(this.eventsArr));
    }

    //function to get events from local storage
    getEvents() {
        this.eventsArr = [];
        //check if events are already saved in local storage then return event else nothing
        if (localStorage.getItem("events") === null) {
            return;
        }
        this.eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    }

    detectIndices() {
        this.days = this.shadow.querySelectorAll(".day");
        let start = Number(this.getDayByText(this.startElement).index);
        let end = Number(this.getDayByText(this.endElement).index);

        if (start === end) {
            this.unSelect();
            this.endElement.classList.add("active");
            this.startElement.classList.add("active");
        } else {
            //this.startElement.classList.add("active")
            for (let i = Math.min(start, end); i < Math.max(start, end); i++) {
                this.days[i].classList.add("sel-active");
            }
            this.endElement.classList.add("active");
        }
        //this.log("start: " + Math.min(start, end) + "  end: " + Math.max(start, end));
    }

    addDayListener() {
        //const days = document.querySelectorAll(".day");
        this.days.forEach((day) => {
            day.addEventListener('mousedown', (e) => {
                this.bPress = true;
                this.startElement = e.target;
                this.endElement = e.target;
            });
            day.addEventListener('mouseover', (e) => {
                if (this.bPress) {
                    this.unSelect();
                    this.endElement = e.target;
                    this.detectIndices();
                }
            });
            day.addEventListener('mouseup', (e) => {
                this.endElement = e.target;
                this.setSelection();
                this.bPress = false;
                this.startElement = null;
                this.endElement = null;
                e.target.classList.add("active");
            });
            day.addEventListener("click", (e) => {
                this._month = e.target.getAttribute('monthDay') - 1;
                this.getActiveDay(e.target.innerHTML);
                this.startElement = e.target;
                this.endElement = e.target;
                this.detectIndices();
                this.activeDay = Number(e.target.innerHTML);
                this.unSelect();
                //
                e.target.classList.add("active");
                let d = Number(e.target.innerText);
                let m = Number(e.target.getAttribute('monthDay'));
                this.updateEvents(d, m);

            });
        });
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "date" && oldvalue !== newvalue) {
            this.setDate(newvalue);
            this.initCalendar();
        }
        if (name === "start" && oldvalue !== newvalue) {
            this.setStart(newvalue);
        }
        if (name === "end" && oldvalue !== newvalue) {
            this.setEnd(newvalue);
        }
    }

    getDayByText(elem) {
        let m = elem.getAttribute("monthDay");
        let d = elem.innerText;
        let obj = this.arrayDays.find(val => val.day === d && val.month === m);
        return obj;
    }

    findEvent(event) {
        return this.eventsArr.find((val) => val.day === event.day && val.month === event.month && val.year === event.year);
    }

    addEvent(event) {
        if (event === null) return;

        let _ev = this.findEvent(event);
        if (_ev === undefined){
            this.eventsArr.push(event);
        }else {
            let _events=event.events;
            _ev.events.push(_events[0]);
        }
        this.saveEvents();
        this.initCalendar();

    }

    deleteEvent(event){
        if (event === null) return
        let _index = this.eventsArr.findIndex(event);
        if (_index===-1) return;
        this.eventsArr.splice(_index,1);
        this.saveEvents();
        this.initCalendar();
    }

    setReadonly( readonly ) {
        this.readonly = readonly;
        if (this.readonly) {

        }
    }
}

customElements.define("gp-calendar", GPCalendar);





