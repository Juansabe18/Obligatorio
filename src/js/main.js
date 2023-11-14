let userLogged;
let system = new System();
let turnOnOffFilter = false;

window.addEventListener("load", loadListeners);

function loadListeners() {
    hideEverything();
    showLogin();
    document.getElementById("registerButtonLogin").addEventListener("click", showRegister);
    document.getElementById("registerButton").addEventListener("click", addUser);
    document.getElementById("backButtonRegister").addEventListener("click", showLogin);
    document.getElementById("loginButton").addEventListener("click", login);    
    document.getElementById("logoutUser").addEventListener("click", showLogin);
    document.getElementById("logoutAdmin").addEventListener("click", showLogin);
    document.getElementById("userManagmentA").addEventListener("click", showUserManagment);
    document.getElementById("virtualMachinesManagmentA").addEventListener("click", showVirtualMachinesManagment);
    document.getElementById("selectStock").addEventListener("change", getInstanceStock);
    document.getElementById("addStockQuantity").addEventListener("click", addStockQuantity);
    document.getElementById("restStockQuantity").addEventListener("click", restStockQuantity);
    document.getElementById("rentVirtualMachineA").addEventListener("click", showRentVirtualMachine);
    document.getElementById("rentVirtualMachineButton").addEventListener("click", rentInstanceToUser);
    document.getElementById("showAllInstancesUserA").addEventListener("click", showTurnOnOffInstance);
    document.getElementById("turnOnOffFilter").addEventListener("click", changeFilterValue);
    //document.getElementById("turnOn/OffInstanceA").addEventListener("click", showTurnOnOffInstance);
    document.getElementById("rentCostUserA").addEventListener("click", showRentCostUser);
    document.getElementById("showRentCostUserButton").addEventListener("click", showRentCostUser);
    document.getElementById("showRentCostUserIndividualInstance").addEventListener("click", showRentCostUserIndividualInstances);
    document.getElementById("rentCostAdminA").addEventListener("click", showRentCostAdmin);
}

function addUser() {
    let name = document.getElementById("nameInputRegister").value
    let lastName = document.getElementById("lastNameInputRegister").value
    let username = document.getElementById("usernameInputRegister").value
    let pass = document.getElementById("passInputRegister").value
    let creditCard = document.getElementById("creditCardInputRegister").value
    let cvc = document.getElementById("cvcInputRegister").value
    let newUser = system.createNewUserForValidations(name, lastName, username, pass, creditCard, cvc);
    let response = userValidations(newUser);
    let textToShow =  document.getElementById("pRegister");

    if (response == true) {
        newUser.creditCard = extractMiddleDashFromCreditCard(newUser.creditCard);
        if (system.addUser(newUser)) {            
            textToShow.innerHTML = "Usuario registrado con exito";       
            textToShow.classList.remove("errorText");     
            textToShow.classList.add("successText");            
            return;
        }
    }

    textToShow.classList.add("errorText");
    textToShow.classList.remove("successText");    
}

function userValidations(user) {

    let showText = document.getElementById("pRegister");

    if (user.name == "" || user.name.length > 15) {
        showText.innerHTML = "El nombre no puede estar vacío ni superar los 15 caracteres";        
        return false;
    }
    
    if (user.lastName == "" || user.lastName.length > 20) {
        showText.innerHTML = "El apellido no puede estar vacío ni superar los 20 caracteres";  
        return false;
    }

    if (user.username == "" || !validateUsername(user.username)) {
        showText.innerHTML = "El nombre de usuario no puede estar vacío y debe cumplir con los requisitos de tener al menos un simbolo y un numero";
        return false;    
    }

    if (user.pass == "" || !validatePass(user.pass)) {
        showText.innerHTML = "La contraseña debe tener mínimo 5 caracteres, una mayúscula, una minúscula y un número";
        return false;
    }
    
    if (!validateCreditCard(user.creditCard)) {      
        showText.innerHTML = "Tarjeta invalida";  
        return false;
    }

    if (user.cvc == "" || user.cvc.length != 3 || !validateCvc(user.cvc)) {        
        showText.innerHTML = "El codigo de verificacion no puede ser vacio, tiene que tener solo 3 caracteres y deben ser unicamente numeros";  
        return false;
    }

    if (system.getUser(user.username) != null) {
        showText.innerHTML = "Ya hay un usuario registrado con el nombre de usuario: " + user.username;  
        return false;
    }

    return true;
}


