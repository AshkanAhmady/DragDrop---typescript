// Project Type
export enum ProjectStatus {
    Active,
    Finished
}

// project type
//we can use (interface | class) but we use the class to able to use (instantiate) it.
//we create an object to have the object of one project thats have this values
export class Project{
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus
    ) {}
}