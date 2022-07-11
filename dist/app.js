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
// Project Type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
// task of this class: => managing state of projects
class ProjecstState {
    constructor() {
        // array of functions
        this.listeners = [];
        this.projects = [];
    }
    // create istance of classe and store that in instance property
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjecstState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    // push the nuew project to projects array of object
    addProject(title, description, numOfPeople) {
        // use (Project) class to set the type of values of object of project
        const newProject = new Project(Date.now(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            // return copy of the array to listener
            // because we need the ojects and if we dont copy and change this objects
            // the object changes everywer
            listenerFn(this.projects.slice());
        }
    }
}
// create instance of (ProjectState class) with this static method
// ProjectState is the instance of (ProjectState class)
const projectState = ProjecstState.getInstance();
// task of this class: => import list of projects to (app)
class ProjectList {
    // we can also define (type) like this
    // private type = "active" | "finished"
    constructor(type) {
        this.type = type;
        // attach (section of project list) to (app) 
        this.attach = () => {
            this.hostElement.insertAdjacentElement("beforeend", this.sectionElement);
        };
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        // get form inside of (template element)
        const importedNode = document.importNode(
        // this content is the form
        // true => for deep copy of nested elements
        this.templateElement.content, true);
        this.sectionElement = importedNode.firstElementChild;
        // type => (active | finished)
        this.sectionElement.id = `${this.type}-projects`;
        this.assignedProjects = [];
        // register (listener) of ProjectState in here
        // put all data in the (projects array) to assignedProjects
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        // the (UlElement) that is in the (section) element
        const listEl = document.getElementById(`${this.type}-projects-list`);
        // put the all data in the (assignedProject) to liElement and put that to ULElement 
        // that is in the sectionElement
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            // show the title of the project in th (Li) element
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionElement.querySelector("ul").id = listId;
        this.sectionElement.querySelector("h2").textContent = this.type.toUpperCase() + " PROJECT";
    }
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
                // put this three data to (ProjectState class) and store them with addProject
                projectState === null || projectState === void 0 ? void 0 : projectState.addProject(title, description, people);
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