function getInstanceStock() {

    let instanceType = document.getElementById("selectStock").value;

    if (instanceType == "default") {
        document.getElementById("actualStock").innerHTML = "";
        document.getElementById("instancesInUseVirtualMachinesManagment").innerHTML = "";
        return;
    }

    let counterInstance = system.getInstanceStock(instanceType);
    let usersUsingInstanceTypeCounter = system.getInstancesInUseFromUsers(instanceType);
    document.getElementById("actualStock").innerHTML = counterInstance;
    document.getElementById("instancesInUseVirtualMachinesManagment").innerHTML = usersUsingInstanceTypeCounter;
}

function rentInstanceToUser() {
    let instanceType = document.getElementById("selectInstanceType").value;
    let response = system.addInstanceToUser(instanceType, userLogged.username);
    let textToShow = document.getElementById("rentVirtualMachineP");

    if (response) 
        textToShow.innerHTML = "Instancia añadida con exito";
    else
        textToShow.innerHTML = "No hay stock de la instancia seleccionada"

}

function login() {
    let username = document.getElementById("usernameLogin").value;
    let pass = document.getElementById("passLogin").value;
    let user = system.getUser(username);
    let textToShow = document.getElementById("pLogin");
    textToShow.classList.add("errorText");

    if (user == null || user == undefined) {
        textToShow.innerHTML = "Usuario no existe"
        return;
    }

    if (user.pass != pass) {
        textToShow.innerHTML = "La contraseña ingresada es incorrecta"
        return;
    }

    if (user.state != "Activado") {
        if (user.state == "Pendiente")
            textToShow.innerHTML = "Usuario a la espera de ser activado por un administrador"
        else 
            textToShow.innerHTML = "Usuario bloqueado contáctese con un administrador"
        return;
    }

    hideEverything();

    userLogged = user;

    if (user.admin)         
        showAdminMainSeccion();    
    else        
        showUserMainSeccion();
       
}

function showLogin() {
    hideEverything();
    turnOnOffFilter = false;
    let inputsId = ["usernameLogin", "passLogin"];    
    cleanInputs(inputsId);
    document.getElementById("pLogin").innerHTML = "";
    document.getElementById("loginDiv").style.display = "block";
}

function showRegister() {
    let inputsIds = ["nameInputRegister", "lastNameInputRegister", "usernameInputRegister", "passInputRegister", "creditCardInputRegister", "cvcInputRegister"]; 
    hideEverything();
    cleanInputs(inputsIds);
    document.getElementById("pRegister").innerHTML = "";
    document.getElementById("registerDiv").style.display = "block";
}

function showUserMainSeccion() {
    hideEverything();
    document.getElementById("userFooter").style.display = "block";
}

function showAdminMainSeccion() {
    hideEverything();
    document.getElementById("adminFooter").style.display = "block";
}

function showUserManagment() {    
    showAdminMainSeccion()  
    document.getElementById("userManagmentP").innerHTML = "";
    document.getElementById("userManagment").style.display = "block";

    let table = document.getElementById("usersBodyTable");
    table.innerHTML = "";
    let users = system.getUsers();
    let buttonsIds = [];
    for (let i = 0; i<users.length; i++) {
        table.innerHTML += `<td id="${users[i].username}Td">${users[i].username}</td> <td>${users[i].state}</td> <td><input type="button" value="Activar" id="${users[i].username}Activate"><input type="button" value="Bloquear" id="${users[i].username}Block"></td>`;    
        buttonsIds.push(`${users[i].username}`);
    }
    addEventListernerToActivateButtons(buttonsIds);
    addEventListernerToBlockButtons(buttonsIds);
}

