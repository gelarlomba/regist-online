const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase')

const app = express();

//DB
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBrpALnGOyqb4XYJjQMg_szCKrwQRhKfGI",
    authDomain: "regist-online.firebaseapp.com",
    databaseURL: "https://regist-online.firebaseio.com",
    projectId: "regist-online",
    storageBucket: "",
    messagingSenderId: "471625215301",
    appId: "1:471625215301:web:ea54845c620bdb21"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database()
//end of DB

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//end of BodyParser Middleware

//Set Static Path
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
//end of Static Path

//View Engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//end of View Engine

//Page
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/regist', (req, res) => {
    res.render('regist')
})

app.get('/anggota', (req, res) => {
    var ref = db.ref('peserta');
    ref.once('value', (snapshot) => {
        var data = snapshot.val()
        res.render('anggota', {
            data: data
        })
    })
})

app.get('/detail/:id', (req, res) => {
    console.log(req.params.id);
    var ref = db.ref('/peserta/' + req.params.id)
    ref.once('value', (snapshot) => {
        var data = snapshot.val()
        console.log(data);

        res.render('detail', {
            data: data
        })
    })
})
//end of page

//function
app.post('/add', (req, res) => {
    var data = {
        namaLengkap: req.body.namaLengkap,
        noHp: req.body.noHp,
        tmpLahir: req.body.tmpLahir,
        tglLahir: req.body.tglLahir,
        smp: req.body.smp,
        namaAyah: req.body.namaAyah,
        namaIbu: req.body.namaIbu,
        alamat: req.body.alamat,
        organisasi: req.body.organisasi,
        citacita: req.body.citacita,
        motivasi: req.body.motivasi
    }
    console.log(data);

    var updates = {};
    updates['/peserta/' + req.body.namaLengkap] = data;
    db.ref().update(updates);

    res.redirect('/')
})
//end of function

app.get('*', (req, res) => {
    res.send('page ga ada')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Started on Port 3000...');
})