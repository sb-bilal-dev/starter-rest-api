const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')
const encryptTime = require('./encryptTime')
const { getUserToken, checkUser } = require('./auth')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  next();
});

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

// Create or Update an item
// app.post('/:model/:macKey', async (req, res) => {
//   console.log(req.body)

//   const model = req.params.model
//   const macKey = req.params.macKey
//   console.log(`from collection: ${model} delete macKey: ${macKey} with params ${JSON.stringify(req.params)}`)
//   const item = await db.collection(model).set(macKey, req.body)
//   console.log(JSON.stringify(item, null, 2))
//   res.json(item).end()
// })

// Protected route using JWT authorization
app.post('/auth', getUserToken)

app.get('/code', checkUser, (req, res) => {
  // Code for handling the protected route
  var unblockerCode = encryptTime();
  req.sendStatus(200).send(unblockerCode).end()
})

// Delete an item
app.delete('/:model/:macKey', async (req, res) => {
  const model = req.params.model
  const macKey = req.params.macKey
  console.log(`from collection: ${model} delete macKey: ${macKey} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(model).delete(macKey)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:model/:macKey', async (req, res) => {
  console.log(req.body)
  const model = req.params.model
  const macKey = req.params.macKey

  const item = await db.collection(model).get(macKey)
  if (item) {
    res.status(202).send(`Mac key (${macKey}) exists`).end()
  } else {
    console.log(`from collection: ${model} delete macKey: ${macKey} with params ${JSON.stringify(req.params)}`)
    await db.collection(model).set(macKey, req.body)
    const items = await db.collection(model).list()
    console.log(items.results.length)
    console.log("macKey: " + macKey, "model: " + model)
    console.log(JSON.stringify(item, null, 2))
    res.status(200).send("").end()
  }
})

// Get a full listing
app.get('/:model', async (req, res) => {
  const model = req.params.model

  console.log(`list collection: ${model} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(model).list()
  console.log(items.results.length)
  res.json({ macCount: items.results.length, items }).end()
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler foundation' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
