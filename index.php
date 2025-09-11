<?php
$apiUrl = 'https://leatherproject.github.io/shop/data/data.json';
//$apiUrl = 'https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json';
//$apiUrl = './data/data.json';

// Получаем данные с API Google Apps Script
$jsonData = @file_get_contents($apiUrl);

if ($jsonData !== false) {
    // Проверяем валидность JSON
    if (json_decode($jsonData) !== null) {
        header('Content-Type: application/json; charset=utf-8');
        echo $jsonData;
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(["error" => "Invalid JSON data from API"]);
    }
} else {
    header('HTTP/1.1 502 Bad Gateway');
    echo json_encode(["error" => "Failed to fetch data from API"]);
}
?>

