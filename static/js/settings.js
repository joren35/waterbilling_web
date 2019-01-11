$(document).ready(function () {
    $("nav#navbarnoti").hide();
    $("nav#navbarnoti").attr('hidden', false);
});

var api_url = 'https://waterbillingapi.herokuapp.com';

function settings_name(){
    let firstname = $('input#firstname').val();
    let lastname = $('input#lastname').val();
    $.ajax
    ({
        url: api_url+"/account/update/name",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'acc_id': curuser,
            'firstname': firstname,
            'lastname': lastname
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#name_button").attr("disabled", true)
        },
        complete: function () {
            $("button#name_button").attr("disabled", false);
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            } else {
                alert('Something went wrong');
                console.log("Error " + resp.message);
            }
        }
    })
}

function setting_mobile(){
    let mobile_num = $('input#mobile_num').val();
    $.ajax
    ({
        url: api_url+"/account/update/mobile",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'acc_id': curuser,
            'mobile_num': mobile_num
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#mobile_button").attr("disabled", true)
        },
        complete: function () {
            $("button#mobile_button").attr("disabled", false);
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            } else {
                alert('Something went wrong');
                console.log("Error " + resp.message);
            }
        }
    })
}

function settings_password(){
    let new_pass = $('input#new_pass').val();
    $.ajax
    ({
        url: api_url+"/account/update/password",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'acc_id': curuser,
            'password': new_pass
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#pass_button").attr("disabled", true)
        },
        complete: function () {
            $("button#pass_button").attr("disabled", false);
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            } else {
                alert('Something went wrong');
                console.log("Error " + resp.message);
            }
        }
    })
}