const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port
server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`))