function showRentVirtualMachine() {
    hideEverything();
    showUserMainSeccion();
    turnOnOffFilter = false;
    document.getElementById("selectInstanceType").value = "default";
    document.getElementById("rentVirtualMachineP").innerHTML = "";
    document.getElementById("rentVirtualMachine").style.display = "block";
}

function showAllInstancesUser() {
    hideEverything();
    showUserMainSeccion();
    turnOnOffFilter = false;
    let table = document.getElementById("showAllInstancesUserBodyTable");
    document.getElementById("showAllInstancesUser").style.display = "block";
    table.innerHTML = "";
    let userInstances = null;
    userInstances = system.getInstancesInUseFromUser(userLogged.username);    
    if (userInstances != null) {
        for (let i = 0; i < userInstances.length; i++) {
            table.innerHTML += `<td>${userInstances[i].type}</td> <td>${userInstances[i].state}</td> <td class="centerText">${userInstances[i].turnOnInstanceCounter}</td>`;    
        }
    }
}

function showVirtualMachinesManagment() {
    showAdminMainSeccion();    
    let inputToClean = ["stockQuantity"];
    cleanInputs(inputToClean);
    document.getElementById("actualStock").innerHTML = "";
    document.getElementById("instancesInUseVirtualMachinesManagment").innerHTML = "";
    document.getElementById("virtualMachinesManagmentP").innerHTML = "";
    document.getElementById("selectStock").value = "default";
    document.getElementById("virtualMachinesManagment").style.display = "block";
}

function addEventListernerToActivateButtons(buttonsIds) {    
    for (let i = 0; i<buttonsIds.length; i++) {
        document.getElementById(`${buttonsIds[i]}Activate`).addEventListener("click", activateUser);        
    }
}

function addEventListernerToBlockButtons(buttonsIds) {
    for (let i = 0; i<buttonsIds.length; i++) {
        document.getElementById(`${buttonsIds[i]}Block`).addEventListener("click", blockUser);

    }
}

function addEventListernerToTurnOnButtons(buttonsIds) {
    for (let i = 0; i<buttonsIds.length; i++) {
        document.getElementById(`${buttonsIds[i]}TurnOn`).addEventListener("click", turnOnInstance);
    }
}

function addEventListernerToTurnOffButtons(buttonsIds) {
    for (let i = 0; i<buttonsIds.length; i++) {
        document.getElementById(`${buttonsIds[i]}TurnOff`).addEventListener("click", turnOffInstance);

    }
}

function addStockQuantity() {
    let instanceType = document.getElementById("selectStock").value;
    let stockToAdd = Number(document.getElementById("stockQuantity").value);
    let textToShow = document.getElementById("virtualMachinesManagmentP");

    if (!isNaN(stockToAdd) && stockToAdd != 0) {
        if (instanceType != "default") 
            system.createInstance(instanceType,stockToAdd);
        else {
            textToShow.innerHTML = "Seleccione una instancia valida"
            return;
        }
    
        hideEverything();
        document.getElementById("selectStock").value = "default";
        showVirtualMachinesManagment();

        return;
    }

     textToShow.innerHTML = "Lo ingresado no es un numero o es 0";
}

function restStockQuantity() {   
    let instanceType = document.getElementById("selectStock").value;
    let stockToRest = Number(document.getElementById("stockQuantity").value); 
    let textToShow = document.getElementById("virtualMachinesManagmentP");    

    if (!isNaN(stockToRest) && stockToRest != 0) {
        if (instanceType != "default") {

            if (stockToRest > system.getInstanceStock(instanceType)) {                
                textToShow.innerHTML = "No se puede dejar el stock en negativo"
                return;
            }

            if (stockToRest > system.getInstanceStock(instanceType) - system.getInstancesInUseFromUsers(instanceType)) {                
                textToShow.innerHTML = "No se puede eliminar mas de la cantidad de Instancias en uso"
                return;
            }

            for (let i = 0; i < stockToRest; i++) {
                system.deleteFromAvailableInstances(instanceType);
            }

            textToShow.innerHTML = `Se eliminaron ${stockToRest} instancias del tipo ${instanceType} exitosamente`
           
            hideEverything();
            document.getElementById("selectStock").value = "default";
            showVirtualMachinesManagment();

            return;
        }    

        textToShow.innerHTML = "Seleccione una instancia valida"
        return;    
    }

    textToShow.innerHTML = "Lo ingresado no es un numero o es 0";
}

