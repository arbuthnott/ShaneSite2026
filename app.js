/* This is the file to start the express server */

const express = require('express');
const app = express();
const config = require('./config.js');
const port = config.port;

// set up the emailer options
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword
        //clientId: config.gmailClientId,
        //clientSecret: config.gmailClientSecret,
        //refreshToken: config.gmailRefreshToken
    }
});

app.use(express.static('public', {extensions: ['html', 'htm']}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/api/contact', function(req, res) {
    var msg = req.body.message;
    var subj = req.body.subject;
    var email = req.body.email;
    
    if (!msg) {
        console.log('EMPTY MESSAGE detected in contact form post');
        return res.send('empty');
    }
    
    // do our throttling-by-obscurity
    var seenHintSources = req.body.seenHintSources || '';
    var requiredSources = ['message input', 'message blur', 'wait'];
    for (var idx = 0; idx < requiredSources.length; idx++) {
        if (seenHintSources.indexOf(requiredSources[idx]) == -1) {
            console.log('MISSING HINT SOURCE in contact post. Posted hints: ' + seenHintSources);
            return res.send('error');
        }
    }
    
    // still here? We can send. Recall, the passed in email is only being sent as content, not a recipient
    var mailData = {
        from: config.gmailUser,
        to: config.emailRecipient,
        subject: 'WEBSITE CONTACT FORM: ' + (subj || '(no subject)'),
        text: 'EMAIL: ' + email + '\nMESSAGE:\n' + msg
    };
    transporter.sendMail(mailData, function(err, info) {
        if (err) {
            console.log('ERROR DURING MAIL SEND:');
            console.log(err);
            return res.send('error');
        }
        return res.send('sent');
    });
});

app.listen(port, function() {
    console.log('Shane Author Site 2026 listening on port ' + port);
});
