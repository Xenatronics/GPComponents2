class GPEvent extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'message'];
    }

    constructor(name = "Rendez-vous") {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        //this.name = name;
        this.pref = `<i class='fas fa-solid fa-bell'></i>&nbsp;&nbsp;&nbsp;`;
        this.message = "message";
        this._titre = null;
        this._message = null;
    }

    connectedCallback() {

        this.shadow.innerHTML = `

        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous"/>
         </head>
        <style>
        
           :root {
                --primary-clr: #cc9bfa;
                --secondary-clr: #84399d;
                --color3: #5f1380;
                --color4: #41095b;            
            }          
            h3{
                margin: 8px 2px;
                font-size: 20px;
            }
            .event {
                margin: 10px 2px;     
                margin-left:10px;           
                position: relative;
                width: 90%;                
                min-height: 70px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                gap: 5px;
                padding: 5px  10px;
                color: #fff;
                background: linear-gradient(359deg,#8b8b8b, #575757);
                cursor: default;
                border-top-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            .event:hover {                
                border: 2px solid var(--color4);
            }                      
                       
            .event-title {
                font-size: 1rem;
                font-weight: 400;
                margin-left: 20px;
            }
            .event-time {
                display:flex;
                font-size: 0.8rem;                
                color: #c0c0c0;
                margin-left: 25px;                
                justify-content:space-between;
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
                   
        </style>
        
        <div class="event">
            <div class="title">
                <i class="fas fa-solid fa-bell"></i></div>
            <div class="event-time">
                <div class="message">12 déc 2030</div><div class="btn fas fa-solid fa-trash"></div>
            </div>
        </div> 
        `;
        this._titre = this.shadow.querySelector('.title');
        this._message = this.shadow.querySelector('.message');
        this._titre.innerHTML=this.pref+this.name;
        this._message.innerText=this.message;
        this.trash = this.shadow.querySelector('.btn');
        this.trash.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('onDelete',
                {
                    bubbles: true, detail: {title: this.title}
                }));
        });
    }

    attributeChangedCallback(name, oldvalue, newvalue) {

        if (name === "name" && oldvalue !== newvalue) {

            this.name=newvalue;
            if (this._titre)
                this._titre.innerHtml = this.pref + this.name;
        }
        if (name === "message" && oldvalue !== newvalue) {
            this.message=newvalue;
            if (this._message)
                this._message.innerText = this.message;
        }
    }
}
customElements.define("gp-event", GPEvent);
