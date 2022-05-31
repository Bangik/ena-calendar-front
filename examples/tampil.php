<?php
//panggil koneksi ke db

$start = $_GET['start'];
$end = $_GET['end'];

$data = file_get_contents("http://192.168.100.113/ena-calendar/public/api/events?start=$start&end=$end");
$data = json_decode($data);
$tes = $data->data;
echo json_encode($tes); //untuk menampilkan data