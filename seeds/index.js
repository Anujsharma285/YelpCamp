const mongoose=require('mongoose');
const cities= require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
//check for error in connection
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

//function to return a random element from an array 
const sample = (array)=> array[Math.floor(Math.random()*array.length)];

const seedDB= async()=>{
    await Campground.deleteMany({});
    //making random entries for database 
    for(let i=0;i<50;i++){
        const random1000= Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
       const camp= new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,

            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate fugit esse minus sequi optio. Quibusdam nulla incidunt a et iure eum enim! Id veritatis eligendi fugiat officiis, quos facere placeat!',
            price
        })
        await camp.save();
    }
}
//closing connection after making db entries randomly
seedDB().then(()=>{
    mongoose.connection.close();
})
