<?php
# Read data from HTTP PUT and write it to the file `anmeldung.csv'
# (c) Henning Perl 2012-2016 for YFU

function forbidden() { header('HTTP/1.1 403 Forbidden'); }

# only listen to PUT
if ($_SERVER['REQUEST_METHOD'] <> 'PUT') {
  forbidden();
  exit(0);
}

$anmeldungen = 'anmeldung.csv';

# copy anmeldung.csv if not exists
if (!file_exists($anmeldungen)) {
  copy('anmeldung.csv.tmpl', $anmeldungen);
}

$line = file_get_contents("php://input");
# filter input with a whitelist regex
$line = preg_replace("/[^a-zA-Z0-9 ;,.@()äöüÄÖÜß\-]/", '', $line)."\r\n";
# if all fails we fail
if (file_put_contents($anmeldungen, $line, FILE_APPEND) == false) {
  header('HTTP/1.1 500 Internal Server Error');
}
?>