function showTurnOnOffInstance() {
    hideEverything();
    showUserMainSeccion();
    document.getElementById("turnOn/OffInstanceDiv").style.display = "block";
    document.getElementById("turnOn/OffInstanceP").innerHTML = "";
    let buttonValue = document.getElementById("turnOnOffFilter");
    let table = document.getElementById("turnOn/OffInstanceBodyTable");
    table.innerHTML = "";
    let user = system.getUser(userLogged.username);
    let buttonsIds = [];
    
    if (!turnOnOffFilter) {
        buttonValue.value = "Activar filtro por encendido/apagado";
        if (user != null && user.instancesInUse.length > 0) {
            for (let i = 0; i < user.instancesInUse.length; i++) {
                table.innerHTML += `<td id="${user.instancesInUse[i].instance_id}Td" class="centerText">${user.instancesInUse[i].instance_id}</td><td>${user.instancesInUse[i].type}</td> <td>${user.instancesInUse[i].state}</td> <td class="centerText">${user.instancesInUse[i].turnOnInstanceCounter}</td> <td><input type="button" value="Prender" id="${user.instancesInUse[i].instance_id}TurnOn"><input type="button" value="Apagar" id="${user.instancesInUse[i].instance_id}TurnOff"></td>`;    
                buttonsIds.push(`${user.instancesInUse[i].instance_id}`);
            }
            addEventListernerToTurnOnButtons(buttonsIds);
            addEventListernerToTurnOffButtons(buttonsIds);
        }
    }
    else {
        buttonValue.value = "Desactivar filtro por encendido/apagado";
        if (user != null && user.instancesInUse.length > 0) {
            //Recorre las instancias 2 veces, la primera para llenar datos de instancias encendidas y la segunda para instancias apagadas
            for (let counter = 0; counter < 2; counter++) {                
                for (let i = 0; i < user.instancesInUse.length; i++) {
                    if (counter == 0) {
                        if (user.instancesInUse[i].state == "Encendida") {
                            table.innerHTML += `<td id="${user.instancesInUse[i].instance_id}Td" class="centerText">${user.instancesInUse[i].instance_id}</td><td>${user.instancesInUse[i].type}</td> <td>${user.instancesInUse[i].state}</td> <td class="centerText">${user.instancesInUse[i].turnOnInstanceCounter}</td> <td><input type="button" value="Prender" id="${user.instancesInUse[i].instance_id}TurnOn"><input type="button" value="Apagar" id="${user.instancesInUse[i].instance_id}TurnOff"></td>`;    
                            buttonsIds.push(`${user.instancesInUse[i].instance_id}`);
                        }
                    }
                    if (counter == 1) {
                        if (user.instancesInUse[i].state == "Apagada") {
                            table.innerHTML += `<td id="${user.instancesInUse[i].instance_id}Td" class="centerText">${user.instancesInUse[i].instance_id}</td><td>${user.instancesInUse[i].type}</td> <td>${user.instancesInUse[i].state}</td> <td class="centerText">${user.instancesInUse[i].turnOnInstanceCounter}</td> <td><input type="button" value="Prender" id="${user.instancesInUse[i].instance_id}TurnOn"><input type="button" value="Apagar" id="${user.instancesInUse[i].instance_id}TurnOff"></td>`;    
                            buttonsIds.push(`${user.instancesInUse[i].instance_id}`);
                        }
                    }
                }
            }
            addEventListernerToTurnOnButtons(buttonsIds);
            addEventListernerToTurnOffButtons(buttonsIds);
        }
    }
    

}

