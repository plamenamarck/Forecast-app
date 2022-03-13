let userStorage = (function(){

    class User{

        constructor(email, pass){
            this.email = email;
            this.pass = pass;
            this.favoriteLocations = [];
            this.id = (Math.random() * 100 + Math.random() * 100);
        }
    }

    class UserStorage{

        constructor(){
            this.users = JSON.parse(localStorage.getItem("users")) || [];
        }

        register(email, pass) {
            if(!this.users.some(u => u.email === email)){
                this.users.push(new User(email, pass));
                localStorage.setItem("users", JSON.stringify(this.users));
                return true;
            }
            else{
                return false;
            }
            
        }

        login(email, pass){
            if(this.users.some(u => u.email === email && u.pass == pass)){
                localStorage.setItem("loggedUser", email);
                return true;
            }
            else{
                return false;
            }
        }
    }

    let storage = new UserStorage();
    return storage;
})()