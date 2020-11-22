const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
require('./seeds/index')
const { find } = require('./models/campground');
const Campground = require('./models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected")
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})




app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})
app.post('/campgrounds', async (req, res) => {
    const campgrounds = new Campground(req.body.campground);
    campgrounds.image = 'https://source.unsplash.com/collection/931154/700x400'
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    res.render('campgrounds/show', { campgrounds })
})


app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    res.render('campgrounds/edit', { campgrounds })
})

app.put('/campgrounds/:id', async (req, res) => {
    const campgrounds = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campgrounds._id}`);

})

app.delete('/campgrounds/:id', async (req, res) => {
    const campgrounds = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})
app.listen(3000, () => {
    console.log('Listening on Port 3000')
})