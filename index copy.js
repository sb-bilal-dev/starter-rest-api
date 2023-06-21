const express = require('express')
const app = express()
const dynamoDB = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################
app.get("/", async (req, res) => {
  const { model, mac_address } = req.query;

  if (model && mac_address) {
    const collection = dynamoDB.collection("new_automobiles");

    try {
      // Check if the mac_address already exists for the model
      const existingData = await collection.get(`${model}_${mac_address}`);
      if (existingData) {
        console.log("Duplicate mac received: ", mac_address);
        res.status(202).send(`Mac Address: ${mac_address} for model: ${model} already exists.`);
      } else {
        // Store the mac_address in the database
        await collection.set(`${model}_${mac_address}`, { model, mac_address });

        // Get the updated count of mac addresses for the model
        const items = await collection.scan().exec();
        const quantity = items.filter((item) => item.model === model).length;

        // Send a response indicating successful storage
        const responseBody = `Successfully stored mac_address "${mac_address}", #${quantity} for model "${model}".\n`;
        res.status(200).send(responseBody);
        console.log(responseBody);
      }
    } catch (err) {
      console.error("Failed to store the mac_address:", err);
      res.status(500).send("Failed to store the mac_address.\n");
    }
  } else {
    // Send an error response for invalid requests
    res.status(400).send("Invalid request.\n");
  }
});

app.get("/count", async (req, res) => {
  const { model } = req.query;

  if (model) {
    const collection = dynamoDB.collection("automobiles");

    try {
      // Count the number of mac_addresses for the model
      const items = await collection.scan().exec();
      const quantity = items.filter((item) => item.model === model).length;
      res.status(200).send(quantity.toString());
    } catch (err) {
      console.error("Failed to retrieve the count:", err);
      res.status(500).send("Failed to retrieve the count.\n");
    }
  } else {
    res.status(400).send("Provide model.\n");
  }
});


app.get("/delete_all", async (_, res) => {
  const collection = dynamoDB.collection("automobiles");

  try {
    // Delete all items from the collection
    await collection.clear();
    res.status(200).send("SUCCESS, all data cleared");
  } catch (err) {
    console.error("Failed to clear data:", err);
    res.status(500).send("Failed to clear data.\n");
  }
});

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handlerrree' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
