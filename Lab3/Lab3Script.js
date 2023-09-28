document.addEventListener('DOMContentLoaded', function () {
    const fetchDataButton = document.getElementById("fetchButton");
    const usersContainer = document.getElementById("usersContainer");

    fetchDataButton.addEventListener("click", () => {
        fetchDataButton.textContent = "Знову завантажити інформацію";

        usersContainer.innerHTML = "";

        for (let i = 0; i < 5; i++) {
            fetch("https://randomuser.me/api")
                .then((response) => response.json())
                .then((data) => {
                    const userData = data.results[0];

                    const userCard = document.createElement("div");
                    userCard.classList.add("userCard");

                    const userPicture = document.createElement("img");
                    userPicture.classList.add("userPicture");
                    userPicture.src = userData.picture.large;

                    const cell = document.createElement("p");
                    cell.textContent = `Cell: ${userData.cell}`;

                    const country = document.createElement("p");
                    country.textContent = `Country: ${userData.location.country}`;

                    const postcode = document.createElement("p");
                    postcode.textContent = `Postcode: ${userData.location.postcode}`;

                    const email = document.createElement("p");
                    email.textContent = `Email: ${userData.email}`;

                    userCard.appendChild(userPicture);
                    userCard.appendChild(cell);
                    userCard.appendChild(country);
                    userCard.appendChild(postcode);
                    userCard.appendChild(email);

                    usersContainer.appendChild(userCard);
                })
                .catch((error) => {
                    console.error("Помилка при отриманні даних:", error);
                });
        }
    });
});