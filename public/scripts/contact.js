Library.humanHints = 0;
Library.addHumanHint = function(source) {
    if (!Library.seenHintSources) { Library.seenHintSources = []; }
    if (Library.seenHintSources.indexOf(source) != -1) { return; }
    Library.humanHints++;
    Library.seenHintSources.push(source);
}
setTimeout(function() { Library.addHumanHint('wait'); }, 700);

Library.validateContact = function(formData) {
    var feedBackElem = $('#contact-form-feedback');
    var foundError = !formData.message || !formData.email || Library.humanHints < 3;
    if (!foundError) {
        foundError = !/^[^@]+@[^@]+\.[a-zA-Z]+$/i.test(formData.email);
    }
    if (foundError) {
        var message = '<h6>Message not sent...</h6> ';
        message += 'Something doesn\'t seem right. Please make sure you add message content and a proper email address before sending.';
        feedBackElem.html(message).css('opacity', 1);
        return false;
    }
    feedBackElem.html('').css('opacity', 0);
    return true;
};

Library.sendContact = function() {
    if (Library.disableSend) { return; }
    var form = $('form#contact-form');
    var formData = {
        message: form.find('#message').val().trim(),
        subject: form.find('#subject').val().trim(),
        email: form.find('#email').val().trim()
    };
    if (!Library.validateContact(formData)) { return; }
    formData.seenHintSources = Library.seenHintSources.join(',');
    Library.disableSend = true;
    $.post('/api/contact', formData, function(data) {
        var feedBackElem = $('#contact-form-feedback');
        var form = $('form#contact-form');
        var button = form.find('button#send-contact');
        
        if (data == 'sent') {
            var message = '<h6>Message sent</h6> ';
            message += 'Thank you for your message! I will read it soon and respond if appropriate. ';
            message += '<br /><a id="send-another" onclick="Library.resetContactForm()" class="darkYellowLink">send another message</a>'
            button.attr('disabled', 'disabled');
            form.find('input, textarea').attr('disabled', 'disabled');
            feedBackElem.html(message).css('opacity', 1);
        } else if (data == 'empty') {
            var message = '<h6>Message not sent...</h6> ';
            message += 'Something doesn\'t seem right. Please make sure you add message content and a proper email address before sending.';
            feedBackElem.html(message).css('opacity', 1);
            Library.disableSend = false; // allow retry
        } else if (data == 'error') {
            var message = '<h6>Error sending message</h6> ';
            message += 'Sorry, there was an unknown error. Please refresh the page and retry.';
            button.attr('disabled', 'disabled');
            form.find('input, textarea').attr('disabled', 'disabled');
            feedBackElem.html(message).css('opacity', 1);
        } else { // ??
            console.log('unexpected response from contact form api:');
            console.log(data);
            // let's be optimistic
            var message = '<h6>Message sent</h6> ';
            message += 'Thank you for your message! I will read it soon and respond if appropriate. ';
            message += '<br /><a id="send-another"  onclick="Library.resetContactForm()" class="darkYellowLink">send another message</a>'
            button.attr('disabled', 'disabled');
            form.find('input, textarea').attr('disabled', 'disabled');
            feedBackElem.html(message).css('opacity', 1);
        }
    });
};

Library.resetContactForm = function() {
    var form = $('form#contact-form');
    form.find('input, textarea, button').removeAttr('disabled');
    Library.disableSend = false;
    form.find('#subject, #message').val('');
    var feedBackElem = $('#contact-form-feedback');
    feedBackElem.css('opacity', 0);
    setTimeout(function() { feedBackElem.html(''); }, 1000);
};

$(function() {
    var form = $('form#contact-form');
    
    form.find('#message').on('input', function() { Library.addHumanHint('message input'); });
    form.find('#message').on('blur', function() { Library.addHumanHint('message blur'); });
    form.find('button#send-contact').click(function() { Library.sendContact(); });
    //form.find('#contact-form-feedback').on('click', '#send-another', function() { Library.resetContactForm(); });
});
