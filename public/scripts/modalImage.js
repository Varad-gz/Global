document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('img');
    const enlarged = document.getElementById('enlarged');
    const close = document.getElementById('cross');
    const clickmsg = document.getElementById('clickmessage');

    img.addEventListener('click', () => {
        enlarged.style.display = 'block';
        document.body.style.overflow = 'hidden';
    })

    close.addEventListener('click', () => {
        enlarged.style.display = 'none';
        document.body.style.overflow = 'visible';
    })

    img.addEventListener('mouseenter', () => {
        clickmsg.innerHTML = `<div style="text-align: center;"><span class="material-symbols-outlined" style="font-size: 40px;">expand_content</span><br><span>Expand</span></div>`
    })

    img.addEventListener('mouseleave', () => {
        clickmsg.innerHTML = '';
    })
})