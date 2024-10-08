const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const Campground=require('./models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

//check for error for connection
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//home route
app.get('/',(req,res)=>{
    res.render('home')
})

//find all campgrounds route (index.ejs)
app.get('/campgrounds', async (req,res)=>{
   const campgrounds= await Campground.find({});
   res.render('campgrounds/index',{campgrounds});
})

//new camps (new.ejs) (must be above show route) 
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
//where form is submitted to 
app.post('/campgrounds',async (req,res)=>{
    const campground=new Campground(req.body.campground); //new camp
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

//show individual camp route (show.ejs)
app.get('/campgrounds/:id',async (req,res)=>{
    const campground=await  Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
})

//update/edit an individual camp route  (edit.ejs)
app.get('/campgrounds/:id/edit',async (req,res)=>{
    const campground=await  Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});

})
//putting the updated values (... is spread operator)
app.put('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    const campground=await  Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

//delete camp route
app.delete('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})





app.listen(3000,()=>{
    console.log('Serving on port 3000')
})