function changeFilterValue() {
    if (turnOnOffFilter) {
        turnOnOffFilter = false;
    }    
    else {
        turnOnOffFilter = true;
    }
    showTurnOnOffInstance();
}



//Funcion que muestra los gastos de las instancias de manera individual
 function showRentCostUserIndividualInstances() {
    hideEverything();
    showUserMainSeccion();
    document.getElementById("rentCostUserIndividualInstanceDiv").style.display = "block";
    let table = document.getElementById("rentCostUserIndividualBodyTable");
    table.innerHTML = "";
    let userInstances = system.getInstancesInUseFromUser(userLogged.username);
    if (userInstances != null) {
        for (let i = 0; i < userInstances.length; i++) {
            table.innerHTML += `<td class="centerText">${userInstances[i].instance_id}</td> <td class="centerText">${userInstances[i].type}</td> <td class="centerText">${userInstances[i].turnOnCost}</td> <td class="centerText">${userInstances[i].turnOnInstanceCounter}</td> <td class="centerText">U$S ${calculateTotalCostInstance(userInstances[i])}</td>`;    
        }
    }
} 

function showRentCostUser() {
    hideEverything();
    showUserMainSeccion();
    document.getElementById("rentCostUserDiv").style.display = "block";
    let table = document.getElementById("rentCostUserBodyTable");
    table.innerHTML = "";
    let userInstances = system.getInstancesInUseFromUser(userLogged.username);
    let instancesType = ["c7.small", "c7.medium", "c7.large", "r7.small", "r7.medium", "r7.large", "i7.medium", "i7.large"];
    let totalCostSum;
    let turnOnInstanceCounter;
    let turnOnCost;
    if (userInstances != null) {
        for (let i = 0; i < instancesType.length; i++) {
            totalCostSum = 0;
            turnOnInstanceCounter = 0;
            turnOnCost = 0;
            for (let j = 0; j < userInstances.length; j++) {
                if (instancesType[i] == userInstances[j].type) {
                    totalCostSum += calculateTotalCostInstance(userInstances[j]);
                    turnOnInstanceCounter += userInstances[j].turnOnInstanceCounter;
                    turnOnCost = userInstances[j].turnOnCost;
                }                
            }
            if (totalCostSum != 0 && turnOnInstanceCounter != 0 && turnOnCost != 0)
                table.innerHTML += `<td class="centerText">${instancesType[i]}</td> <td class="centerText">${turnOnCost}</td> <td class="centerText">${turnOnInstanceCounter}</td> <td class="centerText">U$S ${totalCostSum}</td>`;    
        }
    }
}

function showRentCostAdmin() {
    hideEverything();
    showAdminMainSeccion();
    document.getElementById("rentCostAdminDiv").style.display = "block";
    let table = document.getElementById("rentCostAdminBodyTable");
    let sumToShow = document.getElementById("rentCostAdminP");
    sumToShow.innerHTML = "";
    table.innerHTML = "";
    let usersInstances = system.getAllInstancesInUse();
    let instancesType = ["c7.small", "c7.medium", "c7.large", "r7.small", "r7.medium", "r7.large", "i7.medium", "i7.large"];
    let instanceTypeInUseCounter = 0;
    let totalCostOfInstancesType = 0;
    let totalCostSum = 0;
    let sumAux = 0;
    if (usersInstances.length != 0) {
        for (let i = 0; i < instancesType.length; i++) {
            instanceTypeInUseCounter = 0;
            totalCostOfInstancesType = 0;
            for (let j = 0; j < usersInstances.length; j++) {
                if (instancesType[i] == usersInstances[j].type) {
                    instanceTypeInUseCounter++;
                    sumAux = calculateTotalCostInstance(usersInstances[j]);
                    totalCostOfInstancesType += sumAux;
                    totalCostSum += sumAux;
                }
            }
            table.innerHTML += `<td class="centerText">${instancesType[i]}</td> <td class="centerText">${instanceTypeInUseCounter}</td> <td class="centerText">${totalCostOfInstancesType}</td>`;    
        }
        sumToShow.innerHTML = `Ganancia Total: $ ${totalCostSum}`;
    }
}

