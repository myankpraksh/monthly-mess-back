const express = require('express');
const cors = require('cors');
const knex = require('knex');
const app = express();

const db = knex({
    client : 'pg',
    connection : {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'monthly_mess'
    }
});


app.use(cors());
app.use(express.json());

app.get('/mess/:pin', (req, res) => {
const {pin} = req.params;
db.select('*').from('mess').where('pincode', '=', pin)
.then(mess => {
    if (mess.length) {
        res.json(mess)
      } else {
        res.json('Mess not found')
      }
})
.catch(err => res.status(400).json('error getting mess'))

})

app.listen(3000, ()=>{
    console.log("App started successfully on port 3000")
})

