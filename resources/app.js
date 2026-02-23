const hasilInput = document.getElementById("hasil");
const btnKirim = document.getElementById("btnKirim");

let html5QrCode;

function startScanner() {
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

    // STOP CAMERA
    html5QrCode.stop();
}

function beep() {
    const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    );
    audio.play();
}

btnKirim.addEventListener("click", () => {
    const barcode = hasilInput.value;

    if (!barcode) {
        alert("Belum ada barcode");
        return;
    }

    alert("Kirim: " + barcode);
});

startScanner();

document.getElementById("scanLagi").onclick = () => {
    startScanner();
};
