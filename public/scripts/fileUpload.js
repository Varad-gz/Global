document.addEventListener('DOMContentLoaded', () => {
    const file = document.getElementById('file');
    const fileName = document.getElementById('fileName');
    let uploadContainer, clrbtn;

    document.getElementById('uploadContainer') ? uploadContainer = document.getElementById('uploadContainer') : '';
    document.getElementById('uploadContainer') ? clrbtn = document.getElementById('clrUploadBtn') : clrbtn = document.getElementById('clrbtn');

    file.addEventListener('change', () => {
        if (file.files.length > 0) {
            fileName.innerHTML = `File: ${file.files[0].name}`;
            fileName.style.display = 'block';
            if (uploadContainer) {
                clrbtn.style.display = 'block';
            }
        } else {
            fileName.innerHTML = '';
            fileName.style.display = 'none';
            if (uploadContainer) {
                clrbtn.style.display = 'none';
            }
        }
    });

    clrbtn.addEventListener('click', () => {
        fileName.innerHTML = '';
        fileName.style.display = 'none';
        if (uploadContainer) {
            clrbtn.style.display = 'none';
        }
    });
})
