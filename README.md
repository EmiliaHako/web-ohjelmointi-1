# web-ohjelmointi-1

Luo Bootstrapia ja joko a)jQuery AJAXia tai b)Javascript FetchAPIn käyttäen sovellus, joka kommunikoi https://reqres.in-sivuston testiAPIn kanssa. 
Kyseessä on clientin testaamiseen tarkoitettu API, jossa voi simuloida  CRUD-toiminnallisuuksia (create, read, update, delete). 
Tietojen hakeminen tapahtuu oikeasti, mutta tietojen muuttamista vain simuloidaan, eli muutokset eivät mene serverin tietokantaan tai muuhun tallennuspaikkaan. 
Siksi näiden tehtävien todentamiseksi pitää sovelluksessa näyttää palvelimen palauttamat viestit.

Vaatimukset:

1. Tekniikkana javascript fetchAPI tai jQuery ajax
2. Bootstrap koko käyttöliittymän muotoiluun
3. Käyttäjä voi rekisteröityä ja serverin vastaus näytetään (toimii vain vakiokäyttäjällä)
4. Käyttäjä voi kirjautua ja serverin vastaus näytetään (toimii vain vakiokäyttäjällä)
5. Serveriltä haetaan user-sivujen lukumäärä ja luodaan sen mukaisesti sivupainikkeita
6. Sivupainikkeista haetaan ko. sivullinen käyttäjätietoja, kaikki kentät näytetään
7. Jokaiselle käyttäjälle luodaan päivitys ja poistopainikkeet
8. Käyttäjän tietoja voi muuttaa päivityspainikkeesta, serverin vastaus näytetään
9. Käyttäjän voi poistaa painikkeesta, poisto viedään serverille ja käyttäjä poistetaan näytöstä
10. Käyttäjä voi luoda uuden käyttäjän, serverin vastaus näytetään
11. Koodi on jäsennelty asiallisiin kansio- ja tiedostorakenteisiin, on käytetty koodimoduleita
12. Kaikki toiminnot, joiden suoritus voi kestää aikaa (kommunikointi serverin kanssa) on tehty promiseja käyttäen. Suosi async/await ja try/catch.
13. Virhetilanteet on käsitelty asiallisesti
