
//for Register and Login
        let logReg = document.getElementById('logReg')
        let registerForm = document.getElementById('registerForm')
        let usernameInputReg = document.getElementById('registerUsername');
        let passwordInputReg = document.getElementById('registerPassword')
        registerForm.addEventListener('submit', function(event){
            event.preventDefault();
            let usernameReg = usernameInputReg.value;
            let passwordReg = passwordInputReg.value;
            userStorage.register(usernameReg, passwordReg)
        })
        let loginForm = document.getElementById('loginForm')
        let usernameInputLog = document.getElementById('loginUsername');
        let passworInputdLog = document.getElementById('loginPassword');
        loginForm.addEventListener('submit', function(event){
            event.preventDefault();
            let usernameLog = usernameInputLog.value;
            let passwordLog = passworInputdLog.value;
            console.log(usernameLog, passwordLog)
            if(userStorage.login(usernameLog, passwordLog)){
                homepage.style.display = "block"
                logReg.style.display = "none"
                navbar.style.display = "block"
                loadAllCountries();
            }
        })

        let loginContain = document.getElementById('login')
        let registerContain = document.getElementById('register')
        registerContain.style.display = "none"
        function toggleLogReg(type){
            if(type == 'login'){
                loginContain.style.display = "block";
                registerContain.style.display = "none";
            }else{
                loginContain.style.display = "none";
                registerContain.style.display = "block";
            }
        }

    ///After login
    let navbar = document.getElementById('navbar')
    let parentOfLi = document.getElementById("parentOfLi");
    let lis = parentOfLi.getElementsByTagName("li");
    lis[0].addEventListener("click", function(){
        homepage.style.display = "block"
        myLocations.style.display = "none"
    })
    lis[1].addEventListener("click", function(){
        homepage.style.display = "none"
        myLocations.style.display = "block"
        forecastPage.style.display = "none";
        renderFavLocations();
    })
    let homepage = document.getElementById("homepage")
    let myLocations = document.getElementById('myLocations')
    myLocations.style.display = "none"
    let forecastPage = document.getElementById("forecast");
    forecastPage.style.display = "none";
    let isUserLogged = localStorage.getItem("loggedUser");
    if(isUserLogged){
        logReg.style.display = "none";
        homepage.style.display = "block"
        navbar.style.display = "block"
        loadAllCountries();
    }else{
        logReg.style.display = "block";
        homepage.style.display = "none"
        navbar.style.display = "none"
    }

    let inputValue = document.getElementById("searchCountries");
    inputValue.addEventListener("keyup", function(event){
        let searchVal = event.target.value;
        if(searchVal.trim() !== ""){
            autocomCountry(searchVal);
        }else{
            loadAllCountries();
        }
    })

//HOMEPAGE
    let containerResultSearch = document.getElementById("containerResultSearch");
//homepage search
    function autocomCountry(searchVal){
        fetch(`https://restcountries.com/v3.1/name/${searchVal} `)
        .then(resp => resp.json())
        .then(data => {
            renderCoutries(data)
        }) 
    }

//homogage ALL COUTRIES
    function loadAllCountries(){
        fetch("https://restcountries.com/v3.1/all")
        .then(resp => resp.json())
        .then(data => {
            renderCoutries(data)
        })
    }
    function renderCoutries(coutries){
        containerResultSearch.innerHTML = "";
    
            let user = localStorage.getItem('loggedUser');
            let allUsers = JSON.parse(localStorage.getItem('users'));
            let loggedUser = allUsers.filter(u => u.email === user)[0];
    
            if(coutries){
                coutries.forEach(country => {
                    let isLiked = false;
                    loggedUser.favoriteLocations.forEach(loc => {
                        if(loc.name.official == country.name.official){
                            isLiked = true;
                        }
                    })
                    createCoutry(country, isLiked, coutries)
                });
            }else{
                containerResultSearch.innerText = "Something went wrong"
            }
        }

// CREATING COUTRY CARDS
    function createCoutry(country, isLiked, allCountries){
        let card = document.createElement("div");
            card.classList.add("card");
            card.style.width = "22rem";
            let img = document.createElement("img")
            img.classList.add("card-img-top");
            img.alt ="Country Flag"
            if(country.flags && country.flags.png){
                img.src = country.flags.png;
            }
            let cardBody = document.createElement("div")
            cardBody.classList.add("card-body")
            let countryName = document.createElement("h3");
            countryName.innerText = country.name.official;
            countryName.classList.add("card-title")
            let capital = document.createElement("p");
            capital.classList.add("card-text");
            if( country.capital){
                capital.innerText = country.capital[0];
            }else{
                capital.innerText = "N/A";
            }
            let buttons =document.createElement("div")
            let buttonForecast = document.createElement("button");
            buttonForecast.innerText = "Chek Forecast"
            buttonForecast.classList.add("btn")
            buttonForecast.classList.add("btn-primary")
            buttonForecast.addEventListener("click", function(){
                loadForecastCountry(country)
            })
            let buttonFavLoc = document.createElement("button");
            if(isLiked){
                buttonFavLoc.innerText = "Remove";
                buttonFavLoc.addEventListener("click", function(){
                    removeFromFav(country.name.official, allCountries);

                })
            }else{
                 buttonFavLoc.innerText = "Add to favorites";
                 buttonFavLoc.addEventListener("click", function(){
                    addToFav(country, allCountries);

                })
            }
           
            buttonFavLoc.classList.add("btn")
            buttonFavLoc.classList.add("btn-primary")
            buttonFavLoc.style.marginLeft= "1rem"
            
            buttons.append(buttonForecast, buttonFavLoc)
            cardBody.append(countryName, capital, buttons);
            card.append(img, cardBody);
            containerResultSearch.appendChild(card);
    }
