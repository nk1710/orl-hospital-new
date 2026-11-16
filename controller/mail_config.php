<?php
/**
 * ORL International Hospital - Mail & Lead Configuration
 * 
 * Instructions:
 * 1. Leads will be sent to the email address(es) listed in 'recipients'.
 * 2. By default, it uses PHP mail() configured with proper domain headers and envelope sender (-f)
 *    so it works directly on Hostinger without SPF/DMARC rejection.
 * 3. If you want 100% guaranteed delivery via SMTP (Hostinger Webmail or Gmail),
 *    simply set 'enabled' => true under 'smtp' and fill in your credentials.
 */

return [
    // Recipient email addresses to receive all leads/appointments
    'recipients' => [
        'drdhirendrasinghent@gmail.com',
        'info@orlinternationalhospital.com'
    ],

    // Email Subject Prefix
    'subject_prefix' => '[ORL Hospital Lead] ',

    // From email and name (Must belong to domain on Hostinger to pass SPF/DMARC)
    'from_email' => 'noreply@orlinternationalhospital.com',
    'from_name'  => 'ORL International Hospital',

    // SMTP Configuration (Optional but recommended for best deliverability)
    'smtp' => [
        'enabled'  => false,                     // Set to true to enable SMTP
        'host'     => 'smtp.hostinger.com',      // Hostinger: smtp.hostinger.com | Gmail: smtp.gmail.com
        'port'     => 465,                       // 465 for SSL, 587 for TLS
        'secure'   => 'ssl',                     // 'ssl' or 'tls'
        'username' => 'noreply@orlinternationalhospital.com', // Your Hostinger/Gmail email
        'password' => '',                        // Your email password or Google App Password
        'timeout'  => 15
    ],

    // Lead Database Backup Settings
    'save_to_csv' => true,
    'csv_file'    => __DIR__ . '/leads_database.csv',

    // Debug logging
    'debug_log'   => true,
    'log_file'    => __DIR__ . '/mail_debug.log'
];
