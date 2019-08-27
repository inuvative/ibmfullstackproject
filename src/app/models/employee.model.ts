class Employee {
    _id:string;
    firstName:string;
    lastName:string;
    hireDate:Date;
    role:string;
    favoriteJoke:string;
    favoriteQuote:string;

    constructor() {
        this.firstName="";
        this.lastName="";
        this.hireDate=null;
        this.role="";
        this.favoriteJoke="";
        this.favoriteQuote="";
    }
}

export default Employee;