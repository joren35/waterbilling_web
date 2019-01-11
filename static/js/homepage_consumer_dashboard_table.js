var api_url = 'https://waterbillingapi.herokuapp.com';

var table = new Tabulator("#dashboard-table", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
 	height:311,
 	layout:"fitColumns",
 	columns:[
	 	{title:"Date Issued", field:"date", align:"center", sorter:"date", sorterParams:{format:"MM/DD/YYYY"}, formatter:"datetime", formatterParams:{inputFormat:"MM/DD/YYYY", outputFormat:"MMMM DD[,] YYYY"}},
	 	{title:"Due Date ", field:"due_date", align:"center", sorter:"date", sorterParams:{format:"MM/DD/YYYY"}, formatter:"datetime", formatterParams:{inputFormat:"MM/DD/YYYY", outputFormat:"MMMM DD[,] YYYY"}},
 	],
    rowClick: function (e, row) { //trigger an alert message when the row is clicked
        $('span#month').text(moment(row.getData().date, 'MM-DD-YYYY').format('MMMM DD[,] YYYY'));
        $('span#due').text(moment(row.getData().due_date, 'MM-DD-YYYY').format('MMMM DD[,] YYYY'));
        $('span#reading').text(row.getData().reading);
        $('span#cubicM').text(row.getData().cubic_meters);
        $('span#arrears').text(row.getData().arrears);
        $('span#amount').text('₱' + row.getData().amount);
        if (row.getData().status === 'Unpaid') {
            $('span#warnings').remove();
            $('span#stat').append("<span id='warnings' class='text-warning'>" + row.getData().status + "</span>");
        }
        else if (row.getData().status === 'Paid') {
            $('span#warnings').remove();
            $('span#stat').append("<span id='warnings' class='text-success'>" + row.getData().status + "</span>");
        }
        else if (row.getData().status === 'Disconnection') {
            $('span#warnings').remove();
            $('span#stat').append("<span id='warnings' class='text-danger'>" + row.getData().status + "</span>");
        }
        else {
            $('span#warnings').remove();
        }


    },
});
table.setData(api_url+'/bill/' + curuser);