document.addEventListener('DOMContentLoaded', function () {
  const signUpBtn = document.getElementById('signUp');
  signUpBtn.addEventListener('click', registerNewProfile);
  const logInBtn = document.getElementById('logIn');
  logInBtn.addEventListener('click', logIn);
  const signOutBtn = document.getElementById('logOut');
  signOutBtn.addEventListener('click', logOut);
  const loadUsersBtn = document.getElementById('loadUsers');
  loadUsersBtn.addEventListener('click', loadUsers);
  const createUserBtn = document.getElementById('createUser');
  createUserBtn.addEventListener("click", createUser2);

});

//1. Rekisteröi uusi käyttäjä
async function registerNewProfile() {
  const signUpSuccessfulDiv = document.getElementById('signUpSuccessful');
  const signUpBtn = document.getElementById('signUp');
  try {
    const reply = await signUp(); //apiservice.js läydät tämän fetch kutsun
    signUpSuccessfulDiv.classList.remove('d-none');
    signUpSuccessfulDiv.classList.add('d-block'); //div näkyville
    signUpSuccessfulDiv.textContent = "Registration successful. Status:" + reply.status + ", Token: " + reply.token; //divin sisältö
    signUpBtn.setAttribute('disabled', true); //tehdään button ei-aktiiviseksi
  } catch (error) {
    alert(error); //jos tapahtuu virhe, niin näytetään käyttäjälle alert-ikkuna
    console.error("Error during sign up: ", error); //jos tapahtuu virhe, niin tulostetaan konsoliin myös
  }
}

//2. Kirjaudu sisään
async function logIn() {
  const logInSuccessfulDiv = document.getElementById('logInSuccessful');
  const signUpSuccessfulDiv = document.getElementById('signUpSuccessful');
  const signUpBtn = document.getElementById('signUp');
  const logInBtn = document.getElementById('logIn');
  const signOutBtn = document.getElementById('logOut');
  try {
    const reply = await loginUser();
    signUpSuccessfulDiv.classList.remove('d-block'); //aiempi info-div piiloon
    signUpSuccessfulDiv.classList.add('d-none');
    logInSuccessfulDiv.classList.remove('d-none'); //kirjautumisen onnistuminen esille
    logInSuccessfulDiv.classList.add('d-block');
    logInSuccessfulDiv.textContent = "You are logged in as user: " + reply.email;

    //laitetaan piiloon signIn ja logIn nappulat ja logOut nappula esille
    signUpBtn.style.display = "none";
    logInBtn.style.display = "none";
    signOutBtn.classList.remove('d-none');
    signOutBtn.classList.add('d-block');

  } catch (error) {
    alert(error);
    console.error("Error during logging in: ", error);
  }
}

//kirjaudu ulos
function logOut() {
  const logInSuccessfulDiv = document.getElementById('logInSuccessful');
  const signUpBtn = document.getElementById('signUp');
  const logInBtn = document.getElementById('logIn');
  const signOutBtn = document.getElementById('logOut');

  logInSuccessfulDiv.classList.remove('d-block'); //aiempi ilmoitusloota piiloon
  logInSuccessfulDiv.classList.add('d-none');

  //Buttonit esille eri tavalla
  signUpBtn.style.display = "";
  logInBtn.style.display = "";
  signOutBtn.classList.remove('d-block');
  signOutBtn.classList.add('d-none');
  signUpBtn.removeAttribute('disabled'); //tehdään sigUp-button taas aktiiviseksi
}

//3. serveriltä haetaan user-sivujen lukumäärä ja luodaan sen mukaisesti sivupainikkeita
async function loadUsers() {
  //infoDiv piiloon, jos se oli näkyvillä
  const infoDiv = document.getElementById("info");
  infoDiv.classList.remove('d-block');
  infoDiv.classList.add('d-none');

  try {
    const totalPages = await getPageCount(); //haetan sivumäärä
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = ""; //Jos käyttäjä painaa peräkkäin "loadUsers"-nappia, niin tyhjätään vanhat napit pois
    for (let i = 1; i <= totalPages; i++) {
      //Luodaan sivuille painikkeet
      let button = document.createElement('button');
      button.textContent = "Page " + i;
      button.addEventListener('click', async function () { //tapahtumakäsittelijä buttonille
        try {
          // 4. Sivupainikkeista haetaan ko. sivullinen käyttäjätietoja, kaikki kentät näytetään
          const users = await fetchUserData(i);
          //näytetään käyttäjät taulukossa
          displayUsersInTable(users);
        } catch (error) {
          console.error("Error fetching users. Page: " + i, error);
        }
      });
      //Lisätään painike diviin 
      paginationDiv.appendChild(button);
    }
    //Kun painetaan "load users", niin taulukkoon tulee aina 1 sivun käyttäjät automaattisesti
    const users = await fetchUserData(1); // Voit valita sivunumeron tässä
    displayUsersInTable(users);
  } catch (error) {
    console.error("Error fetching users", error);
  }
}

