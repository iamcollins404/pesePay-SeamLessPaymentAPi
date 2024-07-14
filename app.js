const express = require('express');
const app = express();

// pese pay configurations
const { PesePayClient } = require("pesepay-js");

const bodyParser = require('body-parser'); // Add body-parser

app.get('/', (req, res) => {
    res.send('Hello World.. Welcome to PesePay API for accepting payments in Zimbabwe for our inhouse!');
});


app.use(bodyParser.json());

app.post('/makeapayment', (req, res) => {
    const { ecocashNumber, total, apiKey, encryptionKey } = req.body;

    // the variables from any app making api call  --- so from body parser
    // the keys for pese pay
    const ENCRYPTION_KEY = encryptionKey;
    const INTEGRATION_KEY = apiKey;

    const pesepay = new PesePayClient(INTEGRATION_KEY, ENCRYPTION_KEY);

    // payment related variables
     const reasonForPayment = "SDA Camp Meeting Payment";

    // declare the payment details
    const paymentDetails = {
        amountDetails: {
            amount: total,
            currencyCode: "USD",
        },
        merchantReference: Math.floor(Math.random() * 10000).toString(),
        reasonForPayment: reasonForPayment,
        resultUrl: "http://http://139.84.234.229:4701/pesepayResultUrl",
        returnUrl: "http://http://139.84.234.229:4701/pesepayReturnUrl",
        paymentMethodCode: "PZW201",
        customer: {
            phoneNumber: ecocashNumber,
        },
        paymentMethodRequiredFields: { customerPhoneNumber: ecocashNumber },
    };

    // lets make the seamless payment then ....
    pesepay.makeSeamlessPayment(paymentDetails).then((response) => {
        const pollUrl = response.pollUrl;
        //   save this reference number somewhere
        const referenceNumber = response.referenceNumber;

        // check status
        setTimeout(() => {
            pesepay.checkPaymentStatus(referenceNumber).then((response) => {
                const status = response.transactionStatus.toLowerCase();
                res.json(status);
            });
        }, 10000);

    }).catch((error) => {
        console.log(error);
    });
});

app.listen(8080, () => {
    console.log('PesePay app up and running!');
});
