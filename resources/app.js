const API_URL =
    "https://script.google.com/macros/s/AKfycbyOZGKrVUMDhi4McaWJLRdmhl_Mh-bXL_MXBAPd5Z9hQA9_dm-7j5au9Vu2Uia0_xQe/exec";

const hasilInput = document.getElementById("hasil");
const namaInput = document.getElementById("nama");
const stokInput = document.getElementById("stok");
const perubahanInput = document.getElementById("perubahan");

const scanLagi = document.getElementById("scanLagi");
const updateBtn = document.getElementById("updateStok");
const loading = document.getElementById("loading");

function setLoading(state) {
    if (state) {
        loading.classList.remove("hidden");
        updateBtn.disabled = true;
        updateBtn.classList.add("opacity-50");
    } else {
        loading.classList.add("hidden");
        updateBtn.disabled = false;
        updateBtn.classList.remove("opacity-50");
    }
}

let html5QrCode;
let currentRow = null;

function startScanner() {
    scanLagi.classList.add("hidden");

    namaInput.value = "";
    stokInput.value = "";

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
                Swal.fire({
                    icon: "warning",
                    title: "Barang tidak ditemukan",
                    text: "Periksa barcode",
                });

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
        Swal.fire({
            icon: "warning",
            title: "Peringatan",
            text: "Scan barcode dulu",
        });
        return;
    }

    setLoading(true);

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            row: currentRow,
            perubahan: perubahan,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            stokInput.value = res.stok_baru;

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Stok berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });

            perubahanInput.value = "";
        })
        .catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Update stok gagal",
            });
        })
        .finally(() => {
            setLoading(false);
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
