class User {
    constructor (name, lastName, username, password, creditCard, cvc, admin) {
        this.name = name;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.creditCard = creditCard;
        this.cvc = cvc;
        this.state = "Pendiente"
        this.admin = admin;
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
        this.turnOnInstanceCounter = 1;
    }

}