function toggleThePassword() {
    var passwordInput = document.getElementById('passwordInput');
    var eyeIcon = document.getElementById('togglePassword').querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('bi-eye-fill');
        eyeIcon.classList.add('bi-eye-slash-fill');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash-fill');
        eyeIcon.classList.add('bi-eye-fill');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    var userNameInput = document.getElementById('usernameInput');
    var passwordInput = document.getElementById('passwordInput');

    if (form === null) {
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var userName = userNameInput.value.trim();
        var password = passwordInput.value.trim();

        if (userName === '') {
            notie.alert({
                type: 3,
                text: "Please fill in your Username.",
                time: 3,
                position: "bottom"
            });
            userNameInput.focus();
            return;
        }

        if (password === '') {
            notie.alert({
                type: 3,
                text: "Please fill in your Password.",
                time: 3,
                position: "bottom"
            });
            passwordInput.focus();
            return;
        }

        $.ajax({
            url: '/Account/LoginUser',
            type: 'POST',
            data: $(form).serialize(),
            success: function (response) {
                if (response && response.success) {
                    notie.alert({
                        type: 1,
                        text: 'Login Successful',
                        time: 2,
                        position: "bottom"
                    });
                    setTimeout(function () {
                        window.location.href = '/Employee/Profile';
                    }, 900);
                } else {
                    notie.alert({
                        type: 3,
                        text: response.message || 'Invalid Username or Password.',
                        time: 3,
                        position: "bottom"
                    });
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            },
            error: function () {
                notie.alert({
                    type: 3,
                    text: 'A server error occurred. Please try again.',
                    time: 3,
                    position: "bottom"
                });
            }
        });
    });
});
