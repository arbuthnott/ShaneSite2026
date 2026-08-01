Library.humanHints = 0;
Library.addHumanHint = function(source) {
    if (!Library.seenHintSources) { Library.seenHintSources = []; }
    if (Library.seenHintSources.indexOf(source) != -1) { return; }
    Library.humanHints++;
    Library.seenHintSources.push(source);
}
setTimeout(function() { Library.addHumanHint('wait'); }, 700);

Library.validateContact = function(formData) {
    console.log('validateContact!!');
    var feedBackElem = $('#contact-form-feedback');
    var foundError = !formData.message || !formData.email || Library.humanHints < 3;
    if (!foundError) {
        foundError = /^[^@]+@[^@]+\.[a-zA-Z]+$/i.test(formData.email);
    }
    if (foundError) {
        var message = '<h6>Message not sent</h6> ';
        message += 'Something doesn\'t seem right. Please make sure you add message content and a proper email address before sending.';
        feedBackElem.html(message).css('opacity', 1);
        return false;
    }
    feedBackElem.html('').css('opacity', 0);
    return true;
};

Library.sendContact = function() {
    console.log('sendContact!!');
    var form = $('form#contact-form');
    var formData = {
        message: form.find('#message').val().trim(),
        subject: form.find('#subject').val().trim(),
        email: form.find('#email').val().trim()
    };
    if (!Library.validateContact(formData)) { return; }
    console.log('input is valid. NOw post...');
    
    form.append('<input type="hidden" name="hintSources" value="' + Library.seenHintSources.join(',') + '"/>');
};

$(function() {
    var form = $('form#contact-form');
    
    form.find('#message').on('input', function() { Library.addHumanHint('message input'); });
    form.find('#message').on('blur',function() { Library.addHumanHint('message blur'); });
    form.find('button#send-contact').click(function() { Library.sendContact(); });
});
