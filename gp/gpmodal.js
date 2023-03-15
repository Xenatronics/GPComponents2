class GPModal extends HTMLElement {
    static get observedAttributes() {
        return ['position'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.value = "center";
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
                animation: fadeOut 1s;               
            }
            .init{             
                visibility:hidden;                          
            }
            .show{
                visibility:visible;   
                opacity:1;                
                animation: fadeIn 2s;                 
            }
            .modal{            
                position:absolute;
                top:50px;
                width:400px;
                height:200px;
                margin-left:auto;
                margin-right:auto;
                border:1px solid var(--color4);
                border-radius:8px;
                box-shadow: 1px 1px 8px black;
                background:white;
                z-index:999;
                transform: translateX(65%);                
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
        this._modal= this.shadow.querySelector('#myModal');
        this._yes= this.shadow.querySelector('#yes');
        this._no= this.shadow.querySelector('#no');
        this._close=this.shadow.querySelector('.btn-close');

        this._yes.addEventListener("click", ()=>{
            this.dispatchEvent(new Event('onValidate'));
        });
        this._no.addEventListener("click", ()=>{
            this.hide();
        });
        this._close.addEventListener("click", ()=>{
            this.hide();
        });
        this.init();
    }

    setPosition(value) {
        this.value = value;
    }

    show(){
        this._modal.classList.add("show");
        this._modal.classList.remove("collapse");
    }

    hide(){
        this._modal.classList.remove("show");
        this._modal.classList.add("collapse");
    }

    init(){
        this._modal.classList.remove("show");
        this._modal.classList.toggle("init");
    }

    toggle(){
        this._modal.classList.toggle("show");
        this._modal.classList.toggle("collapse");
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "position" && oldvalue !== newvalue) {
            this.setPosition(newvalue);
        }
    }

}

customElements.define("gp-modal", GPModal);
