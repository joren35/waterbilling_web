var api_url = 'https://waterbillingapi.herokuapp.com';

let table = new Tabulator("#memberTable", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    height: 311,
    responsiveLayout: "hide",
    layout: "fitColumns",
    columns: [
        {title: "Last name", field: "lastname", align: "center"},
        {title: "First name", field: "firstname"},
        {title: "Address", field: "address"}
    ],
    rowClick: function (e, row) { //trigger an alert message when the row is clicked
        table2.setData(api_url+'/bill/'+row.getData().id);
    },
});

let table2 = new Tabulator("#displayTable", {
    ajaxResponse: function (url, params, response) {
        return response.entries;
    },
    height: 311,
    responsiveLayout: "hide",
    layout: "fitColumns",
    columns: [
        {title: "Date Issued", field: "date", align: "center", sorter:"date", sorterParams:{format:"MM/DD/YYYY"}, formatter:"datetime", formatterParams:{inputFormat:"MM/DD/YYYY", outputFormat:"MMMM DD[,] YYYY"}},
        {title: "Due Date", field: "due_date", sorter:"date", sorterParams:{format:"MM/DD/YYYY"}, formatter:"datetime", formatterParams:{inputFormat:"MM/DD/YYYY", outputFormat:"MMMM DD[,] YYYY"}},
        {title: "Reading", field: "reading"},
        {title: "Amount", field: "amount"},
        {title: "Cubic Meter Used", field: "cubic_meters"},
        {title: "Status", field: "status"}
    ],
});

function search() {
    let search_name = $('input#testme1').val();
    let replaced = search_name.split(' ').join('%');
    let final_val = '%' + replaced + '%';
    table.setData(api_url+'/search/' + final_val);
}
