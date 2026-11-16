<?php
/**
 * ORL International Hospital - Mail & Lead Configuration
 */

return [
    // Recipient email addresses to receive all leads/appointments
    'recipients' => [
        'drdhirendrasinghent@gmail.com',
        'info@orlinternationalhospital.com'
    ],

    // Email Subject Prefix
    'subject_prefix' => '[ORL Hospital Lead] ',

    // From email and name
    'from_email' => 'drdhirendrasinghent@gmail.com',
    'from_name'  => 'ORL International Hospital',

    // SMTP Configuration (Active with Gmail Authenticated SMTP)
    'smtp' => [
        'enabled'  => true,
        'host'     => 'smtp.gmail.com',
        'port'     => 465,
        'secure'   => 'ssl',
        'username' => 'drdhirendrasinghent@gmail.com',
        'password' => 'lkajspgjdhmqbofn',
        'timeout'  => 15
    ],

    // Lead Database Backup Settings
    'save_to_csv' => true,
    'csv_file'    => __DIR__ . '/leads_database.csv',

    // Debug logging
    'debug_log'   => true,
    'log_file'    => __DIR__ . '/mail_debug.log'
];
