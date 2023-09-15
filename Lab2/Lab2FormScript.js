document.addEventListener('DOMContentLoaded', function () {
    const infoForm = document.getElementById('infoForm');

    infoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName');
        const group = document.getElementById('group');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        const email = document.getElementById('email');

        const fullNameRegex = /^[A-ZА-ЯҐІЇЄ][a-zа-яґіїє]+ [A-ZА-ЯҐІЇЄ]\.[A-ZА-ЯҐІЇЄ]\.$/;
        const groupRegex = /^[A-ZА-ЯҐІЇЄ]{2}-[0-9]{2}$/;
        const phoneRegex = /^\(\d{3}\) \d{3} \d{2} \d{2}$/;
        const addressRegex = /^(м|s).[A-Za-zА-Яа-яҐґІіЇїЄє\s]{3,50}$/;
        const emailRegex = /^[A-Za-z]+@[A-Za-z]+\.com$/;

        let isValid = true;

        if (!fullNameRegex.test(fullName.value)) {
            isValid = false;
            fullName.classList.add("error");
        }
        else {
            fullName.classList.remove("error");
        }

        if (!groupRegex.test(group.value)) {
            isValid = false;
            group.classList.add("error");
        }
        else {
            group.classList.remove("error");
        }

        if (!phoneRegex.test(phone.value)) {
            isValid = false;
            phone.classList.add("error");
        }
        else {
            phone.classList.remove("error");
        }

        if (!addressRegex.test(address.value)) {
            isValid = false;
            address.classList.add("error");
        }
        else {
            address.classList.remove("error");
        }

        if (!emailRegex.test(email.value)) {
            isValid = false;
            email.classList.add("error");
        }
        else {
            email.classList.remove("error");
        }

        if (isValid) {
            alert(`ПІБ: ${fullName.value}\nГрупа: ${group.value}\nТелефон: ${phone.value}\nАдреса: ${address.value}\nE-mail: ${email.value}`);
        }
    });
});
