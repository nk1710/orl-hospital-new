<?php
/**
 * ORL International Hospital - Leads Dashboard & Export
 * 
 * Simple, secure dashboard for hospital administration to view leads
 * and download leads_database.csv
 */
session_start();

// Password for admin access (change this as desired)
define('ADMIN_PASSWORD', 'orlhospital123');

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['orl_admin_logged']);
    header('Location: leads_viewer.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        $_SESSION['orl_admin_logged'] = true;
    } else {
        $error = "Incorrect password.";
    }
}

$isLogged = !empty($_SESSION['orl_admin_logged']);

// Handle CSV Download
if ($isLogged && isset($_GET['action']) && $_GET['action'] === 'download') {
    $csvFile = __DIR__ . '/leads_database.csv';
    if (file_exists($csvFile)) {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="orl_hospital_leads_' . date('Y-m-d') . '.csv"');
        readfile($csvFile);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORL Hospital - Leads Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f0f4f8; font-family: system-ui, -apple-system, sans-serif; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .badge-type { background: #21548b; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; }
    </style>
</head>
<body class="py-4">
<div class="container-fluid px-4">
    <?php if (!$isLogged): ?>
        <div class="row justify-content-center" style="margin-top: 100px;">
            <div class="col-md-4">
                <div class="card card-custom p-4">
                    <h4 class="text-center mb-3 text-primary fw-bold">ORL Hospital Leads</h4>
                    <p class="text-muted text-center small">Enter admin password to access leads</p>
                    <?php if (isset($error)): ?>
                        <div class="alert alert-danger py-2"><?= htmlspecialchars($error) ?></div>
                    <?php endif; ?>
                    <form method="post">
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" placeholder="Enter password" required autofocus>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Unlock Dashboard</button>
                    </form>
                    <p class="text-muted text-center small mt-3">Default: <code>orlhospital123</code></p>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-0 text-primary">🏥 ORL International Hospital - Leads Database</h3>
                <p class="text-muted mb-0 small">All form submissions & appointments are safely preserved here</p>
            </div>
            <div>
                <a href="leads_viewer.php?action=download" class="btn btn-success btn-sm me-2">📥 Download CSV</a>
                <a href="leads_viewer.php?action=logout" class="btn btn-outline-danger btn-sm">Logout</a>
            </div>
        </div>

        <div class="card card-custom p-3">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Date & Time</th>
                            <th>Lead Type</th>
                            <th>Patient Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Doctor / Service</th>
                            <th>Date / Slot</th>
                            <th>Location</th>
                            <th>Message</th>
                            <th>Source</th>
                            <th>Email Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $csvFile = __DIR__ . '/leads_database.csv';
                        if (file_exists($csvFile)) {
                            $lines = array_map('str_getcsv', file($csvFile));
                            $header = array_shift($lines);
                            $reversed = array_reverse($lines);

                            if (empty($reversed)) {
                                echo '<tr><td colspan="11" class="text-center text-muted py-4">No leads recorded yet.</td></tr>';
                            } else {
                                foreach ($reversed as $row) {
                                    if (count($row) < 5) continue;
                                    echo '<tr>';
                                    echo '<td class="small text-nowrap">' . htmlspecialchars($row[0] ?? '') . '</td>';
                                    echo '<td><span class="badge-type">' . htmlspecialchars($row[1] ?? '') . '</span></td>';
                                    echo '<td class="fw-bold text-nowrap">' . htmlspecialchars($row[2] ?? '') . '</td>';
                                    echo '<td class="text-nowrap"><a href="tel:' . htmlspecialchars($row[3] ?? '') . '" class="text-decoration-none fw-bold">' . htmlspecialchars($row[3] ?? '') . '</a> <a href="https://wa.me/91' . preg_replace('/[^0-9]/', '', $row[3] ?? '') . '" target="_blank" class="badge bg-success text-decoration-none">WA</a></td>';
                                    echo '<td class="small">' . htmlspecialchars($row[4] ?? '') . '</td>';
                                    echo '<td class="small">' . htmlspecialchars($row[5] ?? '') . '</td>';
                                    echo '<td class="small text-nowrap">' . htmlspecialchars($row[6] ?? '') . '</td>';
                                    echo '<td class="small">' . htmlspecialchars($row[7] ?? '') . '</td>';
                                    echo '<td class="small" style="max-width:200px; overflow:hidden; text-overflow:ellipsis;">' . htmlspecialchars($row[8] ?? '') . '</td>';
                                    echo '<td class="small text-truncate" style="max-width:120px;">' . htmlspecialchars($row[9] ?? '') . '</td>';
                                    $st = $row[11] ?? 'Sent';
                                    $badge = (strpos($st, 'Sent') !== false) ? 'bg-success' : 'bg-warning text-dark';
                                    echo '<td><span class="badge ' . $badge . '">' . htmlspecialchars($st) . '</span></td>';
                                    echo '</tr>';
                                }
                            }
                        } else {
                            echo '<tr><td colspan="11" class="text-center text-muted py-4">Database initialized. Waiting for first lead.</td></tr>';
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
