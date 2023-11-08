class System {
    constructor() {     
        this.users = [];
        this.availableInstances = [];       
        this.allInstancesStock = [];
        this.instanceCounterId = 0;
        this.userCounterId = 0;
        this.addUsersToApp();
        this.addInstanceToApp();
    }

    createNewUserForValidations(name, lastName, username, pass, creditCard, cvc) {
        let newUser = new User (this.userCounterId, name, lastName, username, pass, creditCard, cvc);
        return newUser;
    }

    addUser(user) {
        let userFound = this.getUser(user.username);

        if (userFound != null)
            return false;

        this.users.push(user);
        this.userCounterId++;
        console.log(this.users);
        return true;
    }

    addInstance(instance) {
        this.availableInstances.push(instance);
        this.allInstancesStock.push(instance);
        this.instanceCounterId++;
    }

    createInstance(instanceType, numberOfInstancesToCreate) {
        let state = "Apagada"
        let rentalCost = 0
        let turnOnCost = 0
        let newInstance;

        switch(instanceType) {

            case "c7.small":
                rentalCost = 20;
                turnOnCost = 2.50;
                break;

            case "c7.medium":
                rentalCost = 30;
                turnOnCost = 3.50;
                break;

            case "c7.large":
                rentalCost = 50;
                turnOnCost = 6.00;
                break;

            case "r7.small":
                rentalCost = 35;
                turnOnCost = 4.00;
                break;

            case "r7.medium":
                rentalCost = 50;
                turnOnCost = 6.50;
                break;

            case "r7.large":
                rentalCost = 60;
                turnOnCost = 7.00;
                break;

            case "i7.medium":
                rentalCost = 30;
                turnOnCost = 3.50;
                break;

            case "i7.large":
                rentalCost = 50;
                turnOnCost = 6.50;
                break;

          }


        for (let i = 0; i < numberOfInstancesToCreate; i++) {
            newInstance = new Instance (this.instanceCounterId, instanceType, state, rentalCost, turnOnCost);
            this.addInstance(newInstance);
        }

        console.log(this.allInstancesStock);
    }

    addInstanceToUser(instanceType, username) {
        let instance = null;
        instance = this.getAvailableInstanceFromType(instanceType);
        let userIndex = this.getIndexUser(username);

        if (userIndex != null && instance != null) {
            instance.state = "Encendida";
            instance.turnOnInstanceCounter++;
            this.users[userIndex].instancesInUse.push(instance);
            this.deleteFromAvailableInstancesWhenAddedToUser(instance.instance_id);
            return true;
        }

        return false;
    }

    getStock() {
        return this.allInstancesStock;
    }

    turnOnInstance(instaceId, username) {
        let user = this.getUser(username);

        for (let i = 0; i < user.instancesInUse.length; i++) {
            if (user.instancesInUse[i].instance_id == instaceId) {
                user.instancesInUse[i].state = "Encendida";
                user.instancesInUse[i].turnOnInstanceCounter++;
                return true;
            }
        }

        return false;        
    }

    turnOffInstance(instaceId, username) {
        let user = this.getUser(username);

        for (let i = 0; i < user.instancesInUse.length; i++) {
            if (user.instancesInUse[i].instance_id == instaceId) {
                user.instancesInUse[i].state = "Apagada";                
                return true;
            }
        }

        return false;  

    }

    getAvailableInstanceFromType(instanceType) {
        for (let i = 0; i<this.availableInstances.length; i++) {
            if (instanceType == this.availableInstances[i].type) {
                return this.availableInstances[i];
            }
        }
        return null;
    }

    deleteFromAvailableInstances(instanceType) {
        let instanceIdToDelete = null;
        for (let i = 0; i < this.availableInstances.length; i++) {
            if (instanceType == this.availableInstances[i].type) {
                instanceIdToDelete = this.availableInstances[i].instance_id;
                this.availableInstances.splice(i,1);
                break;
            }
        }
        for (let i = 0; i < this.allInstancesStock.length; i++) {
            if (this.allInstancesStock[i].instance_id == instanceIdToDelete) {
                this.allInstancesStock.splice(i,1);
                return true;
            }
        }
        return false;
    }

    deleteFromAvailableInstancesWhenAddedToUser(instanceId) {
        for (let i = 0; i < this.availableInstances.length; i++) {
            if (instanceId == this.availableInstances[i].instance_id) {                
                this.availableInstances.splice(i,1);
                break;
            }
        }
    }

    getUser(username) {
        let userIndex = this.getIndexUser(username);

        if (userIndex!=null) {
            return this.users[userIndex];
        }

        return null;
    }

    getUsers() {
        return this.users;
    }

    getInstanceStock(instaceType) {
        let instanceCounter = 0;
        for (let i=0; i<this.allInstancesStock.length; i++) {
            if (this.allInstancesStock[i].type == instaceType)
                instanceCounter++;
        }
        return instanceCounter;
    }

    activateUser (username) {
        let userIndex = this.getIndexUser(username);
        if (userIndex != null) {
            if (this.users[userIndex].state != "Activado") {
                this.users[userIndex].state = "Activado";
                return true;
            }            
        }
        return false;
    }

    blockUser (username) {
        let userIndex = this.getIndexUser(username);
        if (userIndex != null) {
            if (this.users[userIndex].state != "Bloqueado") {
                this.users[userIndex].state = "Bloqueado";
                //Sacar instancias y ponerlas en availableInstances[]
                this.deleteInstancesFromUser(username);
                return true;            
            }
        }
        return false;
    }

    getIndexUser(username) {
        for (let i=0; i<this.users.length; i++) {
            if (username == this.users[i].username)
                return i;
        }
        return null;
    }

    getInstancesInUseFromUsers(instanceType) {
        let instanceInUseCounter = 0;
        let actualUser;
        for (let i = 0; i < this.users.length; i++ ) {
            actualUser = this.users[i];
            if (actualUser.instancesInUse.length != 0) {
                for (let j = 0; j < actualUser.instancesInUse.length; j++) {
                    if (actualUser.instancesInUse[j].type == instanceType)
                        instanceInUseCounter++;
                }
            }            
        }
        return instanceInUseCounter;
    }


    addUsersToApp() {
        let user = new User (this.userCounterId, "juan", "ds", "juanceto.01", "pass", "creditCard", "cvc");
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "Luffy", "ds", "admin", "admin", "creditCard", "cvc", true);
        this.addUser(user);
        this.activateUser(user.username);
    }

    addInstanceToApp() {
        this.createInstance("c7.small",2);
    }

    getInstancesInUseFromUser(username) {
        let user = this.getUser(username);
        let userInstances = [];
        if (user.instancesInUse.length != 0) {
            for (let j = 0; j < user.instancesInUse.length; j++) {                    
                userInstances.push(user.instancesInUse[j]);
            }
            return userInstances;
        }            

        return null;
    }

    getInstanceInUseFromUserById(instanceId, username) {
        let user = this.getUser(username);
        for (let i = 0; i < user.instancesInUse.length; i++) {
            if (user.instancesInUse[i].instance_id == instanceId)
                return user.instancesInUse[i];
        }

        return null;        
    }   

    getAllInstancesInUse() {        
        let allInstancesInUse = [];
        for (let i = 0; i < this.users.length; i++) {           
            if (this.users[i].instancesInUse.length != 0) {
                for (let j = 0; j < this.users[i].instancesInUse.length; j++) {
                    allInstancesInUse.push(this.users[i].instancesInUse[j]);
                }
            }
        }
        return allInstancesInUse;
    }

    deleteInstancesFromUser(username) {
      let user = this.getUser(username);      

      if (user != null && user.instancesInUse.length != 0) {
        let instancesInUseLength = user.instancesInUse.length;
        for (let i = 0; i < instancesInUseLength ; i++) {
            user.instancesInUse[0].turnOnInstanceCounter = 0;
            this.availableInstances.push(user.instancesInUse[0]);
            user.instancesInUse.splice(0,1);
        }
      }
    }
}