//ADD TO FAV LOCATIONS
    function addToFav(countryName, allCountries){
        let user = localStorage.getItem('loggedUser');
            let allUsers = JSON.parse(localStorage.getItem('users'));
            allUsers.forEach((u) => {
                if(u.email === user) {
                    u.favoriteLocations.push(countryName)
                }
            });
            localStorage.setItem('users',JSON.stringify(allUsers));
            renderCoutries(allCountries);
    }
//REMOVE FROM FAV LOCATIONS
    function removeFromFav(countryName, allCountries){
        let user = localStorage.getItem('loggedUser');
            let allUsers = JSON.parse(localStorage.getItem('users'));
            allUsers.forEach((u) => {
                if(u.email === user) {
                    u.favoriteLocations = u.favoriteLocations.filter(el => el.name.official != countryName)
                }
            });
            localStorage.setItem('users',JSON.stringify(allUsers));
            if(renderPage == "homepage"){
                renderCoutries(allCountries);
            }else{
                renderFavLocations()
            }   
    }


/// for FORECAST OF THE COUNTRY
    function loadForecastCountry(country){
        homepage.style.display="none";
        forecastPage.style.display = "block";
        myLocations.style.display = "none";
        let countryName = country.name.official;
        if(countryName){
           fetch(`https://restcountries.com/v3.1/name/${countryName}`)
           .then(resp => resp.json())
           .then(data => {
            if(data[0].latlng){
                getInfoCountry(data[0])
            }
           })

        }else{
            let errorDiv = document.createElement("div");
            errorDiv.innerText = "Something went wrong"
        }
    }
    function getInfoCountry(data){
        let latitude = data.latlng[0];
        let longitude = data.latlng[1];
     fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`)
     .then(res => res.json())
     .then(loglat => {
        renderForecastCard(data, loglat.properties)

     })  
    }
    function renderForecastCard(country, loglat){
        forecastPage.innerHTML = "";
        let card = document.createElement("div");
            card.classList.add("card");
            card.style.width = "100%";
            let img = document.createElement("img")
            img.classList.add("card-img-top");
            img.alt ="Country Flag"
            img.style.width = "18rem"
            if(country.flags && country.flags.png){
                img.src = country.flags.png;
            }
            let cardBody = document.createElement("div")
            cardBody.classList.add("card-body")
            let countryName = document.createElement("h3");
            countryName.innerText = country.name.official;
            countryName.classList.add("card-title")

            let forecastContain = document.createElement("div")
            forecastContain.style.display = "flex";
            for(let i=0; i < 6; i++){
                let box = document.createElement("div");
                box.style.width = "15%"
                box.style.border = "1px solid black"
                let hours = document.createElement("span");
                hours.style.marginRight = "0.5rem"
                let temperature = document.createElement("span");
                hours.innerText = `Date and hour: 
                ${loglat.timeseries[i].time}`;
                temperature.innerText = `
                Temperature:
                ${loglat.timeseries[i].data.instant.details.air_temperature} degreese`;
                box.append(hours, temperature);
                forecastContain.appendChild(box);
            }
            cardBody.append(countryName, forecastContain);
            card.append(img, cardBody);
            forecastPage.append(card)
    }

// RENDER FAV LOCATIONS IN THE FAV PAGE
function renderFavLocations(){
    let user = localStorage.getItem('loggedUser');
    let allUsers = JSON.parse(localStorage.getItem('users'));
    let loggedUser = allUsers.filter(u => u.email === user)[0];
    
    createFavCoutries(loggedUser.favoriteLocations);
}

function createFavCoutries(locations){
    console.log(locations)
    myLocations.innerHTML = "";
    locations.forEach(country =>{
        let card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "22rem";
        let img = document.createElement("img")
        img.classList.add("card-img-top");
        img.alt ="Country Flag"
        if(country.flags && country.flags.png){
            img.src = country.flags.png;
        }
        let cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
        let countryName = document.createElement("h3");
        countryName.innerText = country.name.official;
        countryName.classList.add("card-title")
        let capital = document.createElement("p");
        capital.classList.add("card-text");
        if( country.capital){
            capital.innerText = country.capital[0];
        }else{
            capital.innerText = "N/A";
        }
        let buttons =document.createElement("div")
        let buttonForecast = document.createElement("button");
        buttonForecast.innerText = "Chek Forecast"
        buttonForecast.classList.add("btn")
        buttonForecast.classList.add("btn-primary")
        buttonForecast.addEventListener("click", function(){
            loadForecastCountry(country)
        })
        let buttonFavLoc = document.createElement("button");
            buttonFavLoc.innerText = "Remove";
            buttonFavLoc.addEventListener("click", function(){
                removeFromFav(country.name.official, locations);
                createFavCoutries(locations)
            })
       
        buttonFavLoc.classList.add("btn")
        buttonFavLoc.classList.add("btn-primary")
        buttonFavLoc.style.marginLeft= "1rem"
        
        buttons.append(buttonForecast, buttonFavLoc)
        cardBody.append(countryName, capital, buttons);
        card.append(img, cardBody);
        myLocations.appendChild(card);
    })
   
}