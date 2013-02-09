<?php

function forbidden() { header ('HTTP/1.1 403 Forbidden'); }


if ($_SERVER['REQUEST_METHOD'] <> 'PUT') {
  forbidden();
}

$line = file_get_contents("php://input");
$line = preg_replace("~[^a-zA-Z0-9 ;,.@()äöüÄÖÜß]~", '', $line)."\r\n";
if (file_put_contents('anmeldung.csv', $line, FILE_APPEND) == false) {
  header('HTTP/1.1 500 Internal Server Error');
}
?>
