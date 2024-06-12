document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('browseBtn');
    const categoriesDiv = document.getElementById('categories');
    const icon = document.getElementById('btnIcon');

    let isDisplayed = false;

    btn.addEventListener('click', () => {
        if (isDisplayed) {
            categoriesDiv.style.display = 'none';
            icon.innerHTML = 'expand_more';
        } else {
            categoriesDiv.style.display = 'block';
            icon.innerHTML = 'expand_less';
        }
        isDisplayed = !isDisplayed;
    })
})