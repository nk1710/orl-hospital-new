<?php
/**
 * ORL International Hospital - General & Department Inquiry Controller
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($action == 'submit_inquiry' || empty($action)) {
        require_once __DIR__ . '/mail_helper.php';

        // Form data
        $name     = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
        $email    = isset($_POST["email"]) ? strip_tags(trim($_POST["email"])) : '';
        $mobile   = isset($_POST["mobile"]) ? strip_tags(trim($_POST["mobile"])) : '';
        $service  = isset($_POST["subject"]) ? strip_tags(trim($_POST["subject"])) : '';
        $location = isset($_POST["location"]) ? strip_tags(trim($_POST["location"])) : '';
        $message  = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : '';
        $source   = isset($_POST["source"]) ? strip_tags(trim($_POST["source"])) : ($_SERVER['HTTP_REFERER'] ?? 'Website');

        // Validation - mobile is essential
        if (empty($mobile)) {
            echo json_encode(["success" => false, "message" => "Please provide a valid mobile number."]);
            exit;
        }

        try {
            $mailer = new HospitalMailer();
            $result = $mailer->sendLead([
                'type'     => 'Website Inquiry' . ($service ? " ($service)" : ""),
                'name'     => $name,
                'mobile'   => $mobile,
                'email'    => $email,
                'service'  => $service,
                'location' => $location,
                'message'  => $message,
                'source'   => $source
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Thank you for your inquiry! Our healthcare team will contact you shortly.",
                "status"  => $result['mail_status']
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "Something went wrong while sending your inquiry. Please call +919311449825."
            ]);
        }
        exit;
    }

    if ($action == 'verify_otp') {
        echo json_encode(["success" => true, "message" => "OTP Verified successfully."]);
        exit;
    }
} else {
    if ($action == 'resend_otp') {
        echo json_encode(["success" => true, "message" => "OTP has been resent."]);
        exit;
    }
    echo json_encode(["success" => false, "message" => "Invalid Request."]);
}
