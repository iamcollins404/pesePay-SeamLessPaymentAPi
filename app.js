const express = require('express');
const app = express();

// pese pay configurations
const { PesePayClient } = require("pesepay-js");

app.get('/', (req, res) => {
    res.send('Hello World.. Welcome to PesePay API for accepting payments in Zimbabwe!');
});

app.get('/makeapayment', (req, res) => {
    // the variables from any app making api call  --- so from body parser
    // the keys for pese pay
    const ENCRYPTION_KEY = "8f3b61f922fd41db809b0817a51e7751";
    const INTEGRATION_KEY = "44e5dc47-ae77-43c0-99df-6f8616a4ddfb";

    const pesepay = new PesePayClient(INTEGRATION_KEY, ENCRYPTION_KEY);

    // payment related variables
    const amount = 0.01;
    const currencyCode = "USD";
    const reasonForPayment = "SDA Camp Meeting Payment";
    const phoneNumber = "0773468496"

    // declare the payment details
    const paymentDetails = {
        amountDetails: {
            amount: amount,
            currencyCode: "USD",
        },
        merchantReference: Math.floor(Math.random() * 10000).toString(),
        reasonForPayment: reasonForPayment,
        resultUrl: "http://http://139.84.234.229:4701/pesepayResultUrl",
        returnUrl: "http://http://139.84.234.229:4701/pesepayReturnUrl",
        paymentMethodCode: "PZW201",
        customer: {
            phoneNumber: phoneNumber,
        },
        paymentMethodRequiredFields: { customerPhoneNumber: phoneNumber },
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