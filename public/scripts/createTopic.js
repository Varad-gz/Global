document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitbtn');
    const fileInput = document.getElementById('file');
    const category = document.getElementById('category');
    const name = document.getElementById('name');
    const url = document.getElementById('url');
    const desc = document.getElementById('desc');
    const createTopicForm = document.getElementById('createTopicForm');

    console.log(fileInput.files.length);
    console.log(name);
    console.log(url);
    console.log(desc);
    console.log(category);


    submitBtn.addEventListener('click', async () => {
        if (fileInput.files.length > 0 && name.value.trim() != '' && url.value.trim() != '' && desc.value.trim() != '' && category.value !== '0') {
            try {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                const response = await fetch('/api/upload/image/topics', {
                    method: 'POST',
                    body: formData,
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    const fileNameInput = document.createElement('input');
                    fileNameInput.setAttribute('type', 'hidden');
                    fileNameInput.setAttribute('name', 'file')
                    fileNameInput.setAttribute('value', data.filename)
                    createTopicForm.appendChild(fileNameInput);
                    const folderNameInput = document.createElement('input');
                    folderNameInput.setAttribute('type', 'hidden');
                    folderNameInput.setAttribute('name', 'folderName')
                    folderNameInput.setAttribute('value', data.folderName)
                    createTopicForm.appendChild(folderNameInput);
                    createTopicForm.submit();
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
            console.log('error');
        }

    });
});
