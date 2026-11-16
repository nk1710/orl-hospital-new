<?php
/**
 * ORL International Hospital - Email System Test Utility
 * 
 * Open this file in your browser to verify email deliverability:
 * https://orlinternationalhospital.com/controller/test_mail.php
 */
require_once __DIR__ . '/mail_helper.php';

header('Content-Type: text/html; charset=utf-8');

$mailer = new HospitalMailer();
$result = null;
$error = null;

if (isset($_GET['send_test'])) {
    try {
        $result = $mailer->sendLead([
            'type'     => 'System Test Email',
            'name'     => 'Test Patient',
            'mobile'   => '9876543210',
            'email'    => 'test@example.com',
            'doctor'   => 'Dr. Dhirendra Singh Kushwah',
            'service'  => 'ENT Department',
            'date'     => date('Y-m-d'),
            'time'     => '11:00 AM',
            'location' => 'New Delhi',
            'message'  => 'This is a test notification to verify that the lead email system is working 100% properly on Hostinger.',
            'source'   => 'test_mail.php'
        ]);
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

$configFile = __DIR__ . '/mail_config.php';
$cfg = file_exists($configFile) ? require $configFile : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORL Hospital - Email Diagnostic Test</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; padding: 40px 15px; }
        .card-box { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); padding: 30px; }
        .code-box { background: #0f172a; color: #38bdf8; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; word-break: break-all; }
    </style>
</head>
<body>
<div class="card-box">
    <h3 class="fw-bold text-primary mb-2">🏥 Lead Email System Diagnostic</h3>
    <p class="text-muted small">Verify that website inquiries and appointments reach your email.</p>

    <?php if ($result): ?>
        <div class="alert alert-success mt-3">
            <h5 class="fw-bold mb-1">🎉 Test Lead Dispatched!</h5>
            <p class="mb-1">Delivery Status: <strong><?= htmlspecialchars($result['mail_status']) ?></strong></p>
            <p class="mb-0 small">Please check your inbox (and Spam/Junk folder) at: <strong><?= htmlspecialchars(implode(', ', $cfg['recipients'] ?? [])) ?></strong></p>
        </div>
    <?php elseif ($error): ?>
        <div class="alert alert-danger mt-3">
            <h5 class="fw-bold mb-1">❌ Test Failed</h5>
            <p class="mb-0"><?= htmlspecialchars($error) ?></p>
        </div>
    <?php endif; ?>

    <div class="mt-4">
        <h6 class="fw-bold text-dark">Current Configuration:</h6>
        <ul class="list-group list-group-flush small mb-3">
            <li class="list-group-item d-flex justify-content-between">
                <span>Leads Recipient Email:</span>
                <strong class="text-primary"><?= htmlspecialchars(implode(', ', $cfg['recipients'] ?? ['Not set'])) ?></strong>
            </li>
            <li class="list-group-item d-flex justify-content-between">
                <span>Sending Method:</span>
                <strong><?= !empty($cfg['smtp']['enabled']) ? 'Gmail / SMTP Authenticated' : 'Hostinger Default PHP mail()' ?></strong>
            </li>
            <?php if (!empty($cfg['smtp']['enabled'])): ?>
                <li class="list-group-item d-flex justify-content-between">
                    <span>SMTP Server:</span>
                    <span><?= htmlspecialchars($cfg['smtp']['host']) ?>:<?= htmlspecialchars($cfg['smtp']['port']) ?> (<?= htmlspecialchars($cfg['smtp']['secure']) ?>)</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <span>SMTP Username:</span>
                    <span><?= htmlspecialchars($cfg['smtp']['username']) ?></span>
                </li>
            <?php endif; ?>
        </ul>

        <div class="d-grid gap-2">
            <a href="test_mail.php?send_test=1" class="btn btn-primary btn-lg fw-bold">🚀 Send Test Email Now</a>
        </div>
    </div>

    <hr class="my-4">

    <div class="small text-muted">
        <strong>Recent Debug Log:</strong>
        <div class="code-box mt-2">
            <?php
            $logFile = __DIR__ . '/mail_debug.log';
            if (file_exists($logFile)) {
                $lines = array_slice(file($logFile), -8);
                echo htmlspecialchars(implode('', $lines));
            } else {
                echo 'No logs recorded yet.';
            }
            ?>
        </div>
    </div>
</div>
</body>
</html>
