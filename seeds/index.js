const mongoose = require('mongoose');

const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
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


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/931154/700x400',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam id ducimus impedit asperiores, nemo quod et consequuntur? Omnis voluptas, tempora fugit officia aut quia quae animi architecto reiciendis repellat consectetur!',
            price: Math.floor(Math.random() * 1000000)
        })

        await camp.save();
    }
}

seedDb();