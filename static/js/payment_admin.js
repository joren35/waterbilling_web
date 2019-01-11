var printIcon = function (cell, formatterParams, onRendered) { //plain text value
    cur_id = cell.getRow().getData().bill_id;
    return '<button id="dis_' + cur_id + '" data-toggle="popover" type="button" class="btn btn-primary">Change to Paid</button>';
};

var api_url = 'https://waterbillingapi.herokuapp.com';

var table = new Tabulator("#paymentTable", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    height: 500,
    layout: "fitColumns",
    columns: [
        {
            title: "Bill ID",
            field: "bill_id",
            align: "center",
            width: 100
        },
        {
            title: "Month",
            field: "date",
            align: "center",
            width: 300
        },
        {
            title: "Name",
            field: "name",
            align: "center"
        },
        {
            title: "Amount",
            field: "amount",
            align: "right",
            width: 250
        },
        {
            formatter: printIcon,
            width: 250,
            align: "center",
            cellClick: function (e, cell) {
                var bill_id = cell.getRow().getData().bill_id;

                $('button#dis_' + bill_id).attr("disabled", true);
                call_ajax(bill_id);
            }
        }
    ]
});

function call_ajax(bill_id) {
    $.ajax
    ({
        url: api_url+"/payment/paid",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'bill_id': bill_id
        }),
        type: "POST",
        dataType: "json",
        error: function (e) {
        },
        success: function (resp) {
            if (resp.status === 'ok') {
            }
            else {
                console.log("Error " + resp.message);
            }
        }
    })
}

function cellbutton(id) {
    $("dis_" + id).prop("disable", true);
}

table.setData(api_url+'/payment');