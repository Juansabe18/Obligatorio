class System {
    constructor() {     
        this.users = [];
        this.availableInstances = [];
        this.idUserCounter = 1;
        this.allInstancesStock = [];
    }

    addUser(user) {
        let userFound = this.getUser(user.username);

        if (userFound != null)
            return false;

        this.users.push(user);
        return true;
    }

    addInstance(instance) {
        this.availableInstances.push(instance);
        this.allInstancesStock.push(instance);
    }

    addInstanceToUser(instanceType, username) {
        let instance = null;
        instance = this.getAvailableInstanceFromType(instanceType);
        let userIndex = this.getIndexUser(username);

        if (userIndex != null && instance != null) {
            this.users[userIndex].instancesInUse.push(instance);
            this.deleteFromAvailableInstances(instance_id);
            return "Instancia añadida con exito";
        }

        return "Error añadiendo la instancia";
    }

    getStock() {
        return this.allInstancesStock;
    }

    turnOnInstance(instaceId, userId) {

    }

    turnOfInstance(instaceId, userId) {

    }

    getAvailableInstanceFromType(instanceType) {
        for (let i = 0; i<this.availableInstances.length; i++) {
            if (instanceType == this.availableInstances[i].type) {
                return this.availableInstances[i];
            }
        }
        return null;
    }

    deleteFromAvailableInstances(instanceId) {
        for (let i = 0; i < this.availableInstances.length; i++) {
            if (instanceId == this.availableInstances[i].instance_id) {
                this.availableInstances.splice(i,1);      
                return true;
            }
        }
        return false;
    }

    getUser(username) {
        let userIndex = this.getIndexUser(username);

        if (userIndex!=null) {
            return this.users[userIndex];
        }

        return null;
    }

    activateUser (username) {
        let userIndex = this.getIndexUser(username);
        if (userIndex != null) {
            this.users[userIndex].state = "Activado";
            return true;
        }
        return false;
    }

    blockUser (username) {
        let userIndex = this.getIndexUser(username);
        if (userIndex != null) {
            this.users[userIndex].state = "Bloqueado";
            return true;
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


}