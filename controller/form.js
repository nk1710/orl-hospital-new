function submitInquiry(id) {
    var formData = $("#ajax-form-popup").serialize();
    $.ajax({
        type: "POST",
        url: "enquiry.php",
        data: formData,
        success: function(response) {
            alert(response); // Success message dikhayega
        }
    });
}