class User {
    constructor (id, name, lastName, username, pass, creditCard, cvc, admin) {
        this.userId = id;
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.pass = pass;
        this.creditCard = creditCard;
        this.cvc = cvc;
        this.state = "Pendiente"
        if (admin != undefined)
            this.admin = admin;
        else
            this.admin = false;
        this.instancesInUse = [];        
    }

}

class Instance {
    constructor (instance_id, type, state, rentalCost, turnOnCost) {
        this.instance_id = instance_id;
        this.type = type;
        this.state = state;
        this.rentalCost = rentalCost;
        this.turnOnCost = turnOnCost;
        this.turnOnInstanceCounter = 0;
    }

}