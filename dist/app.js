"use strict";
// task of this class: => import form element to (app)
class ProjectInput {
    constructor() {
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
        // attach (form) to (app) 
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}
const projectInput = new ProjectInput();
