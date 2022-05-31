<?php
    //get data lewat API
    $urlApi = "http://192.168.100.113/ena-calendar/public/api/categories";
    $data = file_get_contents($urlApi);
    $data = json_decode($data);
    $categories = $data->data;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalender Event</title>

    <!-- Font Icon Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- JQuery 3.6.0 -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    
    <!--Framework JQuery Mobile 1.4.5-->
    <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>

    <!-- Jquery 1.3.1 -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.12.4.js"></script>
    <script src="//code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <!-- MomentJs 2.27.0 -->
    <script src='https://cdn.jsdelivr.net/npm/moment@2.27.0/min/moment.min.js'></script>

    <!-- Rrule lib -->
    <script src='https://cdn.jsdelivr.net/npm/rrule@2.6.4/dist/es5/rrule.min.js'></script>

    <!-- kode untuk fullcalendar -->
    <link href='../lib/main.css' rel='stylesheet' />
    <script src='../lib/main.js'></script>
    <script src='../lib/locales/id.js'></script>
    
    <!-- Popper dan Tooltip -->
    <script src='https://unpkg.com/popper.js/dist/umd/popper.min.js'></script>
    <script src='https://unpkg.com/tooltip.js/dist/umd/tooltip.min.js'></script>

    <!-- the rrule-to-fullcalendar connector. must go AFTER the rrule lib -->
    <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/rrule@5.5.0/main.global.min.js'></script>

    <!--Menampilkan tanggal dan waktu di javascript-->
    <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/moment@5.5.0/main.global.min.js'></script>
    
    <link rel="stylesheet" href="./style/style.css">
</head>
<body>
    <div class="load">
        <img id="loading-image" src="img/loading3.gif"/>
    </div>
    <div class="container">
        <!-- Fitur Search -->
        <div class="search-bar">    
            <form onsubmit="event.preventDefault();">
                <input id="tags2" type="search" placeholder="Cari Kegiatan..." >
            </form>
            <ul id="searchResult"></ul>
        </div>

        <!-- Load Calendar -->
        <div id="calendar">
        
        </div>
        
        <!-- FORM TAMBAH DATA -->
        <div data-role="collapsible" data-collapsed="false" id="tambah" style="display:none;">
            <h3> 
                <i class="fa-solid fa-album-circle-user"></i> 
                <span id="label_tambah">Tambah Kegiatan</span>
            </h3>

            <form autocomplete="off" id="form-events">
                <input type="hidden" id="id-event-edit">
                <div class="ui-field-contain">
                    <label for="category_id" class="kategori">Kategori Kegiatan</label>
                    <select name="kategori" id="category_id" data-native-menu="true" required>
                        <option selected disabled value="pilih"><span>Silahkan Memilih</span></option>
                        <?php
                        foreach($categories as $key => $category){
                        ?>
                        <optgroup label="<?= $key ?>">
                            <?php
                            foreach($category as $value){
                            ?>
                            <option value="<?= $value->id ?>"><?= $value->name ?></option>
                            <?php
                            }
                            ?>
                        </optgroup>
                        <?php
                        }
                        ?>
                    </select>
                </div>

                <div class="ui-field-contain">
                    <label for="title">Judul Kegiatan</label>
                    <input type="text" name="title" id="title" placeholder="" required>
                </div>

                <div class="ui-field-contain">
                    <label for="description">Deskripsi</label>
                    <textarea name="description" id="description"></textarea>
                </div>

                <div class="ui-field-contain">
                    <label for="location">Lokasi</label>
                    <input type="text" name="location" id="location" placeholder="" required>
                </div>

                <div class="ui-field-contain">
                    <label for="start">Tanggal dan Jam Mulai</label>
                    <input type="datetime-local" data-clear-btn="false" name="start" id="start" required>
                </div>

                <div class="ui-field-contain">
                    <label for="end">Tanggal dan Jam Selesai</label>
                    <input type="datetime-local" data-clear-btn="false" name="end" id="end" required>
                </div>

                <div class="ui-field-contain">
                    <form>
                        <label for="recurrence">Berulang?</label>

                        <select name="recurrence" id="recurrence" class="recurrence">
                            <option disabled value="pilih" id="pilih">Silahkan Memilih...</option>
                            <option selected value="tidak" id="tidak">Tidak</option>
                            <option value="daily" id="daily">Harian</option>
                            <option value="weekly" id="weekly">Mingguan</option>
                            <option value="monthly" id="monthly">Bulanan</option>
                            <option value="yearly" id="yearly">Tahunan</option>
                        </select>
                    </form>
                </div>

                <div class="ui-field-contain" id="hitung_tanggal" style="display:none">
                    <label for="recurrence"></label>
                    <button class="ui-btn ui-btn-inline ui-corner-all" id="btn_count"
                        onclick="document.getElementById('date_until').value = ''">Sampai Berapa Kali?</button>
                    <button class="ui-btn ui-btn-inline ui-corner-all" id="btn_date_until"
                        onclick="document.getElementById('count').value = ''">Sampai Tanggal Berapa?</button>
                </div>

                <div class="ui-field-contain" id="div_count" style="display:none">
                    <label for="count"></label>
                    <input type="number" data-clear-btn="false" name="count" id="count" value="" min="0" max="99"
                        style="display:none">
                </div>

                <div class="ui-field-contain" id="div_date_until" style="display:none">
                    <label for="date_until"></label>
                    <input type="date" data-clear-btn="true" name="date_until" id="date_until" value=""
                        style="display:none">
                </div>

                <div class="form-action-buttons">
                    <button class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-check" type="button"
                        id="simpan-tambah" value="Submit" style="display:none;">Simpan</button>
                    <button class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-check" type="button"
                        id="simpan-ubah" value="Submit" style="display:none;">Simpan</button>
                    <button class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-forbidden" type="button"
                        id="batal">Batal</button>
                    <button class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-delete" type="button"
                        id="delete" style="display:none;">Hapus</button>
                </div>
            </form>
        </div>
        
        <!-- ALERT REPEAT EVENT ONCE/ ALL -->
        <div data-role="collapsible" data-collapsed="false" id="alert_repeat" style="display:none">
            <h3> 
                <i class="fa-solid fa-album-circle-user"></i> 
                <span id="label_alert">
                    <center>Apakah Anda hanya ingin mengubah jadwal untuk semua event?</center>
                </span>
            </h3>
            <div class="form-action-buttons">
                <button class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-check" type="button"
                    id="repeat_ya" value="Submit">Ya, Semua Event</button>
                <button class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete" type="button"
                    id="repeat_tidak" value="Submit">Hanya Event ini</button>
            </div>
        </div>
    </div>

    <script src="./js/index.js"></script>
</body>
</html>