$(document).ready(function () {
    $("nav#navbarnoti").hide();
    $("nav#navbarnoti").attr('hidden', false);
    $("nav#navbarnoti2").hide();
    $("nav#navbarnoti2").attr('hidden', false);
});

var api_url = 'https://waterbillingapi.herokuapp.com';

function login() {
    const username = $('input#username').val();
    const password = $('input#password').val();
    $.ajax
    ({
        url: "http://127.0.0.1:5000/login",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'username': username,
            'password': password
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("i#load").addClass("fa fa-circle-o-notch fa-spin");
            $("button#loginButton").attr("disabled", true)
        },
        complete: function () {
            $("i#load").removeClass("fa fa-circle-o-notch fa-spin");
            $("button#loginButton").attr("disabled", false)
        },
        error: function (e) {
            console.log(e)
        },
        success: function (resp) {
            if (resp.status === 'error') {
                $("#credentials").attr("hidden", false)
            }
            else {
                window.location.replace('/dashboard')
            }
        }
    });
}

function register() {
    const rusername = $('input#rusername').val();
    const password = $('input#rpassword').val();
    const regkey = $('input#regkey').val();
    const mobile = $('input#mobile').val();
    $.ajax
    ({
        url: "http://127.0.0.1:5000/register",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'rusername': rusername,
            'password': password,
            'regkey': regkey,
            'mobile': mobile
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("div#registrationSpinner").addClass("fa fa-circle-o-notch fa-spin");
            $("button#registerButton").attr("disabled", true)
        },
        complete: function () {
            $("div#registrationSpinner").removeClass("fa fa-circle-o-notch fa-spin");
            $("button#registerButton").attr("disabled", false)
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'error') {
                if (resp.reason === 'Invalid Registration Key') {
                    $("input#regkey").addClass("is-invalid");
                    $("h5#navbartext").text('Invalid Registration Key!');
                    $("nav#navbarnoti").slideDown(1000);
                    setTimeout(function () {
                        $("nav#navbarnoti").slideUp(1000);
                    }, 4000)
                }
                else if (resp.reason === 'used') {
                    $("input#regkey").addClass("is-invalid");
                    $("h5#navbartext").text('Key is already used!');
                    $("nav#navbarnoti").slideDown(1000);
                    setTimeout(function () {
                        $("nav#navbarnoti").slideUp(1000);
                    }, 4000)
                }
            }
            else {
                window.location.replace('/dashboard');
            }
        }
    });
}

function validate() {
    const input_username = $('input#rusername').val();
    if (input_username === "") {
        $("button#registerButton").attr("disabled", false);
        $("input#rusername").removeClass("is-valid");
        $("input#rusername").removeClass("is-invalid");
    }
    else {
        $.ajax
        ({
            url: api_url+"/validate/username",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            data: JSON.stringify({
                'username': input_username
            }),
            dataType: "json",
            beforeSend: function () {
                $("div#spinner").attr("hidden", false);
                $("button#registerButton").attr("disabled", true);
            },
            complete: function () {
                $("div#spinner").attr("hidden", true);
            },
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status === 'error') {
                    $("div#in_use").attr("hidden", false);
                    $("input#rusername").removeClass("is-valid");
                    $("input#rusername").addClass("is-invalid");
                    $("button#registerButton").attr("disabled", true);
                }
                else {
                    $("div#in_use").attr("hidden", true);
                    $("input#rusername").removeClass("is-invalid");
                    $("input#rusername").addClass("is-valid");
                    $("button#registerButton").attr("disabled", false);
                }
            }
        });
    }
}


var timeout = null;
$(document).on('keydown', '#rusername', function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        validate();
    }, 300);
});

