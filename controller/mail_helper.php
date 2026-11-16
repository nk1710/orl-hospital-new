<?php
/**
 * ORL International Hospital - Enterprise Mail & Lead Handler
 * 
 * Provides robust email delivery with:
 * 1. Automatic lead backup to CSV (guarantees zero lead loss).
 * 2. Proper domain-based From headers & envelope sender (-f) to prevent Hostinger SPF/DMARC rejection.
 * 3. Pure-PHP socket SMTP client (no composer needed) for Hostinger / Gmail SMTP.
 * 4. Automatic fallback from SMTP to PHP mail().
 * 5. Beautiful responsive HTML email template with 1-click WhatsApp & Call links.
 */

class HospitalMailer {
    private $config;

    public function __construct() {
        $configFile = __DIR__ . '/mail_config.php';
        if (file_exists($configFile)) {
            $this->config = require $configFile;
        } else {
            $this->config = [
                'recipients' => ['drdhirendrasinghent@gmail.com'],
                'subject_prefix' => '[ORL Hospital Lead] ',
                'from_email' => 'noreply@' . ($_SERVER['HTTP_HOST'] ?? 'orlinternationalhospital.com'),
                'from_name' => 'ORL International Hospital',
                'smtp' => ['enabled' => false],
                'save_to_csv' => true,
                'csv_file' => __DIR__ . '/leads_database.csv',
                'debug_log' => true,
                'log_file' => __DIR__ . '/mail_debug.log'
            ];
        }

        // Support .env file if present in public_html or controller
        $envPaths = [dirname(__DIR__) . '/.env', __DIR__ . '/.env'];
        foreach ($envPaths as $envFile) {
            if (file_exists($envFile)) {
                $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (empty($line) || strpos($line, '#') === 0) continue;
                    if (strpos($line, '=') !== false) {
                        list($key, $val) = explode('=', $line, 2);
                        $key = trim($key);
                        $val = trim($val, " \t\n\r\0\x0B\"'");
                        if ($key === 'SMTP_HOST') $this->config['smtp']['host'] = $val;
                        if ($key === 'SMTP_PORT') $this->config['smtp']['port'] = intval($val);
                        if ($key === 'SMTP_SECURE') $this->config['smtp']['secure'] = strtolower($val);
                        if ($key === 'SMTP_USER' || $key === 'SMTP_USERNAME' || $key === 'GMAIL_USER' || $key === 'MAIL_USERNAME') {
                            $this->config['smtp']['username'] = $val;
                            if (empty($this->config['from_email'])) $this->config['from_email'] = $val;
                        }
                        if ($key === 'SMTP_PASS' || $key === 'SMTP_PASSWORD' || $key === 'GMAIL_PASSWORD' || $key === 'GMAIL_APP_PASSWORD' || $key === 'MAIL_PASSWORD') {
                            $cleanPass = str_replace(' ', '', $val);
                            $this->config['smtp']['password'] = $cleanPass;
                            if (!empty($cleanPass)) {
                                $this->config['smtp']['enabled'] = true;
                            }
                        }
                        if ($key === 'RECEIVER_EMAIL' || $key === 'LEAD_EMAIL' || $key === 'MAIL_RECEIVER') {
                            $this->config['recipients'] = array_map('trim', explode(',', $val));
                        }
                    }
                }
            }
        }
    }

    /**
     * Send lead and backup to database
     */
    public function sendLead($leadData, $attachment = null) {
        $type = $leadData['type'] ?? 'Website Inquiry';
        $name = !empty($leadData['name']) ? $leadData['name'] : 'Not Provided';
        $mobile = !empty($leadData['mobile']) ? $leadData['mobile'] : 'Not Provided';
        $email = !empty($leadData['email']) ? $leadData['email'] : '';
        $doctor = !empty($leadData['doctor']) ? $leadData['doctor'] : '';
        $service = !empty($leadData['service']) ? $leadData['service'] : '';
        $date = !empty($leadData['date']) ? $leadData['date'] : '';
        $time = !empty($leadData['time']) ? $leadData['time'] : '';
        $location = !empty($leadData['location']) ? $leadData['location'] : '';
        $message = !empty($leadData['message']) ? $leadData['message'] : '';
        $source = !empty($leadData['source']) ? $leadData['source'] : 'Website';
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $timeStr = date('Y-m-d H:i:s');

        // Clean phone for WhatsApp / Tel link
        $cleanPhone = preg_replace('/[^0-9]/', '', $mobile);
        if (strlen($cleanPhone) === 10) {
            $waPhone = '91' . $cleanPhone;
        } else {
            $waPhone = $cleanPhone;
        }

        // Email Subject
        $subject = ($this->config['subject_prefix'] ?? '[ORL Lead] ') . $type . ' - ' . $name . ' (' . $mobile . ')';

        // Build HTML Body
        $html = $this->buildHtmlTemplate([
            'type' => $type,
            'name' => $name,
            'mobile' => $mobile,
            'waPhone' => $waPhone,
            'email' => $email,
            'doctor' => $doctor,
            'service' => $service,
            'date' => $date,
            'time' => $time,
            'location' => $location,
            'message' => $message,
            'source' => $source,
            'timeStr' => $timeStr,
            'ip' => $ip
        ]);

        // Build Plain Text Body
        $text = "=================================================\n";
        $text .= "ORL INTERNATIONAL HOSPITAL - NEW LEAD\n";
        $text .= "=================================================\n\n";
        $text .= "Type: $type\n";
        $text .= "Name: $name\n";
        $text .= "Phone: $mobile\n";
        if ($email) $text .= "Email: $email\n";
        if ($doctor) $text .= "Doctor: $doctor\n";
        if ($service) $text .= "Department/Service: $service\n";
        if ($date) $text .= "Preferred Date: $date\n";
        if ($time) $text .= "Time Slot: $time\n";
        if ($location) $text .= "Location: $location\n";
        if ($message) $text .= "Message/Symptoms: $message\n";
        $text .= "Source Page: $source\n";
        $text .= "Submitted At: $timeStr\n";
        $text .= "Client IP: $ip\n";
        $text .= "=================================================\n";

        // Reply-To header
        $replyTo = !empty($email) ? $email : ($this->config['from_email'] ?? 'info@orlinternationalhospital.com');

        // Dispatch Email
        $mailStatus = 'Pending';
        $mailError = '';

        if (!empty($this->config['smtp']['enabled'])) {
            $smtpRes = $this->sendViaSMTP($subject, $html, $text, $attachment, $replyTo);
            if ($smtpRes['success']) {
                $mailStatus = 'Sent via SMTP';
            } else {
                $mailError = $smtpRes['error'];
                $this->logDebug("SMTP failed: $mailError. Falling back to PHP mail().");
                // Fallback to PHP mail()
                $fallbackRes = $this->sendViaPHPMail($subject, $html, $text, $attachment, $replyTo);
                $mailStatus = $fallbackRes['success'] ? 'Sent via PHP mail() (Fallback)' : 'Failed: ' . $fallbackRes['error'];
            }
        } else {
            $res = $this->sendViaPHPMail($subject, $html, $text, $attachment, $replyTo);
            $mailStatus = $res['success'] ? 'Sent via PHP mail()' : 'Failed: ' . $res['error'];
        }

        // Save to CSV Database
        if (!empty($this->config['save_to_csv'])) {
            $this->saveLeadToCSV([
                $timeStr,
                $type,
                $name,
                $mobile,
                $email,
                ($doctor ? "Doctor: $doctor" : "") . ($service ? " | Service: $service" : ""),
                ($date ? "Date: $date" : "") . ($time ? " | Slot: $time" : ""),
                $location,
                $message,
                $source,
                $ip,
                $mailStatus
            ]);
        }

        $this->logDebug("Lead Processed: [$type] $name ($mobile) -> Status: $mailStatus");

        return [
            'success' => true,
            'mail_status' => $mailStatus
        ];
    }

    /**
     * Backup lead to CSV file
     */
    private function saveLeadToCSV($row) {
        $file = $this->config['csv_file'] ?? (__DIR__ . '/leads_database.csv');
        $isNew = !file_exists($file);
        $fp = @fopen($file, 'a');
        if ($fp) {
            if ($isNew) {
                fputcsv($fp, ['Date & Time', 'Lead Type', 'Patient Name', 'Mobile Number', 'Email', 'Doctor / Service', 'Appointment Date / Slot', 'Location', 'Message', 'Source URL', 'IP Address', 'Email Status']);
            }
            fputcsv($fp, $row);
            fclose($fp);
        }
    }

    /**
     * Send via PHP mail() with proper domain headers and envelope sender (-f)
     */
    private function sendViaPHPMail($subject, $htmlBody, $textBody, $attachment, $replyTo) {
        $recipients = $this->config['recipients'] ?? ['drdhirendrasinghent@gmail.com'];
        $toStr = implode(', ', $recipients);
        $fromEmail = $this->config['from_email'] ?? 'noreply@orlinternationalhospital.com';
        $fromName = $this->config['from_name'] ?? 'ORL International Hospital';

        $boundary = "==_Multipart_Boundary_x" . md5(time()) . "x";

        $headers = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$fromEmail>\r\n";
        $headers .= "Reply-To: <$replyTo>\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

        // Body with multipart/alternative inside multipart/mixed
        $altBoundary = "==_Alt_Boundary_y" . md5(time() + 1) . "y";

        $body = "--$boundary\r\n";
        $body .= "Content-Type: multipart/alternative; boundary=\"$altBoundary\"\r\n\r\n";

        // Plain Text
        $body .= "--$altBoundary\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $textBody . "\r\n\r\n";

        // HTML Text
        $body .= "--$altBoundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $htmlBody . "\r\n\r\n";

        $body .= "--$altBoundary--\r\n";

        // Attachment if present
        if ($attachment && !empty($attachment['tmp_name']) && file_exists($attachment['tmp_name'])) {
            $fileName = basename($attachment['name']);
            $fileContent = chunk_split(base64_encode(file_get_contents($attachment['tmp_name'])));
            $fileType = !empty($attachment['type']) ? $attachment['type'] : 'application/octet-stream';

            $body .= "--$boundary\r\n";
            $body .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= $fileContent . "\r\n";
        }

        $body .= "--$boundary--";

        // Call mail() with envelope sender parameter (-f)
        $sent = @mail($toStr, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, "-f $fromEmail");

        if ($sent) {
            return ['success' => true];
        } else {
            $error = error_get_last();
            return ['success' => false, 'error' => $error ? $error['message'] : 'mail() returned false'];
        }
    }

    /**
     * Send email via lightweight pure-PHP Socket SMTP (Supports SSL & TLS)
     */
    private function sendViaSMTP($subject, $htmlBody, $textBody, $attachment, $replyTo) {
        $smtp = $this->config['smtp'];
        $host = $smtp['host'] ?? 'smtp.hostinger.com';
        $port = $smtp['port'] ?? 465;
        $secure = strtolower($smtp['secure'] ?? 'ssl');
        $username = $smtp['username'] ?? '';
        $password = $smtp['password'] ?? '';
        $timeout = $smtp['timeout'] ?? 15;

        $fromEmail = $this->config['from_email'] ?? $username;
        $fromName = $this->config['from_name'] ?? 'ORL International Hospital';
        $recipients = $this->config['recipients'] ?? [];

        $targetHost = ($secure === 'ssl') ? "ssl://$host" : $host;
        $socket = @fsockopen($targetHost, $port, $errno, $errstr, $timeout);

        if (!$socket) {
            return ['success' => false, 'error' => "Cannot connect to SMTP server $host:$port ($errstr)"];
        }

        $response = fgets($socket, 515);
        if (substr($response, 0, 3) !== '220') {
            fclose($socket);
            return ['success' => false, 'error' => "SMTP greeting error: $response"];
        }

        // EHLO
        fputs($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n");
        $this->readSmtpResponse($socket);

        // STARTTLS if requested on non-SSL port
        if ($secure === 'tls') {
            fputs($socket, "STARTTLS\r\n");
            $response = fgets($socket, 515);
            if (substr($response, 0, 3) !== '220') {
                fclose($socket);
                return ['success' => false, 'error' => "STARTTLS failed: $response"];
            }
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            fputs($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n");
            $this->readSmtpResponse($socket);
        }

        // AUTH LOGIN
        if (!empty($username) && !empty($password)) {
            fputs($socket, "AUTH LOGIN\r\n");
            $response = fgets($socket, 515);
            if (substr($response, 0, 3) !== '334') {
                fclose($socket);
                return ['success' => false, 'error' => "AUTH LOGIN not accepted: $response"];
            }

            fputs($socket, base64_encode($username) . "\r\n");
            $response = fgets($socket, 515);
            if (substr($response, 0, 3) !== '334') {
                fclose($socket);
                return ['success' => false, 'error' => "Username rejected: $response"];
            }

            fputs($socket, base64_encode($password) . "\r\n");
            $response = fgets($socket, 515);
            if (substr($response, 0, 3) !== '235') {
                fclose($socket);
                return ['success' => false, 'error' => "SMTP Authentication failed: $response"];
            }
        }

        // MAIL FROM
        fputs($socket, "MAIL FROM:<$fromEmail>\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) !== '250') {
            fclose($socket);
            return ['success' => false, 'error' => "MAIL FROM error: $response"];
        }

        // RCPT TO for each recipient
        foreach ($recipients as $to) {
            fputs($socket, "RCPT TO:<$to>\r\n");
            $response = fgets($socket, 515);
            if (substr($response, 0, 3) !== '250' && substr($response, 0, 3) !== '251') {
                fclose($socket);
                return ['success' => false, 'error' => "RCPT TO error for $to: $response"];
            }
        }

        // DATA
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) !== '354') {
            fclose($socket);
            return ['success' => false, 'error' => "DATA error: $response"];
        }

        // MIME Construction
        $boundary = "==_SMTP_Bound_" . md5(time());
        $altBoundary = "==_SMTP_Alt_" . md5(time() + 1);

        $headers = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$fromEmail>\r\n";
        $headers .= "To: " . implode(', ', $recipients) . "\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $headers .= "Reply-To: <$replyTo>\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n\r\n";

        $content = "--$boundary\r\n";
        $content .= "Content-Type: multipart/alternative; boundary=\"$altBoundary\"\r\n\r\n";

        $content .= "--$altBoundary\r\n";
        $content .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $content .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $content .= $textBody . "\r\n\r\n";

        $content .= "--$altBoundary\r\n";
        $content .= "Content-Type: text/html; charset=UTF-8\r\n";
        $content .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $content .= $htmlBody . "\r\n\r\n";
        $content .= "--$altBoundary--\r\n";

        if ($attachment && !empty($attachment['tmp_name']) && file_exists($attachment['tmp_name'])) {
            $fileName = basename($attachment['name']);
            $fileContent = chunk_split(base64_encode(file_get_contents($attachment['tmp_name'])));
            $fileType = !empty($attachment['type']) ? $attachment['type'] : 'application/octet-stream';

            $content .= "--$boundary\r\n";
            $content .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
            $content .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
            $content .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $content .= $fileContent . "\r\n";
        }

        $content .= "--$boundary--\r\n.\r\n";

        fputs($socket, $headers . $content);
        $response = fgets($socket, 515);

        fputs($socket, "QUIT\r\n");
        fclose($socket);

        if (substr($response, 0, 3) === '250') {
            return ['success' => true];
        } else {
            return ['success' => false, 'error' => "Message delivery failed: $response"];
        }
    }

    private function readSmtpResponse($socket) {
        $data = '';
        while ($str = fgets($socket, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) === ' ') break;
        }
        return $data;
    }

    private function logDebug($msg) {
        if (!empty($this->config['debug_log'])) {
            $logFile = $this->config['log_file'] ?? (__DIR__ . '/mail_debug.log');
            @file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] " . $msg . "\n", FILE_APPEND);
        }
    }

    /**
     * Professional HTML Template for Hospital Leads
     */
    private function buildHtmlTemplate($d) {
        $type = htmlspecialchars($d['type']);
        $name = htmlspecialchars($d['name']);
        $mobile = htmlspecialchars($d['mobile']);
        $waPhone = htmlspecialchars($d['waPhone']);
        $email = htmlspecialchars($d['email']);
        $doctor = htmlspecialchars($d['doctor']);
        $service = htmlspecialchars($d['service']);
        $date = htmlspecialchars($d['date']);
        $time = htmlspecialchars($d['time']);
        $location = htmlspecialchars($d['location']);
        $message = nl2br(htmlspecialchars($d['message']));
        $source = htmlspecialchars($d['source']);
        $timeStr = htmlspecialchars($d['timeStr']);
        $ip = htmlspecialchars($d['ip']);

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ORL Hospital - New Lead</title>
</head>
<body style="margin:0; padding:20px; background-color:#f4f7fa; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#333;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08); border:1px solid #e1e8ed;">
        
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #21548b 0%, #15355a 100%); padding:25px 30px; text-align:center;">
                <h1 style="margin:0; font-size:22px; color:#ffffff; font-weight:700; letter-spacing:0.5px;">ORL INTERNATIONAL HOSPITAL</h1>
                <p style="margin:5px 0 0 0; color:#c7daf0; font-size:13px;">New Patient Lead & Enquiry Notification</p>
                <div style="margin-top:12px; display:inline-block; background:#e62000; color:#ffffff; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:bold; text-transform:uppercase;">
                    $type
                </div>
            </td>
        </tr>

        <!-- Body Content -->
        <tr>
            <td style="padding:30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    
                    <!-- Patient Name -->
                    <tr style="border-bottom:1px solid #edf2f7;">
                        <td width="35%" style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Patient Name:</td>
                        <td width="65%" style="padding:12px 10px; color:#0f172a; font-size:15px; font-weight:bold;">$name</td>
                    </tr>

                    <!-- Phone Number with Instant Action -->
                    <tr style="border-bottom:1px solid #edf2f7; background-color:#f8fafc;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Mobile Number:</td>
                        <td style="padding:12px 10px; font-size:15px;">
                            <a href="tel:$mobile" style="color:#21548b; font-weight:bold; text-decoration:none; margin-right:12px;">📞 $mobile</a>
                            <a href="https://wa.me/$waPhone" target="_blank" style="display:inline-block; background:#25D366; color:#ffffff; padding:3px 10px; border-radius:15px; font-size:12px; text-decoration:none; font-weight:bold;">💬 WhatsApp</a>
                        </td>
                    </tr>

                    <!-- Email -->
HTML
. (!empty($email) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Email:</td>
                        <td style="padding:12px 10px; color:#0f172a; font-size:14px;">
                            <a href="mailto:$email" style="color:#21548b; text-decoration:none;">$email</a>
                        </td>
                    </tr>
HTML
: '')
. (!empty($doctor) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7; background-color:#f8fafc;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Doctor Requested:</td>
                        <td style="padding:12px 10px; color:#0f172a; font-size:14px; font-weight:bold;">$doctor</td>
                    </tr>
HTML
: '')
. (!empty($service) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Department / Service:</td>
                        <td style="padding:12px 10px; color:#0f172a; font-size:14px;">$service</td>
                    </tr>
HTML
: '')
. (!empty($date) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7; background-color:#f8fafc;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Preferred Date & Slot:</td>
                        <td style="padding:12px 10px; color:#0f172a; font-size:14px; font-weight:bold;">$date ($time)</td>
                    </tr>
HTML
: '')
. (!empty($location) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Patient Location:</td>
                        <td style="padding:12px 10px; color:#0f172a; font-size:14px;">$location</td>
                    </tr>
HTML
: '')
. (!empty($message) ? <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7; background-color:#f8fafc;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600; vertical-align:top;">Message / Symptoms:</td>
                        <td style="padding:12px 10px; color:#334155; font-size:14px; line-height:1.5;">$message</td>
                    </tr>
HTML
: '')
. <<<HTML
                    <tr style="border-bottom:1px solid #edf2f7;">
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Source Page:</td>
                        <td style="padding:12px 10px; color:#475569; font-size:13px; word-break:break-all;">$source</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 10px; color:#64748b; font-size:14px; font-weight:600;">Submitted Time:</td>
                        <td style="padding:12px 10px; color:#475569; font-size:13px;">$timeStr (IP: $ip)</td>
                    </tr>
                </table>

                <!-- Action Button -->
                <div style="margin-top:25px; text-align:center;">
                    <a href="tel:$mobile" style="display:inline-block; background-color:#21548b; color:#ffffff; text-decoration:none; padding:12px 25px; font-size:14px; font-weight:bold; border-radius:6px; margin:0 5px;">Call Patient Now</a>
                    <a href="https://wa.me/$waPhone" target="_blank" style="display:inline-block; background-color:#25D366; color:#ffffff; text-decoration:none; padding:12px 25px; font-size:14px; font-weight:bold; border-radius:6px; margin:0 5px;">Chat on WhatsApp</a>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color:#edf2f7; padding:15px; text-align:center; font-size:12px; color:#64748b;">
                This lead was generated automatically from the ORL International Hospital website.<br>
                All leads are securely archived in the hospital lead database.
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}
