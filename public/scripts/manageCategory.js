let editFormDisplay;
let createNewDisplay;

document.addEventListener('DOMContentLoaded', () => {
    const formDiv = document.getElementById('createFormInput');
    const openFormBtn = document.getElementById('openForm');
    const openFormIcon = document.getElementById('openFormIcon');

    openFormBtn.addEventListener('click', () => {
        const createNewForm = document.getElementById('createNewForm');
        if (createNewForm) {
            if (createNewDisplay) {
                createNewForm.style.display = 'none';
                createNewDisplay = !createNewDisplay;
                openFormIcon.innerHTML = 'add';
            } else {
                createNewForm.style.display = 'block';
                createNewDisplay = !createNewDisplay;
                openFormIcon.innerHTML = 'remove';
            }
        } else {
            const newSpan = document.createElement('span');
            newSpan.setAttribute('id', 'createNewForm');
            newSpan.innerHTML =
                `
            <form action="/api/admin/manage/category/create-new" method="post" class="flex flex-col w-full p-[20px]">
                <label class="font-semibold" for="categoryName">Name</label>
                <input type="text" name="categoryName" id="categoryName" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]" required>
                <label class="font-semibold" for="categoryURL">Url</label>
                <input type="text" name="categoryURL" id="categoryURL" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]" required>
                <label class="font-semibold" for="categoryDesc">Description</label>
                <textarea name="categoryDesc" id="categoryDesc" maxlength="300" class="w-full h-[120px] resize-none bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]"></textarea>
                <div class="w-full flex flex-row mt-[10px]">
                    <input type="reset" value="Clear" class="w-full bg-red-800 rounded-md text-white hover:bg-red-900 h-[40px] cursor-pointer">
                    <input type="submit" value="Create" class="w-full bg-gray-700 rounded-md text-white hover:bg-gray-800 h-[40px] ml-[10px] cursor-pointer">
                </div>
            </form>
                `;
            formDiv.appendChild(newSpan);
            createNewDisplay = true;
            openFormIcon.innerHTML = 'remove';
        }
    })
});

function editCategory(event) {
    const categoryId = event.target.closest('div').dataset.categoryId;
    const editForm = document.getElementById(`editForm${categoryId}`);
    if (editForm) {
        if (editFormDisplay) {
            editForm.style.display = 'none';
            editFormDisplay = !editFormDisplay;
        } else {
            editForm.style.display = 'block';
            editFormDisplay = !editFormDisplay;
        }
    } else {
        const urlWithParams = `/api/admin/fetch/category/information?id=${categoryId}`;
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
                console.log(data);
                const newDiv = document.createElement('div');
                newDiv.style.width = '100%';
                newDiv.setAttribute('id', `editForm${categoryId}`);
                newDiv.innerHTML =
                    `
                <form id="editForm" action="/api/admin/manage/category/edit" method="post" class="flex flex-col p-[20px] border-[2px] border-gray-100 rounded-md">
                    <label class="font-semibold" for="categoryName">Name</label>
                    <input type="text" name="categoryName" id="categoryName" value="${data.name}" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">
                    <label class="font-semibold" for="categoryURL">Url</label>
                    <input type="text" name="categoryURL" id="categoryURL" value="${data.url}" class="w-full h-[40px] bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">
                    <label class="font-semibold" for="categoryDesc">Description</label>
                    <textarea name="categoryDesc" id="categoryDesc" maxlength="300" class="w-full h-[120px] resize-none bg-gray-100 focus:bg-gray-200 my-[10px] rounded-md outline-none p-[10px]">${data.description}</textarea>
                    <input type="hidden" name="id" value="${data.id}">
                    <div class="w-full flex flex-row mt-[10px]">
                    <input type="reset" onclick="clearForm(['categoryName', 'categoryDesc', 'categoryURL'])" value="Clear" class="w-full bg-red-800 rounded-md text-white hover:bg-red-900 h-[40px] cursor-pointer">
                    <input type="submit" value="Save Changes" class="w-full bg-gray-700 rounded-md text-white hover:bg-gray-800 h-[40px] ml-[10px] cursor-pointer">
                    </div>
                </form>
                    `;
                document.getElementById(`categoryID${categoryId}`).appendChild(newDiv);
                editFormDisplay = true;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

function deleteCategory(event) {
    const categoryId = event.target.closest('div').dataset.categoryId;
    const urlWithParams = `/api/admin/delete/category/${categoryId}`;
    fetch(urlWithParams, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById(`categoryID${data.id}`).remove();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}