document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const menubtn = document.getElementById('menuBtn');
    const menuItems = document.getElementById('menuItems');

    menu.addEventListener('mouseenter', () => {
        menuItems.style.display = 'block';
    })

    menu.addEventListener('mouseleave', () => {
        menuItems.style.display = 'none';
    })
})