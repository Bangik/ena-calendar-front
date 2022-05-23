$(document).ready(function () {
    //connect to db lewat API
    const baseURL = 'http://192.168.100.110/ena-calendar/public/api/events';

    // f ketika klik dari hasil search
    $(document).click(function () {
        var container = $("#searchResult li");
        if (!container.is(event.target) && !container.has(event.target).length) {
            container.hide();
        }
    });

    // f perpindahan button count dan date_until
    $('#btn_count').click(function () {
        $(this).css('background-color', 'white');
        $('#btn_date_until').css('background-color', '#F2F2F2');
    });

    $('#btn_date_until').click(function () {
        $(this).css('background-color', 'white');
        $('#btn_count').css('background-color', '#F2F2F2');
    });

    // f hide/show button count dan date_until
    $('#btn_count').click(function () {
        $('#div_count').show();
        $('#count').show();
        $('#div_date_until').hide();
    });

    $('#btn_date_until').click(function () {
        $('#div_date_until').show();
        $('#date_until').show();
        $('#div_count').hide();
    });

    // Buat date
    const waktu = new Date();

    // Menit dimulai dari 00
    function minutes_with_leading_zeros(waktu2) {
        return (waktu2.getMinutes() < 10 ? '0' : '') + waktu2.getMinutes();
    }

    // Jam dimulai dari 00
    function hours_with_leading_zeros(waktu3) {
        return (waktu3 < 10 ? '0' : '') + waktu3;
    }

    //f auto scroll down
    function windScroll() {
        window.scroll({
            top: 950,
            behavior: 'smooth'
        });
    }

    //f auto scroll up
    function windScrollUp() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    //f ketika pilih event repeat
    function recurringYes(val) {
        if (val === "tidak") {
            $("#hitung_tanggal").hide();
            $("#div_count").hide();
            $("#div_date_until").hide();
            $("#count").hide();
            $("#date_until").hide();
            $('#btn_count').css('background-color', '#F2F2F2');
            $('#btn_date_until').css('background-color', '#F2F2F2');
        } else if (val === "daily" || "weekly" || "monthly" || "yearly") {
            $("#hitung_tanggal").show();
            $('#btn_count').show();
            $('#div_count').show();
            $('#count').show();
            $("#div_date_until").hide();
            $("#date_until").hide();
            $('#btn_count').css('background-color', '#ffffff');
            $('#btn_date_until').css('background-color', '#F2F2F2');
        }
    }

    //f ketika tidak ingin repeat event
    function recurringNo() {
        $('#hitung_tanggal').hide();
        $('#btn_count').val('');
        $('#div_count').hide();
        $('#btn_date_until').val('');
        $('#div_date_until').hide();
    }

    //f validasi form
    function validateForm(category, title, startDate, endDate, repeat, hitung, tanggal) {
        // validasi hitung atau count jika berulang
        if (repeat != 'tidak') {
            if (hitung == 0 || hitung == '' || hitung == null) {
                if (tanggal == '' || tanggal == null || Date.parse(tanggal) == 0) {
                    alert('Sampai berapa kali atau tanggal selesai harus diisi');
                    $('#count').val('');
                    $('#date_until').val('');
                    return false;
                }
                if(Date.parse(startDate) > Date.parse(tanggal)){
                    alert('Tanggal selesai tidak boleh lebih besar dari tanggal mulai');
                    $('#count').val('');
                    $('#date_until').val('');
                    return false;
                }
            } else {
                $('#date_until').val('');
                if (hitung < 1 || hitung >= 99) {
                    alert('Sampai berapa kali harus di rentang 1-99');
                    $('#count').val('');
                    $('#count').focus();
                    return false;
                }
            }
        }

        if (category == '' || category == null) {
            alert('Kategori belum dipilih!');
            return false;
        }
        if (title == '' || title == null || title.length == 0) {
            alert('Judul belum diisi!');
            return false;
        }
        if (startDate == '' || startDate == null || startDate.length == 0) {
            alert('Tanggal mulai belum diisi!');
            return false;
        }
        if (endDate == '' || endDate == null || endDate.length == 0) {
            alert('Tanggal selesai belum diisi!');
            return false;
        }
        if (Date.parse(startDate) > Date.parse(endDate)) {
            alert('Tanggal atau jam selesai tidak boleh lebih besar dari tanggal atau jam mulai');
            return false;
        }
        return true;
    }

    //f u reset form
    function resetForm() {
        $('#form-events')[0].reset();
        $('#count').val('');
        $('#date_until').val('');
    }

    //f u fill form
    function fillForm(
        categoryId,
        title,
        description,
        location,
        start,
        end,
        recurrence = '',
        count = '',
        dateUntil = '',
        idEvent = ''
    ) {
        $('#category_id').val(categoryId);
        $('#title').val(title);
        $('#description').val(description);
        $('#location').val(location);
        $('#start').val(start);
        $('#end').val(end);
        $('#recurrence').val(recurrence);
        $('#count').val(count);
        $("#date_until").val(dateUntil);
        $('#id-event-edit').val(idEvent);
    }

    //f u menampilkan form tambah
    function displayFormTambah(waktu_mulai, waktu_selesai) {
        resetForm();
        $('#label_tambah').html('Tambah Kegiatan'); //label menjadi Tambah Kegiatan
        $('#tambah').show(); //tampilkan form tambah kegiatan
        $('#simpan-ubah').hide(); //tombol simpan "u form ubah" di hide
        $('#simpan-tambah').show(); //tombol simpan "u form tambah" tampilkan

        windScroll();

        $('#start').val(waktu_mulai); //otomatis muncul ketika tambah event
        $('#end').val(waktu_selesai);

        $('#category_id').val('pilih'); //list pilih Kategori agar default 
        $('#category_id-button span').replaceWith('<span>Silahkan Memilih...</span>');

        // ketika tidak berulang, aktifkan f dibawah
        recurringNo()

        //ketika berulang, aktifkan f dibawah
        $("#recurrence").change(function () {
            let val = $(this).val();
            recurringYes(val);
        });

        $('#recurrence').val('tidak');  // list pilih berulang, default tidak
        $('#recurrence-button span').replaceWith('<span>Tidak</span>');
        $('#delete').hide(); //tombol delete ditampilkan di form ubah
    }

    //ketika ingin melakukan pencarian di search bar
    $("#tags2").keyup(function () {
        $('#alert_repeat').hide();
        resetForm();
        let search = $(this).val();
        $.ajax({
            url: `${baseURL}/search`,
            type: 'POST',
            data: { search: search },
            dataType: 'json',
            success: function (response) {
                $('.load').hide();
                $("#searchResult").empty();

                for (let i = 0; i < response.data.length; i++) {
                    let id = response.data[i].id;
                    let title = response.data[i].title;
                    let start = response.data[i].start;
                    let end = response.data[i].end;

                    $("#searchResult").append(`<li style="columns: 2 auto;" id="${id}"> ${title} &emsp; ${calendar.formatDate(start, "HH:mm")} - ${calendar.formatDate(end, "HH:mm")} &emsp; ${calendar.formatDate(start, "dddd, DD MMMM YYYY")} &emsp; </li>`)
                }

                $("#searchResult li").click(function () {
                    let idEvent = $(this).attr("id");
                    $("#searchResult").empty();
                    $("#tags2").val('');

                    // ketika tidak berulang, aktifkan f dibawah
                    recurringNo()

                    //ketika berulang, aktifkan f dibawah
                    $("#recurrence").change(function () {
                        let val = $(this).val();
                        recurringYes(val);
                    });

                    $.ajax({
                        url: `${baseURL}/${idEvent}`,
                        type: "GET",
                        success: function (response) {
                            let repeat_id = response.data.recurring_id;
                            $('#label_tambah').html('Ubah Kegiatan');
                            $('#tambah').show();
                            $('#simpan-tambah').hide();
                            $('#simpan-ubah').show();
                            $('#delete').show();
                            windScroll();
                            $('#category_id-button span').replaceWith('<span>' + response.data.category.name + '</span>');

                            if (repeat_id) {
                                $('#recurrence-button span').replaceWith(`<span>${response.data.recurring.tipe}</span>`);
                                fillForm(
                                    response.data.category.id,
                                    response.data.title,
                                    response.data.description,
                                    response.data.location,
                                    calendar.formatDate(response.data.start, "YYYY-MM-DDTHH:mm"),
                                    calendar.formatDate(response.data.end, "YYYY-MM-DDTHH:mm"),
                                    response.data.recurring.type,
                                    response.data.recurring.count,
                                    response.data.recurring.date,
                                    idEvent
                                );
                            } else {
                                $('#recurrence-button span').replaceWith(`<span>Tidak</span>`);
                                fillForm(
                                    response.data.category.id,
                                    response.data.title,
                                    response.data.description,
                                    response.data.location,
                                    calendar.formatDate(response.data.start, "YYYY-MM-DDTHH:mm"),
                                    calendar.formatDate(response.data.end, "YYYY-MM-DDTHH:mm"),
                                    'tidak',
                                    '',
                                    '',
                                    idEvent
                                );
                            }
                        },
                        error: function (response) {
                            alert('Internal Server Error');
                        }
                    });
                });
            },
            error: function (response) {
                $("#searchResult").empty();
            },
        });
    });

    // Inisiasi Fullcalendar
    let allEvent = 0;
    let calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prevYear prev,next nextYear today',
            center: 'title',
            right: 'dayGridMonth,listMonth,listYear',
        },
        views: {
            listMonth: {
                buttonText: 'list month'
            },
            listYear: {
                buttonText: 'list year'
            },
        },
        locale: 'id',
        navLinks: true,
        events: 'tampil.php',
        editable: true,
        selectable: true,
        nextDayThreshold: '00:00',
        selectMirror: true,
        dayMaxEvents: true,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',

        //ketika ingin membuat event
        select: function (arg) {
            const endStr = new Date(arg.endStr);
            endStr.setDate(endStr.getDate() - 1);
            const date = calendar.formatDate(endStr, "yyyy-MM-DD");
            let tambah_1jam = waktu.getHours() + 1;
            let waktu_mulai = `${arg.startStr}T${hours_with_leading_zeros(waktu.getHours())}:${minutes_with_leading_zeros(waktu)}`;
            let waktu_selesai = `${date}T${hours_with_leading_zeros(tambah_1jam)}:${minutes_with_leading_zeros(waktu)}`;

            displayFormTambah(waktu_mulai, waktu_selesai);
        },

        //ketika suatu event diklik
        eventClick: function (arg) {
            console.log(arg);
            let repeat_id = arg.event.extendedProps.recurring_id;
            if (repeat_id) {
                $('#tambah').hide();
                $('#alert_repeat').show();

                windScroll();

                $('#repeat_ya').click(function () {
                    allEvent = 1;
                    $('#alert_repeat').hide();

                    // ketika tidak berulang, aktifkan f dibawah
                    recurringYes(arg.event.extendedProps.recurring.type);

                    //ketika berulang, aktifkan f dibawah
                    $("#recurrence").change(function () {
                        let val = $(this).val();
                        recurringYes(val);
                    });

                    $('#label_tambah').html('Ubah Kegiatan');
                    $('#tambah').show();

                    $('#simpan-tambah').hide();
                    $('#simpan-ubah').show();
                    $('#delete').show(); //tombol delete ditampilkan di form ubah

                    // auto scroll kebawah ketika event diklik
                    windScroll();

                    // tampilkan isi dari setiap event yang diklik
                    $('#category_id-button span').replaceWith('<span>' + arg.event.extendedProps.category.name + '</span>');
                    $('#recurrence-button span').replaceWith('<span>' + arg.event.extendedProps.recurring.tipe + '</span>');
                    fillForm(
                        arg.event.extendedProps.category_id,
                        arg.event.title,
                        arg.event.extendedProps.description,
                        arg.event.extendedProps.location,
                        calendar.formatDate(arg.event.start, "YYYY-MM-DDTHH:mm"),
                        calendar.formatDate(arg.event.end, "YYYY-MM-DDTHH:mm"),
                        arg.event.extendedProps.recurring.type,
                        arg.event.extendedProps.recurring.count,
                        arg.event.extendedProps.recurring.date,
                        arg.event.id
                    );
                });

                $('#repeat_tidak').click(function () {
                    $('#alert_repeat').hide();
                    allEvent = 0;
                    recurringYes(arg.event.extendedProps.recurring.type);

                    //ketika berulang, aktifkan f dibawah
                    $("#recurrence").change(function () {
                        let val = $(this).val();
                        recurringYes(val);
                    });

                    // f ke ubah kegiatan
                    $('#label_tambah').html('Ubah Kegiatan');
                    $('#tambah').show();
                    // auto scroll kebawah ketika event diklik
                    windScroll();
                    // tampilkan isi dari setiap event yang diklik
                    $('#category_id-button span').replaceWith('<span>' + arg.event.extendedProps.category.name + '</span>');
                    $('#recurrence-button span').replaceWith('<span>' + arg.event.extendedProps.recurring.tipe + '</span>');
                    fillForm(
                        arg.event.extendedProps.category_id,
                        arg.event.title,
                        arg.event.extendedProps.description,
                        arg.event.extendedProps.location,
                        calendar.formatDate(arg.event.start, "YYYY-MM-DDTHH:mm"),
                        calendar.formatDate(arg.event.end, "YYYY-MM-DDTHH:mm"),
                        arg.event.extendedProps.recurring.type,
                        arg.event.extendedProps.recurring.count,
                        arg.event.extendedProps.recurring.date,
                        arg.event.id
                    );
                    $('#simpan-tambah').hide();
                    $('#simpan-ubah').show();
                    $('#delete').show(); //tombol delete ditampilkan di form ubah
                })

            } else {
                allEvent = 0;
                $('#alert_repeat').hide();

                // ketika tidak berulang, aktifkan f dibawah
                recurringNo();
                //ketika berulang, aktifkan f dibawah
                $("#recurrence").change(function () {
                    let val = $(this).val();
                    recurringYes(val);
                });

                // 
                // f ke ubah kegiatan
                $('#label_tambah').html('Ubah Kegiatan');
                $('#tambah').show();
                // auto scroll kebawah ketika event diklik
                windScroll();

                // tampilkan isi dari setiap event yang diklik
                $('#category_id-button span').replaceWith('<span>' + arg.event.extendedProps.category.name + '</span>');
                $('#recurrence-button span').replaceWith('<span>Tidak</span>');
                fillForm(
                    arg.event.extendedProps.category_id,
                    arg.event.title,
                    arg.event.extendedProps.description,
                    arg.event.extendedProps.location,
                    calendar.formatDate(arg.event.start, "YYYY-MM-DDTHH:mm"),
                    calendar.formatDate(arg.event.end, "YYYY-MM-DDTHH:mm"),
                    'tidak',
                    '',
                    '',
                    arg.event.id
                )

                $('#simpan-tambah').hide();
                $('#simpan-ubah').show();
                $('#delete').show(); //tombol delete ditampilkan di form ubah
            }
        },

        // f untuk mengubah tampilan nama setiap event
        eventContent: function (arg) {
            let start2 = $('#start').val(calendar.formatDate(arg.event.start,
                "YYYY-MM-DDTHH:mm"));

            var event = arg.event;
            var customHtml = '';

            customHtml += '&nbsp' + `<i class= "${arg.event.extendedProps.category.icon}" style='overflow: hidden; word-wrap: break-word; font-size:13px; color:${arg.event.extendedProps.category.color};'</i>` +
                " " + calendar.formatDate(arg.event.start, "HH:mm") + '&nbsp' + '|' + '&nbsp' + event.title;

            return {
                html: customHtml,
            }
        },

        //ketika ingin drag kalendar
        eventDrop: function (arg) {
            let kategori = arg.event.extendedProps.category_id;
            let title = arg.event.title;
            let deskripsi = arg.event.extendedProps.description
            let lokasi = arg.event.extendedProps.location
            let start = calendar.formatDate(arg.event.start, "YYYY-MM-DDTHH:mm")
            let end = calendar.formatDate(arg.event.end, "YYYY-MM-DDTHH:mm")

            $.ajax({
                url: `${baseURL}/${arg.event.id}`,
                type: "PUT",
                data: {
                    category_id: kategori,
                    title: title,
                    description: deskripsi,
                    location: lokasi,
                    start: start,
                    end: end,
                    allEvent: 0,
                },
                success: function (response) {
                    calendar.refetchEvents(); //refresh kalendar
                    console.log("sukses");
                },
                error: function (response) {
                    console.log("gagal drag");
                },
            })
        },

        //menampilkan deskripsi melalui tooltip
        eventDidMount: function (arg) {
            var tooltip = new Tooltip(arg.el, {
                title: arg.event.extendedProps.description,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        },

    })
    calendar.render();  // load calendar

    //ketika button simpan diklik, lakukan hal dibawah
    $('#simpan-tambah').click(function () {
        let kategori = $('#category_id').val();
        let title = $('#title').val();
        let deskripsi = $('#description').val();
        let lokasi = $('#location').val();
        let start = $('#start').val();
        let end = $('#end').val();
        let repeat = $('#recurrence').val();
        let hitung = $('#count').val();
        let tanggal = $('#date_until').val();

        if (validateForm(kategori, title, start, end, repeat, hitung, tanggal)) {
            $.ajax({
                url: baseURL,
                type: "POST",
                data: {
                    category_id: kategori,
                    title: title,
                    description: deskripsi,
                    location: lokasi,
                    start: start,
                    end: end,
                    recurrence: repeat,
                    count: hitung,
                    date_until: tanggal,
                },
                beforeSend: function () {
                    $('.load').show();
                },
                success: function (response) {
                    calendar.refetchEvents();
                    resetForm();
                    $('.load').hide();
                    windScrollUp();
                    $('#tambah').hide();
                    alert('Data Berhasil Ditambahkan')
                },
                error: function (response) {
                    $('.load').hide();
                    alert('Internal Server Error');
                },
            });
        }
    })

    //ketika tombol simpan di form ubah diklik
    $('#simpan-ubah').click(function () {
        let kategori = $('#category_id').val();
        let title = $('#title').val();
        let deskripsi = $('#description').val();
        let lokasi = $('#location').val();
        let start = calendar.formatDate($('#start').val(), "YYYY-MM-DD HH:mm:ss");
        let end = calendar.formatDate($('#end').val(), "YYYY-MM-DD HH:mm:ss");
        let repeat = $('#recurrence').val();
        let hitung = $('#count').val();
        let tanggal = $('#date_until').val();
        let id = $('#id-event-edit').val();

        if (validateForm(kategori, title, start, end, repeat, hitung, tanggal)) {
            $.ajax({
                url: `${baseURL}/${id}`,
                type: "PUT",
                data: {
                    category_id: kategori,
                    title: title,
                    description: deskripsi,
                    location: lokasi,
                    start: start,
                    end: end,
                    recurrence: repeat,
                    count: hitung,
                    date_until: tanggal,
                    allEvent: allEvent,
                },
                beforeSend: function () {
                    $('.load').show();
                },
                success: function (response) {
                    calendar.refetchEvents();
                    resetForm();
                    $('.load').hide();
                    windScrollUp();
                    $('#tambah').hide();
                    alert('Data Berhasil Diubah');
                },
                error: function (response) {
                    $('.load').hide();
                    alert('Internal Server Error');
                },
            });
        }
    });

    $('#batal').click(function () {
        resetForm();
        windScrollUp();
        $('#tambah').hide();
    });

    $('#delete').click(function () {
        let id = $('#id-event-edit').val();
        if (id) {
            $.ajax({
                url: `${baseURL}/${id}`,
                type: "DELETE",
                data: {
                    allEvent: allEvent
                },
                beforeSend: function () {
                    $('.load').show();
                },
                success: function (response) {
                    $('.load').hide();
                    windScrollUp();
                    $('#tambah').hide();
                    alert('Data Berhasil Dihapus!');

                    if (allEvent === 1) {
                        for (let i = 0; i < response.data.length; i++) {
                            calendar.getEventById(response.data[i].id).remove();
                        }
                    } else {
                        calendar.getEventById(response.data).remove();
                    }

                },
                error: function (response) {
                    $('.load').hide();
                    alert('Internal Server Error');
                },
            });
        }
    });
});