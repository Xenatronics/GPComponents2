class Rdv {
    constructor(name, from, to, id, priority = 0) {
        this._name = name;
        this._from = from;
        this._to = to;
        this._priority = priority;
    }
}
/** */
class GPPanelEvent extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'message'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this._titre = null;
        this._message = null;
        this._activeEvent = null;
    }

    connectedCallback() {

        this.shadow.innerHTML = `

        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous"/>
         </head>
        <style>
        
           :root {
                --color1: #cc9bfa;
                --secondary-clr: #84399d;
                --color3: #5f1380;
                --color4: #41095b;            
           }          
           .event-day {
                display:flex;
                justify-content:center;
                font-size: 1.5rem;
                font-weight: 500;
                text-transform: capitalize;
                margin-bottom:20px;
                padding-top: 10px;
           }            
           .event-date {
                font-size: 1rem;
                font-weight: 400;
                color: #878895;
                text-transform: capitalize;
           }            
           .events {
                width: 100%;
                height: 100%;
                max-height: 600px;
                overflow-x: hidden;
                overflow-y: auto;                
           }           
           .add-event-wrapper {
                position: absolute;
                bottom: 85px;
                left: 50%;
                right:50%;
                width: 90%;
                max-height: 0;
                overflow: hidden;
                border-radius: 5px;
                background-color: #fff;
                transform: translateX(-50%);
                transition: max-height 0.5s ease;
                box-shadow: 1px 1px 8px black;
           }            
           .add-event-wrapper.active {
                max-height: 300px;
           }            
           .add-event-header {
                width: 90%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                color: white;
                border-bottom: 1px solid #f5f5f5;
                background:var(--color3)
           }            
           .add-event-header .close {
                font-size: 1.5rem;
                cursor: pointer;
           }            
           .add-event-header .close:hover {
                color: var(--color1);
           }            
           .add-event-header .title {
                font-size: 1.2rem;
                font-weight: 500;
           }            
           .add-event-body {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 5px;
                padding: 20px;
           }            
           .add-event-body .add-event-input {
                width: 90%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
           }            
           .add-event-body .add-event-input input {
                width: 100%;
                height: 100%;
                outline: none;
                border: none;
                border-bottom: 1px solid #f5f5f5;
                padding: 0 10px;
                font-size: 1rem;
                font-weight: 400;
                color: #373c4f;
           }            
           .add-event-footer {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
           }            
           .add-event-footer .add-event-btn {
                height: 40px;
                font-size: 1rem;
                font-weight: 500;
                outline: none;                
                color: #fff;
                background-color: var(--color1);
                border-radius: 5px;
                cursor: pointer;
                padding: 5px 10px;
                border: 1px solid var(--color1);
           }            
           .add-event-footer .add-event-btn:hover {
                background-color: transparent;
                color: var(--color1);
            }
           .btn {          
                color:white;
                width:50px;      
                opacity:0.5;
                font-size:15px;
                cursor:pointer;
           }
           .btn:hover{
                opacity:1;                
           }           
           .add-event {
                position: absolute;
                bottom: 20px;
                right: 30px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                color: #878895;
                border: 2px solid #878895;
                opacity: 0.5;
                border-radius: 50%;
                background-color: transparent;
                cursor: pointer;
           }            
           .add-event:hover {
                opacity: 1;
           }            
           .add-event i {
                pointer-events: none;
           }            
           .no-event {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 500;
                color: #878895;
           }       
           .overlay {
                position:relative;
                border-radius: 5px;
                width:100%;
                height:100%;
                top:0;
                left:0;                              
                background: rgba(0,0,0,0.33);                    
                /*opacity:1;*/
           }                   
        </style>
        <gp-alert id="alert"></gp-alert>
        <div class="overlay">            
            <span id="showDate" class="event-day"></span>
            <div></div>
            <div></div>
            <div class="events"></div>
             <div class="add-event-wrapper">
                <div class="add-event-header">
                    <div class="title">Ajouter Rendez-vous</div>
                    <i class="close fas fa-times"></i>
                </div>
                <div class="add-event-body">
                    <div class="add-event-input">
                        <input type="text" placeholder="Nom du rendez-vous" class="event-name"/>
                    </div>
                    <div class="add-event-input">
                        <input type="date" class="event-time-from"/>
                    </div>
                    <div class="add-event-input">
                        <input type="date" class="event-time-to"/>
                    </div>
                </div>            
                <div class="add-event-footer">
                    <button class="add-event-btn">Valider</button>
                </div>            
            </div>
            <button class="add-event">
                <i class="fas fa-plus"></i>
            </button>       
        </div>
        `;
        this.eventsContainer = this.shadow.querySelector('.events');
        this.addEventSubmit = this.shadow.querySelector(".add-event-btn ");
        this.addEventBtn = this.shadow.querySelector(".add-event");
        this.addEventWrapper = this.shadow.querySelector(".add-event-wrapper ");
        this.addEventCloseBtn = this.shadow.querySelector(".close ");
        this.addEventTitle = this.shadow.querySelector(".event-name ");
        this.addEventFrom = this.shadow.querySelector(".event-time-from ");
        this.addEventTo = this.shadow.querySelector(".event-time-to ");
        this.alert = this.shadow.querySelector("#alert");
        this._overlay = this.shadow.querySelector('.overlay');
        //
        this.initEvent();
    }

    initEvent() {
        this.eventsContainer.addEventListener("click", (e) => {
            if (e.target.nodeName === "GP-EVENT") {
                this._activeEvent = e.target;
                e.target.addEventListener("onDelete", () => {
                    this.dispatchEvent(new CustomEvent('onDelete', {
                        bubbles: true, detail: {value: this._activeEvent}
                    }));
                });
            }
        });

        this.addEventBtn.addEventListener("click", () => {
            this.addEventWrapper.classList.toggle("active");
        });

        this.addEventSubmit.addEventListener("click", () => {
            const eventTitle = this.addEventTitle.value;
            const eventTimeFrom = this.addEventFrom.value;
            const eventTimeTo = this.addEventTo.value;

            let event = null;
            if (eventTitle === "") {
                this._overlay.style = "opacity:0.2;";
                this.dispatchEvent(new CustomEvent('onError', {
                    bubbles: true, detail: {value: "title empty"}
                }));
                this.alert.setHeader("Erreur")
                this.alert.setMessage("Saisissez un nom pour le rendez-vous");
                this.alert.show();
                return;
            }
            if (this.isExistEvent(eventTitle)) {
                this._overlay.style = "opacity:0.2;";
                this.dispatchEvent(new CustomEvent('onError', {
                    bubbles: true, detail: {value: "title already exists"}
                }));
                this.alert.setHeader("Erreur")
                this.alert.setMessage("Ce titre existe déjà !");
                this.alert.show();
                return;
            }
            if (!this.isDateValide(eventTimeFrom)) {
                this._overlay.style = "opacity:0.2;";
                this.dispatchEvent(new CustomEvent('onError', {
                    bubbles: true, detail: {value: "invalid date"}
                }));
                this.alert.setHeader("Erreur")
                this.alert.setMessage("Saisissez une date valide!");
                this.alert.show();
                return;
            }
            if (!this.isDateValide(eventTimeTo)) {
                this._overlay.style = "opacity:0.2;";
                this.dispatchEvent(new CustomEvent('onError', {
                    bubbles: true, detail: {value: "invalid date"}
                }));
                this.alert.setHeader("Erreur")
                this.alert.setMessage("Saisissez une date valide!");
                this.alert.show();
                return;
            }

            let sEvents = eventTimeFrom + " - " + eventTimeTo;
            let events = {'title': eventTitle, 'time': sEvents};

            event = {
                'day': this.activeDay.getDate(),
                'month': this.activeDay.getMonth() ,
                "year": this.activeDay.getFullYear(),
                "events": [events]
            }

            this.dispatchEvent(new CustomEvent('onAdd', {
                bubbles: true, detail: {value: event}
            }));

            this.addEventWrapper.classList.toggle("active");
        });

        this.alert.addEventListener("onOK", () => {
            this._overlay.style = "opacity:1;";
        })

        this.addEventCloseBtn.addEventListener('click', () => {
            this.addEventWrapper.classList.remove("active");
        });
    }

    isExistEvent(title) {
        if (!this._events) return false;
        let bFind = this._events.find((val) => {
            return (val.title === title);
        });
        if (bFind === undefined) return false;
        return (bFind.title === title);
    }

    findEvent(date) {
        return this.eventsArr.find((val) => (val.date === date));
    }

    isDateValide(testDate) {
        let date_regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
        return (date_regex.test(testDate));
    }

    getActiveEvent() {
        return this._activeEvent;
    }

    setEvents(obj) {
        if (obj === undefined) {
            this.eventsContainer.innerHTML = `<div class="no-event">Pas d'évènement</div>`;
            return;
        }
        this._events = obj.events;
        let sEvents = ``;
        this._events.forEach((event) => {
            sEvents += ` <gp-event name="${event.title}" message="${event.time}"></gp-event>`;
        });
        this.eventsContainer.innerHTML = sEvents;
    }

    ShowDate(detail) {
        this.showDate = this.shadow.querySelector('#showDate');
        this.showDate.innerText = detail.value;
        this.activeDay = detail.date;
    }

    setSelection(ev) {
        if (ev === null) return;
        this.startDate = ev.detail.start;
        this.startEnd = ev.detail.end;
        this.addEventFrom.value = ev.detail.start;
        this.addEventTo.value = ev.detail.end;
    }

    attributeChangedCallback(name, oldvalue, newvalue) {

        
    }
}

customElements.define("gp-panel-event", GPPanelEvent);
