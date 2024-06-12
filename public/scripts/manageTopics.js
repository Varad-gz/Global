let editFormDisplay;

function editTopic(event) {
    const topicId = event.target.closest('div').dataset.topicId;
    const editForm = document.getElementById(`editForm${topicId}`);
    if (editForm) {
        if (editFormDisplay) {
            editForm.style.display = 'none';
            editFormDisplay = !editFormDisplay;
        } else {
            editForm.style.display = 'block';
            editFormDisplay = !editFormDisplay;
        }
    } else {
        const urlWithParams = `/api/user/fetch/topic/information?id=${topicId}`;
        fetch(urlWithParams, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const newDiv = document.createElement('div');
                newDiv.style.width = '100%';
                newDiv.setAttribute('id', `editForm${topicId}`);
                newDiv.innerHTML =
                    `
                <form id="editForm" action="/api/user/manage/topic/edit" method="post" class="flex flex-col p-[20px] border-[2px] border-gray-100 rounded-md">
                    <label class="font-semibold" for="topicName">Name</label>
                    <input type="text" name="topicName" id="topicName" value="${data.topic.name}" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">
                    <label class="font-semibold" for="topicURL">Url</label>
                    <input type="text" name="topicURL" id="topicURL" value="${data.topic.url}" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">
                    <label class="font-semibold" for="topicDesc">Description</label>
                    <textarea name="topicDesc" id="topicDesc" maxlength="1000" class="w-full h-[120px] resize-none bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">${data.topic.description}</textarea>
                    <input type="hidden" name="id" value="${data.topic.id}">
                    <label class="font-semibold" for="category">Select Category</label>
                    <select name="category" id="category" class="w-full bg-gray-100 outline-none my-[10px] rounded-md p-[10px] focus:bg-gray-200">
                        <option value="0" disabled>Select a category</option>
                        ${data.categories.map(category => `
                            <option value="${category.id}" ${category.id === data.topic.categoryId ? 'selected' : ''}>${category.name}</option>
                        `).join('\n')}
                    </select>
                    <div class="w-full flex flex-row mt-[10px]">
                    <input type="reset" onclick="clearForm(['topicName', 'topicDesc', 'topicURL'])" value="Clear" class="w-full bg-red-800 rounded-md text-white hover:bg-red-900 h-[40px] cursor-pointer">
                    <input type="submit" value="Save Changes" class="w-full bg-gray-700 rounded-md text-white hover:bg-gray-800 h-[40px] ml-[10px] cursor-pointer">
                    </div>
                </form>
                    `;
                document.getElementById(`topicId${topicId}`).appendChild(newDiv);
                editFormDisplay = true;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

function deleteTopic(event) {
    const topicId = event.target.closest('div').dataset.topicId;
    const urlWithParams = `/api/user/delete/topic/${topicId}`;
    fetch(urlWithParams, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    window.alert('Cannot remove a topic with threads in it!')
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            document.getElementById(`topicId${data.id}`).remove();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function editTopicImage(event) {
    const topicId = event.target.closest('div').dataset.topicId;
    const image = event.target.dataset.image;
    const topic = document.getElementById(`topicId${topicId}`);

    const html =
        `
        <div id="enlarged">
            <div class="top-0 left-0 fixed z-10 bg-black w-full h-full opacity-10"></div>
            <div class="fixed top-0 left-0 right-0 bottom-0 z-20">
            <div class="flex justify-center items-center py-[20px]">
                <div class="w-[60%] bg-white border-[1px] border-gray-400 rounded-md p-[30px]">
                <span class="material-symbols-outlined font-bold text-black cursor-pointer hover:text-red-600" style="font-size: 30px;" id="cross" onclick="clearImageForm()">close</span>
                <div class="h-[330px] p-[10px] border-[1px] border-gray-400 flex justify-center">
                    <img src="${image}" alt="topicImage" class="h-full max-w-none">
                </div>
                <div class="flex flex-col items-center relative">
                    <form action="/api/user/manage/topic/edit/image" method="post" id="topicImage">
                    <input type="hidden" name="id" value="${topicId}">
                    <input type="hidden" name="imagePath" value="${image}">
                    <label for="file" id="fileContainer" class="flex flex-col items-center justify-center w-fit p-[20px] my-[10px] rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
                        <div class="flex flex-row items-center justify-center">
                        <div>
                            <p class="mb-2 text-sm text-black"><span class="font-semibold">Select Profile Picture</span></p>
                            <p class="text-xs text-black">PNG, JPG (5 MB Max)</p>
                        </div>
                        </div>
                        <div class="text-sm font-semibold mt-[20px] hidden" id="fileName"></div>
                        <input id="file" type="file" class="hidden" onchange="fileName()" />
                    </label>
                    <div class="flex flex-row justify-center">
                        <input type="reset" id="clrbtn" onclick="clearFile()" value="Reset" class="w-fit mr-[10px] px-[10px] py-[5px] bg-gray-100 hover:bg-gray-200 rounded-md">
                        <button type="button" id="submitbtn" onclick="submitImage()" class="w-fit px-[10px] py-[5px] bg-gray-100 hover:bg-gray-200 rounded-md">Edit</button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        `;

    const newSpan = document.createElement('span');
    newSpan.setAttribute('id', 'tp');
    newSpan.innerHTML = html;
    topic.appendChild(newSpan);
}


function fileName() {
    const file = document.getElementById('file');
    const fileName = document.getElementById('fileName');

    if (file.files.length > 0) {
        fileName.innerHTML = `File: ${file.files[0].name}`;
        fileName.style.display = 'block';
    } else {
        fileName.innerHTML = '';
        fileName.style.display = 'none';
    }
}

function clearFile() {
    const fileName = document.getElementById('fileName');
    fileName.innerHTML = '';
    fileName.style.display = 'none';
}


function clearImageForm() {
    document.getElementById('tp').remove();
}

async function submitImage() {

    const fileInput = document.getElementById('file');
    const topicImage = document.getElementById('topicImage');

    if (fileInput.files.length > 0) {
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
                fileNameInput.setAttribute('name', 'file');
                fileNameInput.setAttribute('value', data.filename);
                const folderNameInput = document.createElement('input');
                folderNameInput.setAttribute('type', 'hidden');
                folderNameInput.setAttribute('name', 'folderName');
                folderNameInput.setAttribute('value', data.folderName);
                topicImage.appendChild(fileNameInput);
                topicImage.appendChild(folderNameInput);
                topicImage.submit();
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
}