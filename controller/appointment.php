<?php
/**
 * ORL International Hospital - Appointment Controller
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once __DIR__ . '/mail_helper.php';

    // Sanitize Inputs
    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
    $mobile = isset($_POST["mobile"]) ? strip_tags(trim($_POST["mobile"])) : '';
    $email = isset($_POST["email"]) ? strip_tags(trim($_POST["email"])) : '';
    $doctor = isset($_POST["doctor"]) ? strip_tags(trim($_POST["doctor"])) : 'Not Specified';
    $dept = isset($_POST["designation"]) ? strip_tags(trim($_POST["designation"])) : 'General';
    $date = isset($_POST["booking_on"]) ? strip_tags(trim($_POST["booking_on"])) : 'Not Specified';
    $time = isset($_POST["time_slot"]) ? strip_tags(trim($_POST["time_slot"])) : 'Not Specified';
    $address = isset($_POST["address"]) ? strip_tags(trim($_POST["address"])) : '';
    $message = isset($_POST["remark"]) ? strip_tags(trim($_POST["remark"])) : '';
    $source = isset($_POST["source"]) ? strip_tags(trim($_POST["source"])) : ($_SERVER['HTTP_REFERER'] ?? 'Website');

    // Validation
    if (empty($mobile) && empty($name)) {
        echo json_encode([
            "success" => false,
            "message" => "Please enter your name and contact mobile number."
        ]);
        exit;
    }

    if (empty($mobile)) {
        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid mobile number."
        ]);
        exit;
    }

    // Attachment processing
    $attachment = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == UPLOAD_ERR_OK) {
        $attachment = $_FILES['attachment'];
    }

    try {
        $mailer = new HospitalMailer();
        $result = $mailer->sendLead([
            'type'     => 'Appointment Request',
            'name'     => $name,
            'mobile'   => $mobile,
            'email'    => $email,
            'doctor'   => $doctor,
            'service'  => $dept,
            'date'     => $date,
            'time'     => $time,
            'location' => $address,
            'message'  => $message,
            'source'   => $source
        ], $attachment);

        echo json_encode([
            "success" => true,
            "message" => "Your appointment request has been submitted successfully! Our team will contact you shortly to confirm.",
            "status"  => $result['mail_status']
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Unable to process appointment right now. Please call us directly at +919311449825."
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid Request Method."]);
}
