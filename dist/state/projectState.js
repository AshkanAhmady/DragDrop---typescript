import { Project, ProjectStatus } from "../modules/project.js";
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
        this.updateListeners = () => {
            for (const listenerFn of this.listeners) {
                // return copy of the array to listener
                // because we need the ojects and if we dont copy and change this objects
                // the object changes everywer
                listenerFn(this.projects.slice());
            }
        };
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
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find((prj) => prj.id === projectId);
        // second condition is for stop extra rendering DOM
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
}
// create instance of (ProjectState class) with this static method
// ProjectState is the instance of (ProjectState class)
export const projectState = ProjecstState.getInstance();
