document.addEventListener('DOMContentLoaded', () => {
    const password = document.getElementById('password');
    const rpassword = document.getElementById('rpassword');
    const pwdvalid = document.getElementById('pwdvalid');
    const submitbtn = document.getElementById('submitbtn');
    const clrbtn = document.getElementById('clrbtn');
    clrbtn.addEventListener('click', () => {
        submitbtn.disabled = true;
        pwdvalid.innerHTML = '';
    })
    password.addEventListener('input', () => {
        if (password.value != '' && rpassword.value != '') {
            if (checkIfMatches(password.value, rpassword.value)) {
                pwdvalid.innerHTML = `<span style="color: #6BC16B;">Passwords Match</span>`;
                submitbtn.disabled = false;
                submitbtn.removeAttribute("style");
            } else {
                pwdvalid.innerHTML = `<span style="color: #D3524C;">Passwords Do Not Match</span>`
                submitbtn.disabled = true;
                submitbtn.setAttribute("style", "background-color: gray; color: white; cursor: default;")
            }
        } else {
            pwdvalid.innerHTML = ''
            submitbtn.disabled = true;
            submitbtn.setAttribute("style", "background-color: gray; color: white; cursor: default;")
        }
    })
    rpassword.addEventListener('input', () => {
        if (password.value != '' && rpassword.value != '') {
            if (checkIfMatches(password.value, rpassword.value)) {
                pwdvalid.innerHTML = `<span style="color: #6BC16B;">Passwords Match</span>`;
                submitbtn.disabled = false;
                submitbtn.removeAttribute("style");
            } else {
                pwdvalid.innerHTML = `<span style="color: #D3524C;">Passwords Do Not Match</span>`
                submitbtn.disabled = true;
                submitbtn.setAttribute("style", "background-color: gray; color: white; cursor: default;")
            }
        } else {
            pwdvalid.innerHTML = ''
            submitbtn.disabled = true;
            submitbtn.setAttribute("style", "background-color: gray; color: white; cursor: default;")
        }
    })
})

function checkIfMatches(p, r) {
    return p === r ? true : false
}