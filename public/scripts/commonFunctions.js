function clearForm(idarr) {
    idarr.forEach(element => {
        const elementTag = document.getElementById(element)
        if (elementTag.tagName === 'TEXTAREA') {
            elementTag.innerHTML = '';
        } else {
            elementTag.setAttribute('value', '');
        }
    });
}