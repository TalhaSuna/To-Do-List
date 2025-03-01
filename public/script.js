document.addEventListener("DOMContentLoaded", fetchTodos); 

let buton = document.getElementById("buton");
let input = document.querySelector(".input input");
let listem = document.querySelector(".listem");
let modal = document.getElementById("modal");
let modalInput = document.getElementById("modal-input");
let saveBtn = document.getElementById("save-btn");
let closeBtn = document.querySelector(".close");
let selectedTodoId = null; 

buton.addEventListener("click", async function () {
    let text = input.value.trim();
    if (text === "") return alert("Boş todo eklenemez!");

    try {
        let response = await fetch("http://localhost:3000/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        let result = await response.json();
        if (result.success) {
            input.value = "";
            fetchTodos(); 
        }
    } catch (error) {
        console.error("Hata:", error);
    }
});

async function fetchTodos() {
    try {
        let response = await fetch("http://localhost:3000/get");
        let result = await response.json();

        if (result.success) {
            listem.innerHTML = ""; 
            result.data.forEach(todo => createTodoElement(todo));
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

function createTodoElement(todo) {
    let li = document.createElement("li");
    li.textContent = todo.text;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.classList.add("delete-btn");

    let guncelle = document.createElement("button");
    guncelle.textContent = "Güncelle";
    guncelle.classList.add("guncelle-btn");

    let butonlar = document.createElement("div");
    butonlar.classList.add("butonlar");
    butonlar.appendChild(deleteBtn);
    butonlar.appendChild(guncelle);

    deleteBtn.addEventListener("click", async function () {
        try {
            let response = await fetch(`http://localhost:3000/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: todo.id }),
            });

            let result = await response.json();
            if (result.success) li.remove();
        } catch (error) {
            console.error("Hata:", error);
        }
    });

    guncelle.addEventListener("click", function () {
        selectedTodoId = todo.id;
        modalInput.value = todo.text;
        modal.classList.add("show");
    });

    li.appendChild(butonlar);
    listem.appendChild(li);
}

// Modal kapatma fonksiyonları
closeBtn.addEventListener("click", function () {
    modal.classList.remove("show");
});

// Güncellenmiş veriyi kaydetme
saveBtn.addEventListener("click", async function () {
    let updatedText = modalInput.value.trim();
    if (updatedText === "") return alert("Todo boş olamaz!");

    try {
        let response = await fetch(`http://localhost:3000/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedTodoId, text: updatedText }),
        });

        let result = await response.json();
        if (result.success) {
            modal.classList.remove("show");
            fetchTodos();
        }
    } catch (error) {
        console.error("Hata:", error);
    }
});

// Modal dışına tıklayınca kapatma
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});
