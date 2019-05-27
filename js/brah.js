var brah = brah || {
    isEdge: function() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    forms: {
        subscribe: function () {
            var email = $(this).parent().find('input[type=email]').val();
            if ($under.validEmail(email)) {
                $.ajax('https://sunder-functions20190319082035.azurewebsites.net/api/BrahSubscribe?code=aZXodW9PLSECOChgSpl1jYvZ3zRhTddxgRAmWML/wz0lsdqS1EScBw==', {
                    method: 'POST',
                    contentType: 'json',
                    crossDomain: true,
                    data: JSON.stringify({
                        'email': email
                    }),
                    success: function (data) {
                        alert('Thanks for subscribing!  Check your inbox for a confirmation email.');
                    },
                    error: function (xhr, status, error) {
                        alert('Subscribing failed.  To subscribe manually, go to: http://eepurl.com/gdXTYH');
                    }     
                });
            } else {
                alert('Invalid Email Address');
            }
        },

        contact: function () {
            var name = $('#Contact #Name').val(),
                email = $('#Contact #Email').val(),
                subject = $('#Contact #Subject').val(),
                message = $('#Contact #Message').val();
            $under.contact.send(name, email, subject, message);
        },

        events: function () {
            $('.subscribe .input-group button').on('click', brah.forms.subscribe);
            $('#Contact .form-group button').on('click', brah.forms.contact);
        },

        init: function () {
            brah.forms.events();
        }
    },

    events: function () {
        
    },

    init: function () {
        $under.history.title = 'Brahctopus';
        $under.progress.color = '#2859d7';
        $under.background.lastSrc = 'https://imgur.com/2BDaHLT';
        $under.background.lastPos = 'calc(50% + 30px) 50%';
        $under.background.init();
        $under.contact.sendToEmail = 'brahctopus@gmail.com';
        $under.contact.sendToName = 'Brahctopus Ink';
        brah.events();
        brah.forms.init();
    }
};

$(brah.init);