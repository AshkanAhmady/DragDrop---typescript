"use strict";
// form validation function
function validate(validatableInput) {
    let isValid = true;
    // if required sets for input of validate function
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
// task of this class: => import form element to (app)
class ProjectInput {
    constructor() {
        // type of this method is (tuple OR void)
        this.gatherUserInput = () => {
            const enteredTitle = this.titleInpurElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;
            if (!validate({ value: enteredTitle, required: true }) ||
                !validate({ value: enteredDescription, required: true, minLength: 5 }) ||
                !validate({ value: enteredPeople, required: true, min: 1, max: 10 })) {
                alert("input is invalid, please try again!");
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        };
        this.submitHandler = (e) => {
            e.preventDefault();
            const userInput = this.gatherUserInput();
            // check for tuple => tuple is an array
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
                console.log(title, description, people);
                this.cleareInput();
            }
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
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configure();
        this.attach();
    }
    cleareInput() {
        this.titleInpurElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
}
const projectInput = new ProjectInput();