function turnOnInstance() {
    let instanceId = this.id.substring(0,this.id.length-6);
    let instance = system.getInstanceInUseFromUserById(instanceId, userLogged.username);
    let textToShow = document.getElementById("turnOn/OffInstanceP");

    if (instance.state == "Encendida") {
        textToShow.innerHTML = "La instancia ya se encuentra encendida"
        return;
    }

    if (system.turnOnInstance(instance.instance_id, userLogged.username)) {
        textToShow.innerHTML = "Prendida con exito";
        showTurnOnOffInstance();
    }
    else
        textToShow.innerHTML = "Error prendiendo la instancia contactese con un administrador";
}

function turnOffInstance() {
    let instanceId = this.id.substring(0,this.id.length-7);
    let instance = system.getInstanceInUseFromUserById(instanceId, userLogged.username);
    let textToShow = document.getElementById("turnOn/OffInstanceP");

    if (instance.state == "Apagada") {
        textToShow.innerHTML = "La instancia ya se encuentra apagada"
        return;
    }

    if (system.turnOffInstance(instance.instance_id, userLogged.username)) {
        textToShow.innerHTML = "Apagada con exito";
        showTurnOnOffInstance();
    }
    else
        textToShow.innerHTML = "Error apagando la instancia contactese con un administrador";
}

function activateUser() { 
    let username = this.id.substring(0,this.id.length-8);
   
    if (system.activateUser(username))        
        showUserManagment();    
    else
        document.getElementById("userManagmentP").innerHTML = `El usuario ${username} ya esta activado`;        
}

function blockUser() {    
    let username = this.id.substring(0,this.id.length-5);

    if (system.blockUser(username)) 
        showUserManagment();
    else 
        document.getElementById("userManagmentP").innerHTML = `El usuario ${username} ya esta bloqueado`;
}

function hideEverything() {
    let divs = document.querySelectorAll("div");
    for (let i = 0; i<divs.length;i++){
        divs[i].style.display = "none";
    }
}

function validateUsername(username) {
    let numberFound = false;
    let symbolFound = false;

    for (let i = 0; i<username.length; i++) { 
        if (!isNaN(username.charAt(i))){
            numberFound = true;
        }
        if (username.charAt(i).toUpperCase() == username.charAt(i).toLowerCase() && isNaN(username.charAt(i))) {
            symbolFound = true;
        }
    }

    if (!numberFound || !symbolFound) 
        return false;

    return true;    
}

function validatePass(pass) {

    if (pass.length < 5)
        return false;

    let numberFound = false;
    let upperCaseFound = false;
    let lowerCaseFound = false;    

    for (let i = 0; i < pass.length; i++) {
        if (pass.charCodeAt(i)>= 65 && pass.charCodeAt(i) <= 90)
            upperCaseFound = true;
        if (pass.charCodeAt(i)>= 97 && pass.charCodeAt(i) <= 122)
            lowerCaseFound = true;
        if (!isNaN(pass.charAt(i)))
            numberFound = true;
    }

    if (!numberFound || !upperCaseFound || !lowerCaseFound)
        return false;

    return true;
}

function validateCreditCard(creditCard) {
    let numbersLength = 0;
    let notNumberFoundCounter = 0;    

    for (let i = 0; i<creditCard.length; i++) {
        if (!isNaN(creditCard.charAt(i)))    
            numbersLength++;
        else if (creditCard.charAt(i) != "-")
            notNumberFoundCounter++;
    }

    if (numbersLength != 16  || notNumberFoundCounter != 0 ) {
        return false;
    }

    if (!validateCreditCardWithLuhnAlghoritm(extractMiddleDashFromCreditCard(creditCard)))
        return false;

    return true;
}

