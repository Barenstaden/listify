const express = require('express')
const app = express()
const port = 3000
const axios = require('axios').default
const apiKey = 'AIzaSyDEqtn9NoLD-Jc6lVZIx00rA3pDOu81lN0'
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/nearest-store', async (req, res) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.latitude},${req.query.longitude}&keyword=grocery&rankby=distance&key=${apiKey}`,
  )
  res.send(response.data.results[0])
})

app.get('/distance-to-nearest-store', async (req, res) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.query.userLatitude},${req.query.userLongitude}&destinations=${req.query.storeLatitude},${req.query.storeLongitude}&key=${apiKey}`,
  )
  res.send(response.data.rows[0].elements[0].distance)
})