//4. Näytä haetut käyttäjät
function displayUsersInTable(users) {
  const tableBody = document.querySelector("#user-data tbody");

  // Tyhjennä taulukon sisältö ennen kuin lisäät uudet käyttäjät
  tableBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");

    // Luo ja lisää käyttäjän tiedot soluihin
    const userIdCell = document.createElement("td");
    userIdCell.textContent = user.id;
    row.appendChild(userIdCell);

    const avatarCell = document.createElement("td");
    avatarCell.innerHTML = `<img src="${user.avatar}" alt="Avatar" width="50" height="50" style="border-radius: 50%">`; //pyöreä kuva
    row.appendChild(avatarCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    const firstNameCell = document.createElement("td");
    firstNameCell.textContent = user.first_name;
    row.appendChild(firstNameCell);

    const lastNameCell = document.createElement("td");
    lastNameCell.textContent = user.last_name;
    row.appendChild(lastNameCell);

    //5. jokaiselle käyttäjälle luodaan päivityspainike ja...
    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-info", "m-1"); // Lisää Bootstrap-luokat
    editButton.setAttribute("type", "button");
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "editModal");// Lisää painikkeen tyyppi
    actionsCell.appendChild(editButton);
    //Tapahtumakäsittelijä edit-buttonille
    editButton.addEventListener('click', function () {
      newEditModal(user);
    });

    //5. ...Poistopainike
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger", "m-1"); // Lisää Bootstrap-luokat
    deleteButton.setAttribute("type", "button"); // Aseta painikkeen tyyppi
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);
    //tapahtumakäsittelijä deletebuttonille
    deleteButton.addEventListener('click', function () {
      deleteUser(user, users);
    });

    // Lisää rivi taulukon bodyyn
    tableBody.appendChild(row);
  });
}

//6. Muokkaa käyttäjää  ja serverin vastaus näytetään
function newEditModal(user) {

  // Tämä avaa modaaliruudun
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();

  const emailInput = document.getElementById('email');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');

  // Aseta vanhan käyttäjän tiedot lomakkeeseen
  emailInput.value = user.email;
  firstNameInput.value = user.first_name;
  lastNameInput.value = user.last_name;

  const saveChangesButton = document.getElementById('saveChanges');
  saveChangesButton.addEventListener('click', async function () { //Vie muutos serverille
    const infoDiv = document.getElementById("info");
    try {
      // Otetaan lomakkeen kenttien arvot
      const updatedEmail = emailInput.value;
      const updatedFirstName = firstNameInput.value;
      const updatedLastName = lastNameInput.value;

      const reply = await updateUserData(user, updatedEmail, updatedFirstName, updatedLastName);
      infoDiv.classList.remove('d-none');
      infoDiv.classList.add('d-block');
      infoDiv.textContent = "Operation succeeded! Server response:" + JSON.stringify(reply);

      editModal.hide();
    } catch (error) {
      alert("Something went wrong" + error.message);
    }
  });
}

//7. Poista käyttäjä 
async function deleteUser(user, users) {
  const userId = user.id;
  const kayttajalista = users;
  try {
    const reply = await deletePerson(userId); //viedään serverille

    // Poista käyttäjä listasta, jos käyttäjä löytyy
    const index = kayttajalista.findIndex(u => u.id === userId);
    if (index !== -1) {
      kayttajalista.splice(index, 1);
    }
    // Päivitä käyttäjälista uudelleen taulukkoon
    displayUsersInTable(kayttajalista);
  }
  catch (error) {
    alert("Deletion failed" + error);
  }

  const infoDiv = document.getElementById("info");
  infoDiv.classList.remove('d-block');
  infoDiv.classList.add('d-none');
}

//8. luodaan uusi käyttäjä ja serverin vastaus näytetään
async function createUser2() {

  const infoDiv = document.getElementById("info");
  infoDiv.classList.remove('d-block');
  infoDiv.classList.add('d-none');

  // Tämä avaa modaaliruudun
  const newModal = new bootstrap.Modal(document.getElementById('newModal'));
  newModal.show();

  const emailInput = document.getElementById('newEmail');
  const firstNameInput = document.getElementById('newFirstName');
  const lastNameInput = document.getElementById('newLastName');

  //tyhjennä lomake
  emailInput.value = "";
  firstNameInput.value = "";
  lastNameInput.value = "";

  // Lähetetään tiedot uuden käyttäjän luomiseksi
  const saveChangesButton = document.getElementById('saveChanges2');
  saveChangesButton.addEventListener('click', async function () {
    const infoDiv = document.getElementById("info");
    try {
      // Otetaan lomakkeen kenttien arvot
      const email = emailInput.value;
      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;

      const reply = await createNewUser(email, firstName, lastName); // Luo uusi käyttäjä
      infoDiv.classList.remove('d-none');
      infoDiv.classList.add('d-block');
      infoDiv.textContent = "Operation succeeded! Server response:" + JSON.stringify(reply);

      newModal.hide(); // Piilota modaali onnistuneen luonnin jälkeen
    } catch (error) {
      alert("jotain meni pieleen" + error.message);
    }
  });
}


