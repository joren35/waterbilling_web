$(document).ready(function () {
    $("nav#navbarnoti").hide();
    $("nav#navbarnoti").attr('hidden', false);
});

var api_url = 'https://waterbillingapi.herokuapp.com';

$(document).on('change', '#date_selection', function () {
    let date_selected = $('#date_selection option:selected').text();
    table.setData(api_url+'/bill/date/' + date_selected);
});

function send_all() {
    $.ajax
    ({
        url: api_url+"/sms/all",
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#buttonforall").attr("disabled", true)
        },
        complete: function () {
            $("button#buttonforall").attr("disabled", false)
        },
        error: function (e) {
            console.log(e)
        },
        success: function (resp) {
            if (resp.status === 'ok'){
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else{
                alert('Something went wrong')
            }
        }
    });
}

function send_date() {
    let bill_date = $('#selection_date option:selected').text();
    console.log
    $.ajax
    ({
        url: api_url+"/sms/date",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "bill_date": bill_date
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#buttonfordate").attr("disabled", true)
        },
        complete: function () {
            $("button#buttonfordate").attr("disabled", false)
        },
        error: function (e) {
            console.log(e)
        },
        success: function (resp) {
            if (resp.status === 'ok'){
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else{
                alert('Something went wrong')
            }
        }
    });
}

function send_announcement() {
    let announcement = $('textarea#msg_txtarea').val();
    $.ajax
    ({
        url: api_url+"/sms/announcement",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "announ": announcement,
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#buttonforannoun").attr("disabled", true)
        },
        complete: function () {
            $("button#buttonforannoun").attr("disabled", false)
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok'){
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else{
                alert('Something went wrong')
            }
        }
    });
}

function send_disconnection() {
    $.ajax
    ({
        url: api_url+"/sms/disconnection",
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#buttonfordisconnection").attr("disabled", true)
        },
        complete: function () {
            $("button#buttonfordisconnection").attr("disabled", false)
        },
        error: function (e) {
            console.log(e)
        },
        success: function (resp) {
            if (resp.status === 'ok'){
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else{
                alert('Something went wrong')
            }
        }
    });
}