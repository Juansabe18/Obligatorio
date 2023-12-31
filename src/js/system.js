class System {
    constructor() {     
        this.users = [];
        this.availableInstances = [];       
        this.allInstancesStock = [];
        this.instanceCounterId = 0;
        this.userCounterId = 0;
        this.addUsersToApp();
        this.addInstanceToApp();
        this.addInstancesToUsers();
    }

    //se usa unicamente para el momento del registro, para pasar un objeto usuario y hacer las validaciones usando las 
    //diferentes propiedades del mismo en vez de pasarlas de a una
    createNewUserForValidations(name, lastName, username, pass, creditCard, cvc) {
        let newUser = new User (this.userCounterId, name, lastName, username, pass, creditCard, cvc);
        return newUser;
    }

    //añade usuario a la aplicacion
    addUser(user) {
        let userFound = this.getUser(user.username);

        if (userFound != null)
            return false;

        this.users.push(user);
        this.userCounterId++;
        return true;
    }

    //añade una instancia al stock y a las intancias disponibles para alquilar
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

    }

    addInstanceToUser(instanceType, username) {
        let instance = null;
        instance = this.getAvailableInstanceFromType(instanceType);
        let userIndex = this.getIndexUser(username);

        if (userIndex != null && instance != null) {
            instance.state = "Encendida";
            instance.turnOnInstanceCounter++;
            this.users[userIndex].instancesInUse.push(instance);
            //cuando se añade la instancia al usuario se elimina de la lista de las instancias disponibles
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

    //devuelve la primera instancia que machee el tipo pasado por el argumento para su alquiler
    getAvailableInstanceFromType(instanceType) {
        for (let i = 0; i<this.availableInstances.length; i++) {
            if (instanceType == this.availableInstances[i].type) {
                return this.availableInstances[i];
            }
        }
        return null;
    }

    //se utiliza para eliminar la instancia del stock total y de las instancias disponibles
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

    //al añadir la instancia al usuario se elimina del array de instancias disponibles
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

    //devuelve el stock actual
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

    //Devuelve todas las instancias del tipo pasado por parametro siendo utilizadas por usuarios para el control
    //de restar stock y para mostrar informacion de cuantas instancias en uso de ese tipo hay
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

    //Creacion de usuarios precargados para la aplicacion
    addUsersToApp() {
        let user;
        //Usuarios
        user = new User (this.userCounterId, "Frisk", "Kris", "Frisk#1", "Determination1", 4970100000000055, 159);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "Asgore", "Dreemurr", "Adreemurr.80", "Flowers4ever", 4970100000000113, 555);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "Antonio", "Banderas", "ABanderas-1960", "Shrek2", 4917480000000057, 784);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "Ramón", "Valdés", "DonRamon(1960)", "ElChavoDel8", 4978260000000018, 123);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "Niko", "Cat", "OneShot_2016", "Pancakes2016", 5970100300000067, 542);
        this.addUser(user);
        //Administradores
        user = new User (this.userCounterId, "admin", "admin", "Admin-1", "Admin1", 5100120000000012, 856, true);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "admin2", "admin2", "Admin-2", "Admin2", 5970100300000075, 754, true);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "admin3", "admin3", "Admin-3", "Admin3", 5970100300000083, 856, true);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "admin4", "admin4", "Admin-4", "Admin4", 5100010000000056, 941, true);
        this.addUser(user);
        this.activateUser(user.username);
        user = new User (this.userCounterId, "admin5", "admin5", "Admin-5", "Admin5", 5100010000000064, 397, true);
        this.addUser(user);
    }

    //Creacion de instancias precargadas para la aplicacion
    addInstanceToApp() {
        this.createInstance("c7.small",1);
        this.createInstance("c7.medium",1);
        this.createInstance("c7.large",1);
        this.createInstance("r7.small",1);
        this.createInstance("r7.medium",1);
        this.createInstance("r7.large",1);
        this.createInstance("i7.medium",4);
        this.createInstance("i7.large",3);
    }

    //Creacion de alquileres precargados para la aplicacion
    addInstancesToUsers() {
        this.addInstanceToUser("c7.small","Frisk#1");        
        this.addInstanceToUser("c7.medium","Frisk#1");        
        this.addInstanceToUser("c7.large","Adreemurr.80");        
        this.addInstanceToUser("r7.small","Adreemurr.80"); 
        this.addInstanceToUser("r7.medium","ABanderas-1960"); 
        this.addInstanceToUser("r7.large","ABanderas-1960"); 
        this.addInstanceToUser("i7.medium","ABanderas-1960"); 
        this.addInstanceToUser("i7.medium","DonRamon(1960)"); 
        this.addInstanceToUser("i7.large","DonRamon(1960)"); 
        this.addInstanceToUser("i7.large","ABanderas-1960"); 
    }

    //devuelve instancias en uso del usuario, para que el mismo pueda visualizarlas y manipularlas
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

    //obtiene una instancia en uso del usuario logueado por el id de la misma para apagarla o prenderla
    getInstanceInUseFromUserById(instanceId, username) {
        let user = this.getUser(username);
        for (let i = 0; i < user.instancesInUse.length; i++) {
            if (user.instancesInUse[i].instance_id == instanceId)
                return user.instancesInUse[i];
        }

        return null;        
    }   

    //funcion para obtener todas las instancias en uso para el mostrar el costo total al admin
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
        for (let i = 0; i < instancesInUseLength; i++) {
            user.instancesInUse[0].turnOnInstanceCounter = 0;
            this.availableInstances.push(user.instancesInUse[0]);
            user.instancesInUse.splice(0,1);
        }
      }
    }
}