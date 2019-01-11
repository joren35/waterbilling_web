$(document).ready(function () {
    $("nav#navbarnoti").hide();
    $("nav#navbarnoti").attr('hidden', false);
});

var api_url = 'https://waterbillingapi.herokuapp.com';

function generate_code_key() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    $('#act_code').val(text);
    key_validation();
}

function add_member() {
    const firstname = $('input#first').val();
    const lastname = $('input#last').val();
    const address = $('input#address').val();
    const act_key = $('input#act_code').val();
    const reading = $('input#reading').val();
    const amount = $('input#amount').val();
    const rate = $('input#rate').val();
    const cmused = $('input#cmused').val();
    const date_issued = $('input#date_issued').val();
    const due = $('input#due').val();
    const s_status = $('#Ddown').val();

    $.ajax
    ({
        url: api_url+"/account/new",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'firstname': firstname,
            'lastname': lastname,
            'address': address,
            'act_key': act_key,
            'reading': reading,
            'amount': amount,
            'rate': rate,
            'cmused': cmused,
            'date_issued': date_issued,
            'due_date': due,
            's_status': s_status
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("i#addSpinner").addClass("fa fa-circle-o-notch fa-spin");
            $("button#addButton").attr("disabled", true)
        },
        complete: function () {
            $("i#addSpinner").removeClass("fa fa-circle-o-notch fa-spin");
            $("button#addButton").attr("disabled", false);
        },
        error: function (e) {
            console.log('Something went wrong')
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $("#adding_form").trigger('reset');
                $('#myModal').modal('hide');
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else {
                console.log(resp.message)
            }
        }
    });
}

function key_validation() {
    const input_key = $('input#act_code').val();
    if (input_key === "") {
        $("button#addButton").attr("disabled", false);
        $("input#act_code").removeClass("is-valid");
        $("input#act_code").removeClass("is-invalid");
    }
    else {
        $.ajax
        ({
            url: api_url+"/validate/key",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            data: JSON.stringify({
                'actCode': input_key
            }),
            dataType: "json",
            beforeSend: function () {
                $("button#addButton").attr("disabled", true);
            },
            complete: function () {
            },
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status === 'error') {
                    console.log("Something went wrong.")
                }
                else if (resp.status === 'exist') {
                    $("div#add_error").attr("hidden", false);
                    $("input#act_code").removeClass("is-valid");
                    $("input#act_code").addClass("is-invalid");
                    $("button#addButton").attr("disabled", true);
                }
                else {
                    $("div#add_error").attr("hidden", true);
                    $("input#act_code").removeClass("is-invalid");
                    $("input#act_code").addClass("is-valid");
                    $("button#addButton").attr("disabled", false);
                }
            }
        });
    }
}

var timeout = null;
$(document).on('keydown', '#act_code', function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        key_validation();
    }, 300);
});

var table = new Tabulator("#activated", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    layout: "fitColumns",
    height: 200,
    selectable: false,
    columns: [
        {
            title: "Name", field: "name", formatter: function (cell, formatterParams) {
                var value = cell.getValue();
                return "<span style='font-weight:bold;'>" + value + "</span>";
            }
        },
        {title: "Activation Code", field: "code", align: "left"},
    ],
});

var table2 = new Tabulator("#unactivated", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    layout: "fitColumns",
    height: 200,
    selectable: false,
    columns: [
        {
            title: "Name", cssClass: '', field: "name", formatter: function (cell, formatterParams) {
                var value = cell.getValue();
                return "<span style='font-weight:bold;'>" + value + "</span>";
            }
        },
        {title: "Activation Code", field: "code", align: "left"},
    ],
});

table.setData(api_url+'/account/status/true');
table2.setData(api_url+'/account/status/false');