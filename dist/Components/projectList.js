import { Component } from "./baseComponent";
import { ProjectStatus } from "../modules/project";
import { projectState } from "../state/projectState";
import { SingleProject } from "./singleProject";
// task of this class: => import list of projects to (app)
export class ProjectList extends Component {
    // we can also define (type) like this
    // private type = "active" | "finished"
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.dragOverHandler = (event) => {
            if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
                event.preventDefault();
                let listEl = this.selectedElement.querySelector("ul");
                listEl.classList.add("droppable");
            }
        };
        this.dragLeaveHandler = (event) => {
            let listEl = this.selectedElement.querySelector("ul");
            listEl.classList.remove("droppable");
        };
        // if this drop doing in (active) type => update status to active
        // if this drop doing in (finished) type => update status to finished
        this.dropHandler = (event) => {
            const projectId = event.dataTransfer.getData("text/plain");
            // we can with (type) property say if ower drop action is in (active) box, so update Projectstatus to active
            // and otherwise finish it.
            projectState.moveProject(projectId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        };
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        // drag events
        this.selectedElement.addEventListener("dragover", this.dragOverHandler);
        this.selectedElement.addEventListener("dragleave", this.dragLeaveHandler);
        this.selectedElement.addEventListener("drop", this.dropHandler);
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
