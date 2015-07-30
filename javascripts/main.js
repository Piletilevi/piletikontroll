var xmlhttp = new XMLHttpRequest()
var url = "params.json"

var params
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        params = JSON.parse(xmlhttp.responseText)
        console.log(params.name + ' ' + params.version)
    }
}
xmlhttp.open("GET", url, true)
xmlhttp.send()



var configuration = {
  "ENTU_URI": 'https://piletilevi.entu.ee/'
}

configuration['ENTU_API'] = configuration.ENTU_URI + 'api2/'
configuration['ENTU_API_ENTITY'] = configuration.ENTU_API + 'entity'
configuration['ENTU_API_TERMINALS'] = configuration.ENTU_API_ENTITY + '?definition=terminal'
configuration['TICKETSTATUS_URL'] = 'http://84.50.247.234:8072/ticketstatus.php'



var user_data = ''

var submit_field = ''
$('#ticket_field').change(function(event) {
    submit_field = ticket
})
$('#barcode_field').change(function(event) {
    submit_field = barcode
})
$('#submit_btn').click(function(event) {
})


$.ajax({'url': configuration.ENTU_API_TERMINALS })
.done(function Ok( data ) {
    result = data.result
    result.forEach(function terminalLoop(t) {
        // console.log(t)
        var new_terminal = $('<option>').text(t.name)
        $('#select_terminal').append(new_terminal)
        $.ajax({'url': configuration.ENTU_API_ENTITY + '-' + t.id })
        .done(function Ok( data ) {
            var terminal_id = data.result.properties.id.values[0].value
            new_terminal.attr('value', terminal_id);
        })
        .fail(function Fail( data ) {
            console.log(data)
        })
    })
})
.fail(function Fail( data ) {
    console.log(data)
})

var q_options = {op: '', ticket: ''}

$('#select_terminal').change(function(event) {
    $('#select_terminal_row').addClass('hidden')
    $('#terminal_name').text($('option[value="' + $('#select_terminal').val() + '"]').html())
    $('#terminal_name_row').removeClass('hidden')
    $('#ticket_check_row').removeClass('hidden')
    q_options['term'] = $('#select_terminal').val()
    console.log($('#select_terminal').val())
    console.log($('option[value="' + $('#select_terminal').val() + '"]').text())
})

var input_type = ''
$('#barcode_input').change(function(event) {
    $('#ticket_id_input').val('')
    q_options['ticket'] = $('#barcode_input').val()
    q_options['op'] = 'T'
    input_type = 'triipkood'
})
$('#ticket_id_input').change(function(event) {
    $('#barcode_input').val('')
    q_options['ticket'] = $('#ticket_id_input').val()
    q_options['op'] = 'M'
    input_type = 'pileti id'
})
$('#submit_ticket').click(function(event) {
    $.getJSON(configuration.TICKETSTATUS_URL, q_options, function(json, textStatus) {
        // console.log(json)
        $('#result_rows').text('')
        json.rows.forEach(function rowLoop(r) {
            console.log(r)
            var row_element = $('<div>')
            row_element.addClass('status_' + json.status)
            row_element.text(r)
            $('#result_rows').append(row_element)
        })
    })
    .fail(function Fail( data ) {
        console.log(data)
        $('#result_rows').text('Paha ' + input_type + '.')
    })

    return false
})
