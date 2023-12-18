//1. Rekisteröityminen
async function signUp() {
  try {
    const response = await fetch('https://reqres.in/api/register', { //POST-pyyntö
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": "eve.holt@reqres.in", "password": "cityslicka" }),
    });

    if (!response.ok) { //Jos vastaus ei ole ok
      throw new Error('Failed to sign up: ' + response.status); //virheviesti
    } else {
      const data = await response.json();
      data.status = response.status; // Lisätään vastauksen tilakoodi `status`-ominaisuutena vastauksen dataan
      return data; // Palautetaan saatu data tai tarvittavat tiedot onnistuneesta rekisteröitymisestä
    }
  } catch (error) {
    console.error('Error during signup:', error.message);
    throw error; 
  }
}

//2. sisäänkirjautuminen
async function loginUser() {
  //Valmiit kovakoodatut tunnukset serverin päähän 
  const email = "eve.holt@reqres.in";
  const password = "cityslicka";
  try {
    const response = await fetch('https://reqres.in/api/login', { //POST-pyyntö
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });

    if (!response.ok) { //Jos vastaus ei ole ok
      throw new Error('Logging failed: ' + response.status); //virheviesti
    } else {
      const data = await response.json();
      data.status = response.status;     // Lisätään vastauksen tilakoodi `status`-ominaisuutena vastauksen dataan
      data.email = email;
      return data; // Palautetaan saatu data ja tarvittavat tiedot onnistuneesta rekisteröitymisestä
    }
  } catch (error) {
    console.error('Error during logging in:', error.message);
    throw error; // Heitetään virhe jotta se voidaan käsitellä kutsuvassa koodissa
  }
}

3. //Haetaan serveriltä user-sivujen lukumäärä
async function getPageCount() {
  try {
    const response = await fetch('https://reqres.in/api/users');
    if (!response.ok) {
      throw new Error("Error loading page : ${response.status}");
    } else {
      const data = await response.json();
      return data.total_pages; //palauta sivujen määrä
    }
  } catch (error) {
    console.error("Error loading page: ", error)
  }
}

//4. haetaan sivun käyttäjät
async function fetchUserData(page) {
  try {
    const response = await fetch(`https://reqres.in/api/users?page=${page}`);
    if (!response.ok) {
      throw new Error("Error : ${response.status}");
    } else {
      const data = await response.json();
      return data.data; //palauttaa käyttäjät
    }
  } catch (error) {
    console.error("Error", error);
  }
}

//6. Päivitä käyttäjän tiedot
async function updateUserData(user, updateEmail, updateFirstName, updateLastName) {
  try {
    const userId = user.id;
    if (userId) {
      const response = await fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'PUT',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: updateEmail,
          first_name: updateFirstName,
          last_name: updateLastName,
        }),
      });

      if (!response.ok) {
        throw new Error('User update failed');
      } else {
        const updatedUser = await response.json();
        return updatedUser;
      }
    } else {
      alert("Missing id!");
    }
  } catch (error) {
    console.error('Error updating user:' + error.message);
    throw error;
  }
}

//7. Poista käyttäjä
async function deletePerson(userId) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${userId}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      console.log("User deletion succeeded");
    }
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

//8. lisää käyttäjä
async function createNewUser(newEmail, newFirstName, newLastName) {
  try {
    const response = await fetch(`https://reqres.in/api/users`, {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: newEmail,
        first_name: newFirstName,
        last_name: newLastName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add new user');
    } else {
      const newUser = await response.json();
      return newUser;
    }
  } catch (error) {
    console.error('Error creating new User:' + error.message);
    throw error;
  }
}
