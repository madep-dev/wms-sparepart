const hasilInput = document.getElementById("hasil");
const btnKirim = document.getElementById("btnKirim");

let lastScan = null;

function onScanSuccess(decodedText) {
    // anti double scan
    if (decodedText === lastScan) return;

    lastScan = decodedText;

    hasilInput.value = decodedText;

    beep();
}

function beep() {
    const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    );
    audio.play();
}

const scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 15,
        qrbox: { width: 220, height: 220 },
    },
    false,
);

scanner.render(onScanSuccess);

btnKirim.addEventListener("click", () => {
    const barcode = hasilInput.value;

    if (!barcode) {
        alert("Belum ada barcode");
        return;
    }

    alert("Kirim: " + barcode);
});
