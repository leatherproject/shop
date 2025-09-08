<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $phone = $_POST['phone'] ?? '';
    $cart = $_POST['cart'] ?? '';
    //$secret = $_POST['secret'] ?? '';

    $postData = http_build_query([
        'phone' => $phone,
        'cart' => $cart,
        //'secret' => $secret,
        'secret' => 'kru56Zdf09m3Jkh4hHOJDjkhoer65249erGd34X' // секрет только здесь
    ]);

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'content' => $postData,
            'timeout' => 10
        ]
    ];

    $context  = stream_context_create($options);
    $result = @file_get_contents(
        'https://script.google.com/macros/s/AKfycbxPpwX3il5Lkd11n6G-3etGrS2jUEwllCuUKqLfhDyUUE0CoTYmiZMPdmqJA4rwiH0Qrw/exec',
        false,
        $context
    );

    if ($result === false) {
        http_response_code(502);
        echo 'ERROR';
    } elseif (trim($result) === 'OK') {
        echo 'OK';
    } else {
        http_response_code(500);
        echo 'FAIL';
    }
}

