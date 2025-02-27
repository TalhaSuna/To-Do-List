document.addEventListener("DOMContentLoaded", fetchTodos); 

let buton = document.getElementById("buton");
let input = document.querySelector(".input input");
let listem = document.querySelector(".listem");

// Yeni bir Todo ekleme
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

// Todo listesini getir ve ekrana yazdır
async function fetchTodos() {
    try {
        let response = await fetch("http://localhost:3000/get");
        let result = await response.json();

        if (result.success) {
            listem.innerHTML = ""; // Önce listeyi temizle
            result.data.forEach(todo => createTodoElement(todo));
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

// Todo elemanını oluştur ve listeye ekle
function createTodoElement(todo) {
    let li = document.createElement("li");
    li.textContent = todo.text;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", async function () {
        try {
            let response = await fetch(`http://localhost:3000/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: todo.id }),
            });

            let result = await response.json();
            if (result.success) li.remove(); // Başarıyla silindiyse listeden kaldır
        } catch (error) {
            console.error("Hata:", error);
        }
    });

    li.appendChild(deleteBtn);
    listem.appendChild(li);
}