function validateCvc(cvc) {

    let numberCounters = 0;

    for (let i = 0; i<cvc.length; i++) {
        if (!isNaN(cvc.charAt(i)))
            numberCounters++;
    }

    return numberCounters==3;
    
}

function extractMiddleDashFromCreditCard(creditCard) {
    let creditCardWithoutMidddleDash = "";
    for (let i = 0; i < creditCard.length; i++) {
        if (!isNaN(creditCard.charAt(i)))
            creditCardWithoutMidddleDash += creditCard.charAt(i);
    }
    return creditCardWithoutMidddleDash;
}

function calculateTotalCostInstance(instance) {
    let finalCost = instance.rentalCost;

    if (instance.turnOnInstanceCounter-1 <= 0)
        return finalCost;

    finalCost += instance.turnOnCost * (instance.turnOnInstanceCounter-1);
    return finalCost;
}

function validateCreditCardWithLuhnAlghoritm(creditCardNumber){
    let response = algoritmoLuhn(creditCardNumber);
    return response;
}

function cleanInputs(inputsIds) {
    if (inputsIds != null && inputsIds != undefined){
        for (let i = 0 ; i < inputsIds.length; i++) {
            document.getElementById(`${inputsIds[i]}`).value = "";
        }
    } 
}


/* --- Algoritmo de Luhn creditos a Mauro Gastón Nacimento Botta y Gustavo Adolfo García Blanco ---  */

function algoritmoLuhn(pNumero) {
    /*Se estara iterando numero a numero, desde el final del string hasta el primer caracter, se estarán
      sumando y sustituyendo por duplicado cuando sea par, ya que sería el segundo nro. */
    let suma = 0;
    let digitoVerificadorX = Number(pNumero.charAt(pNumero.length - 1));
    let contador = 0; //para saber cuando estamos en los segundos, lo pares.
    let haynro = true;
    let i = pNumero.length - 2; //el penúltimo.
  
  
    //Mientras los numeros sea mayor o igual a 0 se estara tomando cada caracter
    while (i >= 0 && haynro) {
      //Obtener el numero
      let caracter = pNumero.charAt(i);
      //Valida que el número sea válido
      if (!isNaN(caracter)) {
        let num = Number(caracter);
        //Duplicando cada segundo dígito
        if (contador % 2 == 0) {
          num = duplicarPar(num); //porque si es mayor a 9 se deben sumar.
        }
        suma += num;
      } else {
        haynro = false;
      }
      i--;
      contador++;
    }
    let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
    let modulodelasumaValiado = checkModulo(suma, digitoVerificadorX);
    return digitoVerificadorValido && modulodelasumaValiado;
  
  }
  
  function duplicarPar(pNum) {
    pNum = pNum * 2;
    if (pNum > 9) {
      /*Si el resultado del multiplicación es mayor a 9 entonces lo descomponemos y sumamos. 
       Como el numero sera x>=10 && x<=19
       Entonces es 1+(num % 10) 1 más el resto de dividir entre 10.*/
      pNum = 1 + (pNum % 10);
    }
    return pNum;
  }
  
  function checkDigito(pSuma, pDigito) {
    /* 1. Calcular la suma de los dígitos (67).
  2. Multiplicar por 9 (603).
  3. Tomar el último dígito (3).
  4. El resultado es el dígito de chequeo.*/
    let total = 9 * pSuma;
    let ultimoNro = total % 10
    return ultimoNro === pDigito;
  }
  
  function checkModulo(pSuma, pDigito) {
    /*
    Si el total del módulo 10 es igual a O (si el total termina en cero), entonces el número es válido 
  de acuerdo con la fórmula Luhn, de lo contrario no es válido.
    */
    let total = pSuma + pDigito;
    let validacionFinal = false;
    if (total % 10 === 0 && total !== 0) {
      validacionFinal = true;
    }
    return validacionFinal;
  }
  


