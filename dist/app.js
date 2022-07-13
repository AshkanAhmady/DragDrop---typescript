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
// maybe we have more than one class and we can use this class to define inheritance
class State {
    constructor() {
        // array of functions
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
// task of this class: => managing state of projects
class ProjecstState extends State {
    constructor() {
        super();
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
    // push the nuew project to projects array of object
    addProject(title, description, numOfPeople) {
        // use (Project) class to set the type of values of object of project
        const newProject = new Project(Date.now().toString(), title, description, numOfPeople, ProjectStatus.Active);
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
// this is the Base class for (ProjectList & ProjectInput) to inherit this two class and clean the codes
class Component {
    // select elements dynamicly
    constructor(templateId, hostElementId, 
    // attach chil element in where place of pattenr element
    //true=> afterbegening
    //false=> beforeend
    insertAtStart, newElementId) {
        // attach (section of project list) to (app) 
        this.attach = (insertAtStart) => {
            this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.selectedElement);
        };
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        // get form inside of (template element)
        const importedNode = document.importNode(
        // this content is the form
        // true => for deep copy of nested elements
        this.templateElement.content, true);
        this.selectedElement = importedNode.firstElementChild;
        if (newElementId) {
            // type => (active | finished)
            this.selectedElement.id = newElementId;
        }
        this.attach(insertAtStart);
    }
}
// single product
class SingleProject extends Component {
    constructor(hostId, project) {
        super("single-project", hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    configure() { }
    renderContent() {
        this.selectedElement.querySelector("h2").textContent = this.project.title;
        this.selectedElement.querySelector("h3").textContent = this.project.people.toString();
        this.selectedElement.querySelector("p").textContent = this.project.description;
    }
}
// task of this class: => import list of projects to (app)
class ProjectList extends Component {
    // we can also define (type) like this
    // private type = "active" | "finished"
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        // register (listener) of ProjectState in here
        // put all data in the (projects array) to assignedProjects
        projectState.addListener((projects) => {
            // relevantProject if projects that filtered by type of this class (active | finished)
            const relevantProject = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProject;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.selectedElement.querySelector("ul").id = listId;
        this.selectedElement.querySelector("h2").textContent = this.type.toUpperCase() + " PROJECT";
    }
    renderProjects() {
        // the (UlElement) that is in the (section) element
        const listEl = document.getElementById(`${this.type}-projects-list`);
        // after any add project, we should empty the ul to stop duplicate
        listEl.innerHTML = "";
        // put the all data in the (assignedProject) to (liElement) and put that to ULElement 
        // that is in the selectedElement
        for (const projectItem of this.assignedProjects) {
            // with (singleProject) class we append single project to project list
            new SingleProject(this.selectedElement.querySelector("ul").id, projectItem);
            // const listItem = document.createElement("li");
            // // show the title of the project in th (Li) element
            // listItem.textContent = projectItem.title;
            // listEl.appendChild(listItem);
        }
    }
}
// task of this class: => import form element to (app)
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        // do things when we (submit) form
        this.configure = () => {
            this.selectedElement.addEventListener("submit", this.submitHandler);
        };
        this.renderContent = () => { };
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
        // select inputs from (selectedElement)
        this.titleInpurElement = this.selectedElement.querySelector("#title");
        this.descriptionInputElement = this.selectedElement.querySelector("#description");
        this.peopleInputElement = this.selectedElement.querySelector("#people");
        this.configure();
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
