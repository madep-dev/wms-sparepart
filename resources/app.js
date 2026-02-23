const API_URL =
    "https://script.google.com/macros/s/AKfycbyOZGKrVUMDhi4McaWJLRdmhl_Mh-bXL_MXBAPd5Z9hQA9_dm-7j5au9Vu2Uia0_xQe/exec";

const hasilInput = document.getElementById("hasil");
const namaInput = document.getElementById("nama");
const stokInput = document.getElementById("stok");
const perubahanInput = document.getElementById("perubahan");

const scanLagi = document.getElementById("scanLagi");
const updateBtn = document.getElementById("updateStok");

let html5QrCode;
let currentRow = null;

function startScanner() {
    scanLagi.classList.add("hidden");

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 15,
            qrbox: { width: 220, height: 220 },
        },
        onScanSuccess,
    );
}

function onScanSuccess(decodedText) {
    hasilInput.value = decodedText;

    beep();

    html5QrCode.stop().then(() => {
        scanLagi.classList.remove("hidden");
    });

    ambilData(decodedText);
}

function ambilData(id) {
    fetch(API_URL + "?id=" + id)
        .then((res) => res.json())
        .then((data) => {
            if (!data.found) {
                alert("Barang tidak ditemukan");
                return;
            }

            namaInput.value = data.nama;
            stokInput.value = data.stok;

            currentRow = data.row;
        });
}

function updateStok() {
    const perubahan = Number(perubahanInput.value);

    if (!currentRow) {
        alert("Scan barang dulu");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            row: currentRow,
            perubahan: perubahan,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            stokInput.value = res.stok_baru;

            alert("Stok berhasil diupdate");

            perubahanInput.value = "";
        });
}

function beep() {
    const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    );

    audio.play();
}

scanLagi.addEventListener("click", startScanner);
updateBtn.addEventListener("click", updateStok);

startScanner();
