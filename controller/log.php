<?php
/**
 * ORL International Hospital - Quick Connect & Sticky Action Controller
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
    if ($action == 'submit_sticky' || empty($action)) {
        require_once __DIR__ . '/mail_helper.php';

        $name   = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : 'Patient';
        $mobile = isset($_POST["mobile"]) ? strip_tags(trim($_POST["mobile"])) : '';
        $type   = isset($_POST["type"]) ? strip_tags(trim($_POST["type"])) : 'Direct Connect';
        $source = isset($_POST["source"]) ? strip_tags(trim($_POST["source"])) : ($_SERVER['HTTP_REFERER'] ?? 'Website');

        if (empty($mobile)) {
            echo json_encode(["success" => false, "message" => "Please enter your mobile number."]);
            exit;
        }

        try {
            $mailer = new HospitalMailer();
            $result = $mailer->sendLead([
                'type'     => "Quick Connect Request ($type)",
                'name'     => $name,
                'mobile'   => $mobile,
                'message'  => "Patient requested instant connection via $type.",
                'source'   => $source
            ]);

            // Determine redirect URL based on connect type
            $redirect = 'thank-you.html';
            $lowerType = strtolower($type);
            if (strpos($lowerType, 'whats') !== false) {
                $redirect = "https://api.whatsapp.com/send?phone=919311449825&text=" . urlencode("Hi ORL Hospital, My name is $name ($mobile). I would like to consult with a specialist.");
            } else if (strpos($lowerType, 'call') !== false || strpos($lowerType, 'phone') !== false) {
                $redirect = "tel:+919311449825";
            }

            echo json_encode([
                "success"  => true,
                "message"  => "Connecting...",
                "redirect" => $redirect,
                "status"   => $result['mail_status']
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "Connection failed. Please call +919311449825 directly."
            ]);
        }
        exit;
    }
}

echo json_encode(["success" => false, "message" => "Invalid Request."]);
