// CPD - Change Personal Details
// CP - Change Password
// CE - Change Email

let createNewCPDDisplay = true;
let createNewCPDisplay = false;
let createNewCEDisplay = false;

document.addEventListener('DOMContentLoaded', () => {
    const CPDopenFormBtn = document.getElementById('openCPDForm');
    const CPDopenFormIcon = document.getElementById('openCPDFormIcon');
    const CPopenFormBtn = document.getElementById('openCPForm');
    const CPopenFormIcon = document.getElementById('openCPFormIcon');
    const CEopenFormBtn = document.getElementById('openCEForm');
    const CEopenFormIcon = document.getElementById('openCEFormIcon');

    const submitBtn = document.getElementById('submitImageBtn');
    const fileInput = document.getElementById('file');
    const profileImage = document.getElementById('profileImage');

    submitBtn.addEventListener('click', async () => {
        if (fileInput.files.length > 0) {
            try {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                const response = await fetch('/api/upload/image/userProfile', {
                    method: 'POST',
                    body: formData,
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    const fileNameInput = document.createElement('input');
                    fileNameInput.setAttribute('type', 'hidden');
                    fileNameInput.setAttribute('name', 'file');
                    fileNameInput.setAttribute('value', data.filename);
                    const folderNameInput = document.createElement('input');
                    folderNameInput.setAttribute('type', 'hidden');
                    folderNameInput.setAttribute('name', 'folderName');
                    folderNameInput.setAttribute('value', data.folderName);
                    profileImage.appendChild(fileNameInput);
                    profileImage.appendChild(folderNameInput);
                    profileImage.submit();
                } else {
                    if (response.status === 401) {
                        window.location.href = '/error/unauthorized';
                    } else {
                        console.error('Error:', response.status, response.statusText);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('yeh na ho sakta beta');
        }

    });

    CPDopenFormBtn.addEventListener('click', () => {
        const createNewForm = document.getElementById('createNewCPDForm');
        if (createNewCPDDisplay) {
            createNewForm.style.display = 'none';
            createNewCPDDisplay = !createNewCPDDisplay;
            CPDopenFormIcon.innerHTML = 'add';
        } else {
            createNewForm.style.display = 'block';
            createNewCPDDisplay = !createNewCPDDisplay;
            CPDopenFormIcon.innerHTML = 'remove';
        }
    });


    CPopenFormBtn.addEventListener('click', () => {
        const createNewForm = document.getElementById('createNewCPForm');
        if (createNewForm) {
            if (createNewCPDisplay) {
                createNewForm.style.display = 'none';
                createNewCPDisplay = !createNewCPDisplay;
                CPopenFormIcon.innerHTML = 'add';
            } else {
                createNewForm.style.display = 'block';
                createNewCPDisplay = !createNewCPDisplay;
                CPopenFormIcon.innerHTML = 'remove';
            }
        }
    })

    CEopenFormBtn.addEventListener('click', () => {
        const createNewForm = document.getElementById('createNewCEForm');
        if (createNewForm) {
            if (createNewCEDisplay) {
                createNewForm.style.display = 'none';
                createNewCEDisplay = !createNewCEDisplay;
                CEopenFormIcon.innerHTML = 'add';
            } else {
                createNewForm.style.display = 'block';
                createNewCEDisplay = !createNewCEDisplay;
                CEopenFormIcon.innerHTML = 'remove';
            }
        }
    })
});