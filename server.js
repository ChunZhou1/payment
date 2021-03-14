const express = require("express");
const app = express();
// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

app.use(express.static("."));
app.use(express.json());

var customerId = "cus_J7FWa77ECE306y"; //for test*/
/*var customerId = "";*/

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  paymentIntentData = {
    amount: calculateOrderAmount(items),
    currency: "usd"
  };

  var paymentMethodsId = "";

  var paymentMethods1;

  if (customerId != "") {
    //get paymentmethod id for client use
    paymentMethods1 = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card"
    });

    paymentMethodsId = paymentMethods1.data[0].id;

    var last4 = paymentMethods1.data[0].card.last4;

    //important ,can be used to pass to front end
    console.log(last4);

    paymentIntentData.customer = customerId;
    paymentIntentData.payment_method = paymentMethodsId;

    //we cannot use it
    /*paymentIntentData.confirm = "true";*/
  } else {
    const customer = await stripe.customers.create();
    paymentIntentData.customer = customer.id;
    console.log(customer.id);
  }

  paymentIntentData.setup_future_usage = "off_session";

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

  res.send({
    clientSecret: paymentIntent.client_secret,
    payMethodsId: paymentMethodsId
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
