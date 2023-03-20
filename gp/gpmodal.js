class GPModal extends HTMLElement {
    static get observedAttributes() {
        return ['position', 'name', 'message'];
    }

    constructor(name = "Modal", message = "Message par défaut") {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.value = "center";
        this.suffix = "<a href='#close' class='btn-close' aria-hidden='true'>×</a>";
        this.name = name;
        this.message = message;
    }

    setName(_name) {
        this.name = _name;
        this._header = this.shadow.querySelector('.modal-header');
        if (this._header === null) return;
        this._close.removeEventListener("click", () => {
        });
        this._header.innerHTML = this.name + this.suffix;
        this._close = this.shadow.querySelector('.btn-close');
        this._close.addEventListener("click", () => {
            this.hide();
            this.dispatchEvent(new Event('onClose'));
        });
    }

    setMessage(_message) {
        this.message = _message;
        this._body = this.shadow.querySelector('.modal-body');
        if (this._body === null) return;
        this._body.innerText = this.message;
    }

    connectedCallback() {
        this.shadow.innerHTML = `
        <style>
           :root {
            --color1: #cc9bfa;
            --color2: #84399d;
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
                opacity:0;                
                animation: fadeOut 0.9s;               
            }
            .init{             
                visibility:hidden;                          
            }
            .show{
                visibility:visible;   
                opacity:1;                
                animation: fadeIn 0.6s;                 
            }
            .modal{     
                display: block;                 
                position:absolute;                                         
                top:50px;
                left: 50%; /* à 50%/50% du parent référent */
                
                transform: translateX(-50%); /* décalage de 50% de sa propre taille */
                width:400px;
                height:200px;                    
                border:1px solid var(--color4);
                border-radius:8px;
                box-shadow: 1px 1px 8px black;
                background:white;
                z-index:99;                             
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
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: center;
            }
            .modal-footer{
                display:flex;               
            }
            button {                
                border: 1px solid var(--color1);
                border-radius: 5px;
                background-color: transparent;
                cursor: pointer;
                color: var(--color1);
                padding: 8px 16px;
            }            
            button:hover {
                color: #fff;
                background-color: var(--color1);
            }            
            .modal-body{
                display:flex;
                 align-items: center;
                justify-content: center;
                color:darkgray;
                font-size:1rem;
                padding:35px 0;                
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
                opacity:0.8;
            }
            .btn-close:hover{
                opacity:1;
            }
        </style>
        <div id ="myModal" class="modal collapse">
            <div class="modal-header" >Suppression du RDV <a  href="#close" class="btn-close" aria-hidden="true">×</a></div>
            <div class="modal-body">Voulez-vous supprimer cet élément?</div>
            <div class="modal-footer">
                <button id="yes">Oui</button>
                <button id="no">Non</button>
            </div>  
        </div>      
        `;
        this._modal = this.shadow.querySelector('#myModal');
        this._yes = this.shadow.querySelector('#yes');
        this._no = this.shadow.querySelector('#no');
        this._close = this.shadow.querySelector('.btn-close');

        this._yes.addEventListener("click", () => {
            this.dispatchEvent(new Event('onValidate'));
        });
        this._no.addEventListener("click", () => {
            this.dispatchEvent(new Event('onCancel'));
            this.hide();
        });
        this._close.addEventListener("click", () => {
            this.hide();
            this.dispatchEvent(new Event('onClose'));
        });
        this.init();
        this.setName(this.name);
        this.setMessage(this.message);
    }

    setPosition(value) {
        this.value = value;
    }

    show() {
        this._modal.classList.add("show");
        this._modal.classList.remove("collapse");
        this.dispatchEvent(new Event('onShow'));
    }

    hide() {
        this._modal.classList.remove("show");
        this._modal.classList.add("collapse");
        this.dispatchEvent(new Event('onHide'));
    }

    init() {
        this._modal.classList.remove("show");
        this._modal.classList.toggle("init");
    }

    toggle() {
        this.showed = this._modal.classList.toggle("show");
        if (this.showed) {
            this.dispatchEvent(new Event('onShow'));
        } else {
            this.dispatchEvent(new Event('onHide'));
        }
        this._modal.classList.toggle("collapse");
    }


    setPosition(_position) {

        switch (_position) {
            case "left":
                this._modal.style.left = "20%";
                this._modal.style.right = "50%";
                this.transX = "-50%";
                break;
            case "right":
                this._modal.style.left = "80%";
                this._modal.style.right = "50%";
                this.transX = "-50%";
                break;
            case "top":
                this._modal.style.top = "20%";
                this.transY = "-50%";
                break;
            case "bottom":
                this._modal.style.top = "80%";
                this._modal.style.bottom = "50%";
                this.transY = "-50%";
                break;
            case "centerH":
                this._modal.style.left = "50%";
                this.transX = "-50%";
                break;
            case "centerV":
                this._modal.style.top = "50%";
                this.transY = "-50%";
                break;
            case "center":
                this._modal.style.top = "50%";
                this._modal.style.left = "50%";
                this.transX = "-50%";
                this.transY = "-50%";
                break;
        }
        this._modal.style.transform = `translate(${this.transX},${this.transY})`;
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "position" && oldvalue !== newvalue) {
            this.setPosition(newvalue);
        }
        if (name === "name" && oldvalue !== newvalue) {
            this.setName(newvalue);
        }
        if (name === "message" && oldvalue !== newvalue) {
            this.setMessage(newvalue);
        }
    }
}
customElements.define("gp-modal", GPModal);
