document.addEventListener('DOMContentLoaded', () => {
    const createThreadForm = document.getElementById('createThreadForm');
    const descriptionTextTopic = document.getElementById('descriptionTextTopic');
    const descButton = document.getElementById('descButton');
    const descButtonIcon = document.getElementById('descButtonIcon');

    if (createThreadForm) {
        createThreadForm.addEventListener('click', () => {
            const form = document.getElementById('postForm');
            if (form) {
                if (document.getElementById('formData')) {
                    if (form.style.display === 'block') {
                        form.style.display = 'none';
                    } else {
                        form.style.display = 'block';
                    }
                } else {
                    createForm();
                }
            }
        })
    }

    descButton.addEventListener('click', () => {
        if (descriptionTextTopic.style.display === 'none') {
            descriptionTextTopic.style.display = 'block';
            descButtonIcon.innerHTML = 'expand_less';
        } else {
            descriptionTextTopic.style.display = 'none';
            descButtonIcon.innerHTML = 'expand_more';
        }
    })
})

function createForm() {
    const formContainer = document.getElementById('postForm');
    formContainer.style.display = 'block';

    const form = document.createElement('div');
    form.id = 'formData';
    form.classList.add('flex', 'flex-col', 'bg-gray-50', 'border-[1px]', 'border-gray-200', 'p-[10px]', 'rounded-md', 'mb-[20px]')

    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = 'title';
    titleLabel.classList.add('font-semibold', 'text-[20px]');
    titleLabel.innerHTML = 'Thread Title';
    form.appendChild(titleLabel);

    const title = document.createElement('input');
    title.id = 'title';
    title.name = 'title';
    title.type = 'text';
    title.classList.add('border', 'border-gray-300', 'p-4', 'rounded-md', 'h-[40px]', 'w-full', 'placeholder-gray-400', 'text-[20px]', 'my-[10px]', 'outline-none');
    form.appendChild(title);

    const imageLabel = document.createElement('label');
    imageLabel.htmlFor = 'fileInput';
    imageLabel.classList.add('font-semibold', 'text-[20px]');
    imageLabel.innerHTML = 'Append Image';
    form.appendChild(imageLabel);


    const fileDiv = document.createElement('div');
    fileDiv.classList.add('flex', 'flex-col', 'my-[10px]');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileDiv.appendChild(fileInput);

    const imageDiv = document.createElement('div');
    imageDiv.style.display = 'none';
    imageDiv.classList.add('h-[400px]', 'my-[5px]', 'w-full', 'p-[10px]', 'rounded-md', 'bg-white', 'border', 'border-gray-300', 'bg-gray-100');

    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('w-full', 'flex', 'justify-end');

    const SliderNote = document.createElement('span');
    SliderNote.textContent = '(Note: This background will be displayed with the image)';
    SliderNote.classList.add('mr-[10px]', 'text-gray-400');

    const labelText = document.createElement('label');
    labelText.htmlFor = 'background';
    labelText.textContent = 'Background:';

    const radioGroup = document.createElement('div');
    radioGroup.id = 'background';
    radioGroup.classList.add('flex', 'items-center', 'space-x-2', 'ml-[10px]');

    const radioWhite = document.createElement('input');
    radioWhite.type = 'radio';
    radioWhite.name = 'bg';
    radioWhite.value = 'white';
    radioWhite.checked = true;
    radioWhite.classList.add('ml-[10px]');

    const labelWhite = document.createElement('label');
    labelWhite.textContent = 'White';
    labelWhite.classList.add('cursor-pointer');

    const radioBlack = document.createElement('input');
    radioBlack.type = 'radio';
    radioBlack.name = 'bg';
    radioBlack.value = 'black';
    radioBlack.classList.add('ml-[10px]');

    const labelBlack = document.createElement('label');
    labelBlack.textContent = 'Black';
    labelBlack.classList.add('cursor-pointer');

    radioWhite.addEventListener('change', function () {
        if (this.checked) {
            imageDiv.style.backgroundColor = 'white';
            sliderContainer.style.color = 'black';
        }
    });

    radioBlack.addEventListener('change', function () {
        if (this.checked) {
            imageDiv.style.backgroundColor = 'black';
            sliderContainer.style.color = 'white';
        }
    });

    labelWhite.appendChild(radioWhite);
    radioGroup.appendChild(labelWhite);
    labelBlack.appendChild(radioBlack);
    radioGroup.appendChild(labelBlack);

    sliderContainer.appendChild(SliderNote);
    sliderContainer.appendChild(labelText);
    sliderContainer.appendChild(radioGroup);

    imageDiv.appendChild(sliderContainer);

    const previewDiv = document.createElement('div');
    previewDiv.classList.add('h-full', 'w-full', 'flex', 'justify-center', 'py-[20px]');
    imageDiv.appendChild(previewDiv);

    const previewImage = document.createElement('img');
    previewImage.id = 'previewImage';
    previewImage.src = '#';
    previewImage.alt = 'Preview Image';
    previewImage.classList.add('h-full');
    previewDiv.appendChild(previewImage);
    fileDiv.appendChild(imageDiv);

    form.appendChild(fileDiv);

    fileInput.addEventListener('change', function (event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                previewImage.src = event.target.result;
                imageDiv.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imageDiv.style.display = 'none';
        }
    });

    const editorLabel = document.createElement('label');
    editorLabel.htmlFor = 'editor';
    editorLabel.classList.add('font-semibold', 'text-[20px]');
    editorLabel.innerHTML = 'Content';
    form.appendChild(editorLabel);

    const maxTextLength = 1500;
    const editor = document.createElement('textarea');
    editor.id = 'threadContent';
    editor.name = 'threadContent';
    editor.maxLength = maxTextLength;
    editor.placeholder = 'Write your post here...'
    editor.classList.add('border', 'border-gray-300', 'p-4', 'rounded-md', 'resize-none', 'w-full', 'overflow-y-hidden', 'placeholder-gray-400', 'text-[20px]', 'italic', 'my-[10px]', 'outline-none');
    form.appendChild(editor);

    const newDiv = document.createElement('div');
    newDiv.innerHTML = `0/${maxTextLength}`;
    newDiv.classList.add('flex', 'justify-end', 'text-[18px]');
    form.appendChild(newDiv);

    editor.addEventListener('input', () => {
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
        newDiv.innerHTML = `${editor.value.length}/${maxTextLength}`;
    })

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('flex', 'flex-row');

    const resetButton = document.createElement('input');
    resetButton.type = 'reset';
    resetButton.textContent = 'Clear';
    resetButton.id = 'resetForm';
    resetButton.classList.add('bg-gray-700', 'hover:bg-gray-800', 'font-bold', 'text-white', 'py-[10px]', 'px-[20px]', 'rounded-md', 'my-[10px]', 'w-fit', 'mr-[10px]');
    buttonDiv.appendChild(resetButton);

    resetButton.addEventListener('click', () => {
        imageDiv.style.display = 'none';
    })

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Post';
    submitButton.classList.add('bg-gray-700', 'hover:bg-gray-800', 'font-bold', 'text-white', 'py-[10px]', 'px-[20px]', 'rounded-md', 'my-[10px]', 'w-fit');
    buttonDiv.appendChild(submitButton);

    form.appendChild(buttonDiv);

    formContainer.appendChild(form);

    submitButton.addEventListener('click', async () => {
        if (fileInput.files.length > 0) {
            try {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                const response = await fetch('/api/upload/image/threads', {
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
                    form.appendChild(fileNameInput);
                    form.appendChild(folderNameInput);
                    formContainer.submit();
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
            formContainer.submit();
        }
    })
}
