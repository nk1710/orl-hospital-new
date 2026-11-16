function submitAppointment(id) {
    var form = $('#appointment-popup')[0];
    var formData = new FormData(form);

    $.ajax({
        url: 'appointment.php',
        type: 'POST',
        data: formData,
        contentType: false, // Required for file upload
        processData: false, // Required for file upload
        success: function(response) {
            alert(response);
        }
    });
}