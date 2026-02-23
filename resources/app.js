const hasilInput = document.getElementById("hasil");
const btnKirim = document.getElementById("btnKirim");
const scanLagi = document.getElementById("scanLagi");

let html5QrCode;

function startScanner() {
    scanLagi.classList.add("hidden");

    html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 15,
        qrbox: { width: 220, height: 220 },
    };

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
}

function onScanSuccess(decodedText) {
    hasilInput.value = decodedText;

    beep();
    navigator.vibrate(200);

    html5QrCode.stop().then(() => {
        scanLagi.classList.remove("hidden");
    });
}

function beep() {
    const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    );
    audio.play();
}

scanLagi.addEventListener("click", () => {
    startScanner();
});

btnKirim.addEventListener("click", () => {
    const barcode = hasilInput.value;

    if (!barcode) {
        alert("Belum ada barcode");
        return;
    }

    alert("Kirim: " + barcode);
});

startScanner();
