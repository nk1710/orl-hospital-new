if (typeof site_url === 'undefined') {
  var is_local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
  if (is_local) {
    site_url = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    if (window.location.protocol === 'file:') {
      site_url = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    }
  } else {
    site_url = window.location.origin;
  }
}
// Strip trailing slash if present
site_url = site_url.replace(/\/$/, "");
console.log("Site URL detected as: " + site_url);

if (typeof upload_path === 'undefined') var upload_path = "uploads";
if (typeof no_image === 'undefined') var no_image = site_url + "/public/img/orl-hospital.png";
if (typeof home_image === 'undefined') var home_image = site_url + "/uploads/page/698af669634d0.jpg";

// Missing notification function
const notification = (type, message) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Success' : 'Error',
      text: message,
      timer: 3000
    });
  } else {
    alert(type.toUpperCase() + ": " + message);
  }
}

/*inquiry = (image = '', subject = '', catalog='', type='')=>{
 let img = "";
 if(type=='product'){
  img = site_url+"/"+upload_path+"/product/"+image;      
 }else{
  img = (image == "") ? home_image : site_url+"/"+upload_path+"/category/"+image;     
 }     
 
 $('#subject').val(subject); 
 $('#catalog').val(catalog);
 $('#popup-image').attr('src',img);
 new bootstrap.Modal($('#ajaxModal')).show();
}*/

inquiry = (image = '', subject = '', catalog = '') => {
  let img = "";
  if (image != "") {
    img = (image != no_image) ? image : home_image;
  } else {
    img = home_image;
  }

  $('#subject').val(subject);
  $('#catalog').val(catalog);
  $('#popup-image').attr('src', img);
  new bootstrap.Modal(document.getElementById('ajaxModal')).show();
}

submitInquiry = (is_popup = 0) => {
  let btn_txt = '<i class="fa fa-send"></i> Send Message';
  let url = site_url + "/controller/enquiry.php?action=submit_inquiry";
  let form = $('#ajax-form')[0];
  if (is_popup == 1) {
    form = $('#ajax-form-popup')[0];
  } else if (is_popup == 2) {
    form = $('#ajax-form-landing')[0];
  }
  if (!form) {
    form = $('form.contact__form')[0] || $('#ajax-form-popup')[0] || $('#ajax-form')[0];
  }
  if (!form) {
    console.error("Inquiry form element not found in DOM.");
    notification("error", "Form could not be located. Please call us directly.");
    return;
  }
  let formData = new FormData(form);
  $.ajax({
    url: url,
    type: "POST",
    dataType: "JSON",
    processData: false,
    contentType: false,
    data: formData,
    beforeSend: function () {
      $('.ajax-btn').prop('disabled', 'disabled').html('<div class="spinner-border"></div>');
    },
    success: function (res) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      if (res && res.success) {
        window.location.href = site_url + "/thank-you.html";
      } else {
        notification("error", res ? res.message : "Error submitting inquiry.");
      }
    },
    error: function (xhr, status, error) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      console.error("Inquiry Error:", status, error, xhr.responseText);
      notification("error", "Network error: " + status + " (" + error + "). Please check console for details.");
    }
  });
}

verifyOTP = () => {
  let btn_txt = '<i class="fa fa-send"></i> Verify OTP';
  let url = site_url + "/controller/enquiry.php?action=verify_otp";
  let form = $('#otp-form')[0];
  let formData = new FormData(form);
  $.ajax({
    url: url,
    type: "POST",
    dataType: "JSON",
    processData: false,
    contentType: false,
    data: formData,
    beforeSend: function () {
      $('.ajax-btn').prop('disabled', 'disabled').html('<div class="spinner-border"></div>');
    },
    success: function (res) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      if (res && res.success) {
        window.location.href = site_url + "/thank-you.html";
      } else {
        notification("error", res ? res.message : "OTP verification failed.");
      }
    },
    error: function (xhr, status, error) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      console.error("OTP Error:", status, error, xhr.responseText);
      notification("error", "Network error: " + status + " (" + error + "). Please check console for details.");
    }
  });
}

resendOTP = () => {
  $('#resend-otp').hide();
  let url = site_url + "/controller/enquiry.php?action=resend_otp";
  $.get(url, function (response) {
    setTimeout(function () {
      $('#resend-otp').show();
    }, 10000);
    let data = JSON.parse(response);
    notification("success", data.message);
  });
}

submitAppointment = (is_popup = 0) => {
  let btn_txt = 'Book Appointment';
  let url = site_url + "/controller/appointment.php?action=submit_appointment";
  let form = $('#appointment-form')[0];
  if (is_popup == 1) {
    form = $('#appointment-popup')[0];
  }
  if (!form) {
    form = $('#appointment-popup')[0] || $('#appointment-form')[0] || $('form[id*="appointment"]')[0];
  }
  if (!form) {
    console.error("Appointment form element not found in DOM.");
    notification("error", "Appointment form could not be located. Please call us directly.");
    return;
  }
  let formData = new FormData(form);
  $.ajax({
    url: url,
    type: "POST",
    dataType: "JSON",
    processData: false,
    contentType: false,
    data: formData,
    beforeSend: function () {
      $('.ajax-btn').prop('disabled', 'disabled').html('<div class="spinner-border"></div>');
    },
    success: function (res) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      if (res && res.success) {
        window.location.href = site_url + "/thank-you.html";
      } else {
        notification("error", res ? res.message : "Appointment booking failed.");
      }
    },
    error: function (xhr, status, error) {
      $('.ajax-btn').prop('disabled', false).html(btn_txt);
      console.error("Appointment Error:", status, error, xhr.responseText);
      notification("error", "Network error: " + status + " (" + error + "). Please check console for details.");
    }
  });
}
