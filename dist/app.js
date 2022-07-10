"use strict";
// task of this class: => import form element to (app)
class ProjectInput {
    constructor() {
        this.submitHandler = (e) => {
            e.preventDefault();
            console.log(this.titleInpurElement.value);
        };
        // do things when we (submit) form
        this.configure = () => {
            this.formElement.addEventListener("submit", this.submitHandler);
        };
        // attach (form) to (app) 
        this.attach = () => {
            this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
        };
        //  ! => for say to typescript, this EL is not null
        // as => for say, this element what exactually is
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        // get form inside of (template element)
        const importedNode = document.importNode(
        // this content is the form
        // true => for deep copy of nested elements
        this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild;
        this.formElement.id = "user-input";
        // select inputs from (formElement)
        this.titleInpurElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#decription");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configure();
        this.attach();
    }
}
const projectInput = new ProjectInput();
