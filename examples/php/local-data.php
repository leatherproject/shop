<?php
// Указываем путь к JSON-файлу
$file = 'data/data.json';

// Проверяем, существует ли файл
if (file_exists($file)) {
    // Получаем содержимое файла
    $jsonData = file_get_contents($file);

    // Устанавливаем заголовок Content-Type как JSON
    header('Content-Type: application/json');

    // Отправляем данные в формате JSON
    echo $jsonData;
} else {
    // Если файл не найден, выводим ошибку
    header('HTTP/1.1 404 Not Found');
    echo json_encode(["error" => "File not found"]);
}
?>

