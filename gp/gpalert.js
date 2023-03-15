class GPAlert extends HTMLElement {
    static get observedAttributes() {
        return ['position', 'title', 'message'];
    }

    constructor(message = "Alert!") {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.value = "center";
        this._header = "Message";

        if (message)
            this._message = message;

        this._suffix = `<a  href="#close" class="btn-close" aria-hidden="true">×</a>`;
    }

    connectedCallback() {
        this.shadow.innerHTML = `
        <style>
           :root {
            --primary-clr: #cc9bfa;
            --secondary-clr: #84399d;
            --color3: #5f1380;
            --color4: #41095b;            
            }
            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            @keyframes fadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            .collapse{        
                visibility:hidden;          
                opacity:0;                
                /*animation: fadeOut 1s;               */
            }
            .init{             
                visibility:hidden;                          
            }
            .show{
                visibility:visible;   
                opacity:1;                
                /*animation: fadeIn 2s;                 */
            }
            .modal{                    
                position:absolute;
                top:50px;
                margin-left:50%;
                width:300px;
                height:180px;
                border:1px solid var(--color4);
                border-radius:8px;
                box-shadow: 1px 1px 8px black;
                background:white;
                z-index:999;
                transform: translateX(-50%);                
            }
            .modal-header {
                display: flex;
                width: 100%;
                height: 45px;
                color: white;
                border: 1px solid var(--color4);
                background: var(--color3);
                align-items: center;
                justify-content: center;
            }
            .modal-body{
                color:#828181;
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: center;
            }
            .modal-footer{
                display:flex;               
            }
            button {                
                border: 1px solid var(--primary-clr);
                border-radius: 5px;
                background-color: transparent;
                cursor: pointer;
                color: var(--primary-clr);
                padding: 8px 18px;
            }            
            button:hover {
                color: #fff;
                background-color: var(--primary-clr);
            }            
            .modal-body{
                display:flex;
                 align-items: center;
                justify-content: center;
                color:darkgray;
                font-size:1rem;
                padding:25px 0;                
            }
            .modal-footer{
                display:flex;
                 align-items: center;
                justify-content: space-around;
            }            
            .btn-close{
                text-decoration:none;
                position:absolute;
                font-size:28px;
                top:5px;
                right:10px;
                color: white;
                z-index:6;
                opacity:0.8;
            }
            .btn-close:hover{
                opacity:1;
            }
            
        </style>
        <div id ="myModal" class="modal collapse">
            <div class="modal-header" >Alert<a  href="#close" class="btn-close" aria-hidden="true">×</a></div>
            <div class="modal-body">Texte</div>
            <div class="modal-footer">
                <button id="ok">OK</button>                
            </div>  
        </div>      
        `;
        this._modal = this.shadow.querySelector('#myModal');
        this._ok = this.shadow.querySelector('#ok');
        this.btn_close = this.shadow.querySelector('.btn-close');
        this.header = this.shadow.querySelector('.modal-header');
        this.message = this.shadow.querySelector('.modal-body');
        this.setHeader(this._header);
        this.setMessage(this._message);

        this._ok.addEventListener("click", () => {
            this.dispatchEvent(new Event('onOK'));
            this.hide();
        });

        this.btn_close.addEventListener("click", () => {
            this.dispatchEvent(new Event('onOK'));
            this.hide();
        });
        this.init();
    }

    setPosition(value) {
        this.value = value;
    }

    show() {
        this._modal.classList.add("show");
        this._modal.classList.remove("collapse");
    }

    hide() {
        this._modal.classList.remove("show");
        this._modal.classList.add("collapse");
    }

    init() {
        this._modal.classList.remove("show");
        this._modal.classList.toggle("init");
    }

    toggle() {
        this._modal.classList.toggle("show");
        this._modal.classList.toggle("collapse");
    }

    setHeader(header) {
        this.header.innerHTML = header + this._suffix;
    }

    setMessage(message) {
        this.message.innerText = message;
        this.btn_close = this.shadow.querySelector('.btn-close');
        this.btn_close.addEventListener("click", () => {
            this.hide();
        });

    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "position" && oldvalue !== newvalue) {
            this.setPosition(newvalue);
        }
        if (name === "title" && oldvalue !== newvalue) {
            this.setHeader(newvalue);
        }
        if (name === "message" && oldvalue !== newvalue) {
            this.setMessage(newvalue);
        }
    }

}

customElements.define("gp-alert", GPAlert);
