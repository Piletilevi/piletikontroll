var search = location.search.substring(1);
var q_options = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

$.getJSON('http://84.50.247.234:8072/ticketstatus.php', q_options, function(json, textStatus) {
    // console.log(json)
    $('body').text(JSON.stringify(json))
    // $('#result_rows').text('')
    // json.rows.forEach(function rowLoop(r) {
    //     console.log(r)
    //     var row_element = $('<div>')
    //     row_element.addClass('status_' + json.status)
    //     row_element.text(r)
    //     $('#result_rows').append(row_element)
    // })
})
.fail(function Fail( data ) {
    $('body').text(JSON.stringify(data))
    console.log(data)
})


// var result = {'status': 'C'}
// $('body').text(JSON.stringify(q))
