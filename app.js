const API_URL =
    "https://script.google.com/macros/s/AKfycbxBQj3XEWEidrJxF4gcAI9RDc1arrHrZyjuN97B8p4FamqG8U8xhczXP8O_o3ir0vFr/exec";

let allProducts = [];

function applyFilters() {
    let filtered = [...allProducts];

    const keyword = document.getElementById("search").value.toLowerCase();
    const sortValue = document.getElementById("sort").value;
    const availableOnly = document.getElementById("availableOnly").checked;

    // SEARCH
    if (keyword) {
        filtered = filtered.filter((p) =>
            p.nama.toLowerCase().includes(keyword),
        );
    }

    // FILTER STOK
    if (availableOnly) {
        filtered = filtered.filter((p) => Number(p.stok) > 0);
    }

    // SORT HARGA
    if (sortValue === "asc") {
        filtered.sort((a, b) => Number(a.harga) - Number(b.harga));
    }

    if (sortValue === "desc") {
        filtered.sort((a, b) => Number(b.harga) - Number(a.harga));
    }

    renderProducts(filtered);
}

fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
        allProducts = data;
        applyFilters(); // bukan renderProducts langsung
    });

function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = `
    <div class="col-span-full text-center text-gray-500 py-20">
      Produk tidak ditemukan 😢
    </div>
  `;
        return;
    }

    products.forEach((product) => {
        const card = document.createElement("div");

        card.innerHTML = `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden">
        <img 
          src="${product.gambar}" 
          alt="${product.nama}" 
          class="w-full h-56 object-cover"
        >
        <div class="p-5 space-y-3">
          <h3 class="font-semibold text-lg text-gray-800">
            ${product.nama}
          </h3>
          <p class="text-sm text-gray-500">
            ${product.deskripsi}
          </p>
          <div class="font-bold text-blue-600 text-lg">
            Rp ${formatRupiah(product.harga)}
          </div>
          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              product.stok == 0
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
          }">
            ${product.stok == 0 ? "Stok Habis" : "Stok: " + product.stok}
          </span>
        </div>
      </div>
    `;

        container.appendChild(card);
    });
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("sort").addEventListener("change", applyFilters);
document
    .getElementById("availableOnly")
    .addEventListener("change", applyFilters);

function formatRupiah(angka) {
    return Number(angka).toLocaleString("id-ID");
}
