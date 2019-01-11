$(document).ready(function () {
    $("nav#navbarnoti").hide();
    $("nav#navbarnoti").attr('hidden', false);
});

var api_url = 'https://waterbillingapi.herokuapp.com';

var printIcon = function (cell, formatterParams, onRendered) { //plain text value
    const cur_id = cell.getRow().getData().bill_id;
    const cur_added = cell.getRow().getData().reading;
    if (cur_added === null) {
        return '<a id="dis_' + cur_id + '"><span id="dis_' + cur_id + '" style="cursor:pointer" class="badge badge-pill badge-primary">Submit</span ></a>';
    }
    else {
        return '<span style="font-weight:bold;" class="badge badge-pill badge-success">Submitted</span>';
    }
};

var table = new Tabulator("#example-table", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    height: 450,
    selectable: false,
    layout: "fitColumns",
    responsiveLayout: "hide",
    columns: [
        {title: "Lastname", field: "lastname", width: 200, align: "center"},
        {title: "Firstame", field: "firstname", width: 200, align: "center"},
        {title: "Address", field: "address", width: 200, align: "center"},
        {
            title: "New Reading",
            field: "reading",
            width: 240,
            align: "center",
            editor: "input",
            validator: ["required", "integer"],
            formatter: function (cell, formatterParams, onRendered) {
                const cur_added = cell.getRow().getData().reading;
                if (cur_added === null) {
                    return '<span style="color: indianred;font-weight:bold;">Input NEW Reading Here</span>';
                }
                else {
                    return '<span style="color: green;font-weight:bold;">' + cur_added + '</span>';
                }
            }
        },
        {
            formatter: printIcon, width: 100, align: "center", cellClick: function (e, cell) {
                const cur_id = cell.getRow().getData().bill_id;
                const delimiter = $("span#dis_" + cur_id).text();

                if (delimiter !== 'Submit') {
                }
                else {
                    let bill_id = cell.getRow().getData().bill_id;
                    let bill_reading = cell.getRow().getData().reading;
                    if (bill_reading === null) {
                    }
                    else if (bill_reading === 0) {
                    }
                    else {
                        $("a#dis_" + bill_id).replaceWith('<a id="dis_' + bill_id + '"><span id="dis_' + bill_id + '" class="badge badge-pill badge-secondary">Billing...</span ></a>');
                        call_ajax(bill_id, bill_reading);
                    }
                }
            }
        }
    ],
});

function call_ajax(bill_id, bill_reading) {
    $.ajax
    ({
        url: api_url+"/billing/update",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            "bill_id": bill_id,
            "bill_reading": bill_reading
        }),
        type: "POST",
        dataType: "json",
        complete: function () {
        },
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $("a#dis_" + bill_id).replaceWith('<span style="font-weight:bold;" class="badge badge-pill badge-success">Submitted</span>');
            }
            else if (resp.status === 'less') {
                $("a#dis_" + bill_id).replaceWith('<a id="dis_' + bill_id + '"><span id="dis_' + bill_id + '" style="cursor:pointer" class="badge badge-pill badge-danger">Submit</span ></a>');
                $("nav#navbarnoti").removeClass("bg-success");
                $("nav#navbarnoti").addClass("bg-danger");
                $("h5#navbartext").text('Previous Reading is GREATER than the new reading');
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 5000)
            }
            else if (resp.status === 'error') {
                console.log(resp.message)
            }
            else {
                $("nav#navbarnoti").removeClass("bg-success");
                $("nav#navbarnoti").addClass("bg-danger");
                $("a#dis_" + bill_id).replaceWith('<a id="dis_' + bill_id + '"><span id="dis_' + bill_id + '" style="cursor:pointer" class="badge badge-pill badge-danger">Submit</span ></a>');
                $("h5#navbartext").text('Please fill up the billing for ' + resp.status + ' first');
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 5000)
            }
        }
    });
}

$(document).on('change', '#date_selection', function () {
    let date_selected = $('#date_selection option:selected').text();
    table.setData(api_url+'/bill/date/' + date_selected);
});

function add_date() {
    var unformatted_date = $('input#new_billingdate').val();
    var new_billingrate = $('input#new_billingrate').val();
    var new_billingdate = moment(unformatted_date, 'YYYY-MM-DD').format('MMMM DD[,] YYYY');

    $.ajax
    ({
        url: api_url+"/bill/date/add",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'billing_date': new_billingdate,
            'billing_rate': new_billingrate
        }),
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            $("button#new_billingbutton").attr("disabled", true)
        },
        complete: function () {
            $("button#new_billingbutton").attr("disabled", false);
        },
        error: function (e) {
            console.log('Something went Wrong')
        },
        success: function (resp) {
            if (resp.status === 'ok') {
                $('#new_billing').each(function () {
                    this.reset();
                });
                $("<option>" + new_billingdate + "</option>").insertAfter("#placeholder01");
                $("nav#navbarnoti").removeClass("bg-danger");
                $("nav#navbarnoti").addClass("bg-success");
                $("h5#navbartext").text('New Billing Date Added!');
                $("nav#navbarnoti").slideDown(1000);
                setTimeout(function () {
                    $("nav#navbarnoti").slideUp(1000);
                }, 4000)
            }
            else {
                console.log('Success but error');
            }
        }
    });
}
