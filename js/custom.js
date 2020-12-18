(function($) {

    "use strict";

    // Config
    //-------------------------------------------------------------------------------
    var companyName = 'Spa and Wellness Center';
    var address = '3861 Sepulveda Blvd., Culver City, CA 90230'; // Enter your Address


    // Parallax Scrolling
    //-------------------------------------------------------------
    var $w = $(window);
    var newsletterSimple = $('.newsletter-simple');
    var productInfo = $('.product-info');

    function move($c) {
        var offset = $c.offset().top;
        var scroll = $w.scrollTop();
        var diff = offset - scroll;
        var pos = 'center ' + (-diff)*0.2 + 'px';
        $c.css({'backgroundPosition':pos});
    }
    $w.bind('scroll', function(e){
        move(newsletterSimple);
        move(productInfo);
    });


    // Preloader
    //-------------------------------------------------------------------------------
    window.onscroll = function () {
        window.scrollTo(0, 0);
    };

    $(window).load(function () {
        setTimeout(function () {
            window.onscroll = function () {};
            $('#page-preloader').addClass('slideOutUp');

            // Fix for IE 9
            setTimeout(function () {
                $('#page-preloader').addClass('hidden');
            }, 700);

        }, 100);

    });


    // Initialize Tooltip
    //-------------------------------------------------------------
    $('.my-tooltip').tooltip();


    // Initialize Datetimepicker
    //-------------------------------------------------------------------------------
    $('.datepicker').datepicker().on('changeDate', function () {
        $(this).datepicker('hide');
    });


    // Show Appointment Modal
    //-------------------------------------------------------------------------------
    $('.show-appointment-modal').on('click', function () {
        var service = $(this).data('service');
        if (service) {
            $("#appointment-service").val(service);
        }
        $('#appointmentModal').modal('show');
        return false;
    });


    // Scroll To Animation
    //-------------------------------------------------------------------------------
    $('body').scrollspy({target: '#navigation-top-1', offset: 88});

    var scrollTo = $(".scroll-to");

    scrollTo.click(function (event) {
        $('.modal').modal('hide');
        var position = $(document).scrollTop();
        var scrollOffset = 87;

        var marker = $(this).attr('href');
        $('html, body').animate({scrollTop: $(marker).offset().top - scrollOffset}, 'slow');
        return false;
    });


    // Scroll Up Btn
    //-------------------------------------------------------------------------------
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scroll-up-btn').removeClass("animated fadeOutRight");
            $('.scroll-up-btn').fadeIn().addClass("animated fadeInRight");
        } else {
            $('.scroll-up-btn').removeClass("animated fadeInRight");
            $('.scroll-up-btn').fadeOut().addClass("animated fadeOutRight");
        }
    });



    // Navigation Top
    //-------------------------------------------------------------
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 300) {
            $('.navbar-hidden').fadeIn();
        } else {
            $('.navbar-hidden').fadeOut();
        }
    });


    // Gallery
    //-------------------------------------------------------------
    $(".gallery .gallery-thumbnail-container").on("click", function () {

        var src = $(this).find("img").data('img');
        var galleryImg = $('<img/>').attr('src', src).addClass('img-responsive');

        var galleryImgWidth;
        galleryImg.load(function () {
            galleryImgWidth = this.width;
        });

        var imgTitle = $(this).find('.gallery-img-title').html();
        var imgSubtitle = $(this).find('.gallery-img-subtitle').html();


        $('#galleryModal').modal();
        $('#galleryModal').on('shown.bs.modal', function () {
            $('#galleryModal .modal-dialog').css('max-width', galleryImgWidth);
            $('#galleryModal .modal-body').html(galleryImg);
            $('#galleryModal .modal-nav .title').html(imgTitle + ' - ' + imgSubtitle);
        });
        $('#galleryModal').on('hidden.bs.modal', function () {
            $('#galleryModal .modal-body').html('');
        });
    });


    /* fix vertical when not overflow
     call fullscreenFix() if .fullscreen content changes */
    function fullscreenFix() {
        var h = $('body').height();
        // set .fullscreen height
        $(".content-b").each(function (i) {
            if ($(this).innerHeight() <= h) {
                $(this).closest(".fullscreen").addClass("not-overflow");
            }
        });
    }

    $(window).resize(fullscreenFix);
    fullscreenFix();


    /* resize background images */
    function backgroundResize() {
        var windowH = $(window).height();
        $(".header-full-screen-img").each(function (i) {
            var path = $(this);
            // variables
            var contW = path.width();
            var contH = path.height();
            var imgW = path.attr("data-img-width");
            var imgH = path.attr("data-img-height");
            var ratio = imgW / imgH;
            // overflowing difference
            var diff = parseFloat(path.attr("data-diff"));
            diff = diff ? diff : 0;
            // remaining height to have fullscreen image only on parallax
            var remainingH = 0;
            if (path.hasClass("parallax")) {
                var maxH = contH > windowH ? contH : windowH;
                remainingH = windowH - contH;
            }
            // set img values depending on cont
            imgH = contH + remainingH + diff;
            imgW = imgH * ratio;
            // fix when too large
            if (contW > imgW) {
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.data("resized-imgW", imgW);
            path.data("resized-imgH", imgH);
            path.css("background-size", imgW + "px " + imgH + "px");
        });
    }

    $(window).resize(backgroundResize);
    $(window).focus(backgroundResize);
    backgroundResize();


    // Contact Form
    //-------------------------------------------------------------

    $("#contact-form-gmap").submit(function () {
 $('#contact-form-gmap-msg').text(' Ваше сообщение успешно отправлено! ');

        $('#contact-form-gmap .btn-submit').attr('disabled', 'disabled');

        $.ajax({
            type: "POST",
            url: "php/index.php",
            data: $("#contact-form-gmap").serialize(),
            dataType: "json",
            success: function (data) {

                if ('success' == data.result) {
                    $('#contact-form-gmap-msg').css('visibility', 'visible').hide().fadeIn().removeClass('hidden').addClass('alert-success');
                    $('#contact-form-gmap-msg').html(data.msg[0]);
                    $('#contact-form-gmap .btn-submit').removeAttr('disabled');
                    $('#contact-form-gmap')[0].reset();
                }

                if ('error' == data.result) {
                    $('#contact-form-gmap-msg').css('visibility', 'visible').hide().fadeIn().removeClass('hidden').addClass('alert-danger');
                    $('#contact-form-gmap-msg').html(data.msg[0]);
                    $('#contact-form-gmap .btn-submit').removeAttr('disabled');
                }

            }
        });

        return false;
    });


    // Appointment Form
    //-------------------------------------------------------------

    $("#appointment-form").submit(function () {

        $('#appointment-form-msg').addClass('hidden');
        $('#appointment-form-msg').removeClass('alert-success');
        $('#appointment-form-msg').removeClass('alert-danger');

        $('#appointment-form .btn-submit').attr('disabled', 'disabled');

        $.ajax({
            type: "POST",
            url: "php/index.php",
            data: $("#appointment-form").serialize(),
            dataType: "json",
            success: function (data) {

                if ('success' == data.result) {
                    $('#appointment-form-msg').css('visibility', 'visible').hide().fadeIn().removeClass('hidden').addClass('alert-success');
                    $('#appointment-form-msg').html(data.msg[0]);
                    $('#appointment-form .btn-submit').removeAttr('disabled');
                    $('#appointment-form')[0].reset();
                }

                if ('error' == data.result) {
                    $('#appointment-form-msg').css('visibility', 'visible').hide().fadeIn().removeClass('hidden').addClass('alert-danger');
                    $('#appointment-form-msg').html(data.msg[0]);
                    $('#appointment-form .btn-submit').removeAttr('disabled');
                }

            }
        });

        return false;
    });


    // Newsletter Form
    //-------------------------------------------------------------------------------

    $( "#newsletter-form" ).submit(function() {

        $('#newsletter-form-msg').addClass('hidden');
        $('#newsletter-form-msg').removeClass('alert-success');
        $('#newsletter-form-msg').removeClass('alert-danger');

        $('#newsletter-form input[type=submit]').attr('disabled', 'disabled');

        $.ajax({
            type: "POST",
            url: "php/index.php",
            data: $("#newsletter-form").serialize(),
            dataType: "json",
            success: function(data) {

                if('success' == data.result)
                {
                    $('#newsletter-form-msg').css('visibility','visible').hide().fadeIn().removeClass('hidden').addClass('alert-success');
                    $('#newsletter-form-msg').html(data.msg[0]);
                    $('#newsletter-form input[type=submit]').removeAttr('disabled');
                    $('#newsletter-form')[0].reset();
                }

                if('error' == data.result)
                {
                    $('#newsletter-form-msg').css('visibility','visible').hide().fadeIn().removeClass('hidden').addClass('alert-danger');
                    $('#newsletter-form-msg').html(data.msg);
                    $('#newsletter-form input[type=submit]').removeAttr('disabled');
                }

            }
        });

        return false;
    });



    // Load Contact Gmap
    //-------------------------------------------------------------

    var geocoder;
    var map;
    var draggable = true;

    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        zoom: 12,
        draggable: draggable,
        mapTypeControl: false,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById('contact-map'), mapOptions);

    var contentString = '<div id="content">' +
        '<strong>'+companyName+'</strong><br>' +
        'Address: 3861 Sepulveda Blvd., Culver City, CA 90230 ' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: 'img/mapmarker.png',
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });


// end document ready
})(jQuery);