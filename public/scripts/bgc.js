document.addEventListener('DOMContentLoaded', () => {
    const bgc = document.getElementById('bgc');
    const bgi = document.getElementById('bgi');

    if (bgc) {
        document.body.style.backgroundColor = bgc.innerHTML;
    } else if (bgi) {
        document.body.style.backgroundImage = bgi.innerHTML;
    }
})
