const express = require('express');
const restaurantModel = require('../models/Restaurant');
const app = express();

//Read ALL
//http://localhost:3000/restaurants
app.get('/restaurants', async (req, res) => {
  const restaurants = await restaurantModel.find({});
  //Sorting
  //use "asc", "desc", "ascending", "descending", 1, or -1
  //const restaurants = await restaurantModel.find({}).sort({'firstname': -1});
  
  //Select Specific Column
  //const restaurants = await restaurantModel.find({}).select("firstname lastname salary").sort({'salary' : 'desc'});  
  
  try {
    console.log(restaurants[0].name)
    res.status(200).send(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});



//Search By cuisine - PATH Parameter
//http://localhost:3000/restaurants/cuisine/Japanese
//http://localhost:3000/restaurants/cuisine/Bakery
//http://localhost:3000/restaurants/cuisine/Italian
app.get('/restaurants/cuisine/:cui', async (req, res) => {
  const cui = req.params.cui
  const restaurants = await restaurantModel.find({cuisine : cui});

  //Using Static method
  //const restaurants = await restaurantModel.getrestaurantByCuisine(cui)
  
  //Using Query Helper
  //const restaurants = await restaurantModel.findOne().byCuisine(cui)
  
  try {
    if(restaurants.length != 0){
      res.send(restaurants);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});



//http://localhost:3000/restaurants?sortBy=ASC
//http://localhost:3000/restaurants?sortBy=DESC

  //Sorting
  //use "asc", "desc", "ascending", "descending", 1, or -1
  //const restaurants = await restaurantModel.find({}).sort({'firstname': -1});
  
  //Select Specific Column
  //const restaurants = await restaurantModel.find({}).select("firstname lastname salary").sort({'salary' : 'desc'});  
  
app.get('/restaurants', async (req, res) => {

  const arr = req.query.sortBy;
//.select('cuisine name city restaurant_id -address')
  try {
    const restaurants = restaurantModel.
                        find({},{cuisine:1, name:1, city:1, restaurant_id:1, address:0})
                        .sort({'restaurant_id' : arr})
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});  


/*
app.get('/restaurants?sortBy=DESC', async (req, res) => {
  try {
    const restaurants = restaurantModel.
                        find({})
                        .sort({'restaurant_id' : 'desc'})
                        .select('cuisine name city restaurant_id -address')
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});
*/

//http://localhost:3000/restaurants/Delicatessen
/*
return restaurants details where all cuisines are equal to Delicatessen and the city is not equal to Brooklyn
-	The selected columns must include cuisines, name and city, but exclude id
-	The sorting order must be Ascending Order on the name

// include a and b, exclude other fields  
query.select('a b');

// exclude c and d, include other fields  
query.select('-c -d');

https://mongoosejs.com/docs/api.html#query_Query-select

The {_id:0} operator is used to remove the document ID for a simpler output.
e.g.
db.vehicleinformation.find({},{_id:0})
*/

app.get('/restaurants/Delicatessen', async (req, res) => {
  try {
    const restaurants = restaurantModel.
                        find({})
                        .where('cuisine').equals('Delicatessen')
                        .where('city').nin(['Brooklyn'])
                        .sort('name')
                        .select('cuisine name city -_id')
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});
module.exports = app

/*
//Insert Records
//RestaurantsDB.Restaurants.insertMany
restaurantModel.create(
  [{
    "address": {
      "building": "1008",
      "street": "Morris Park Ave",
      "zipcode": "10462"
   },
   "city": "Bronx",
   "cuisine": "Bakery",
   "name": "Morris Park Bake Shop",
   "restaurant_id": "30075445"
  },
  {
    "address": {
      "street": "Thai Son Street",
      "zipcode": null
   },
   "city": "Manhattan",
   "cuisine": "Vietnamese",
   "name": "Pho Me Long Time",
   "restaurant_id": "30075455"
  },
  {
    "address": {
      "building": "253",
      "street": "East 167 Street",
      "zipcode": null
   },
   "city": "Bronx",
   "cuisine": "Chicken",
   "name": "Mom's Fried Chicken",
   "restaurant_id": "40382900"
  },
  {
    "address": {
      "building": "120",
      "street": "East 56 Street",
      "zipcode": "19800"
   },
   "city": "Mahattan",
   "cuisine": "Italian",
   "name": "Montebello Restaurant",
   "restaurant_id": "40397082"
  },
  {
    "address": {
      "building": "195",
      "street": "Soprano Street",
      "zipcode": "17500"
   },
   "city": "Staten Island",
   "cuisine": "Hamburgers",
   "name": "Joeys Burgers",
   "restaurant_id": "40397555"
  },
  {
    "address": {
      "building": "200",
      "street": "Queens Boulevard",
      "zipcode": "19700"
   },
   "city": "Queens",
   "cuisine": "American",
   "name": "Brunos on the Boulevard",
   "restaurant_id": "40397678"
  },
  {
    "address": {
      "building": "555",
      "street": "Sushi Street",
      "zipcode": "17700"
   },
   "city": "Brooklyn",
   "cuisine": "Japanese",
   "name": "Iron Chef House",
   "restaurant_id": "40397699"
  },
  {
    "address": {
      "building": "555",
      "street": "Fontana Street",
      "zipcode": null
   },
   "city": "Brooklyn",
   "cuisine": "Japanese",
   "name": "Wasabi Sushi",
   "restaurant_id": "40398000"
  },
  {
    "address": {
      "building": "900",
      "street": "Goodfellas Street",
      "zipcode": "17788"
   },
   "city": "Brooklyn",
   "cuisine": "Delicatessen",
   "name": "Sal's Deli",
   "restaurant_id": "40898000"
  },
  {
    "address": {
      "building": "909",
      "street": "44 Gangster Way",
      "zipcode": "17988"
   },
   "city": "Queens",
   "cuisine": "Delicatessen",
   "name": "Big Tony's Sandwich Buffet",
   "restaurant_id": "40898554"
  },
  {
    "address": {
      "building": "1201",
      "street": "121 Canolli Way",
      "zipcode": "17989"
   },
   "city": "Queens",
   "cuisine": "Delicatessen",
   "name": "The Godfather Panini Express",
   "restaurant_id": "40898554"
  }]
  )

  */


/*
//Search By First Name OR Last Name
//http://localhost:3000/restaurants/search?firstname=pritesh&lastname=patel
app.get('/restaurants/search', async (req, res) => {
  //console.log(req.query)
  if(Object.keys(req.query).length != 2){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const fname = req.query.firstname
    const lname = req.query.lastname
    //{ $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
    //const restaurants = await restaurantModel.find({ $and: [{firstname : fname}, {lastname : lname}]});
    const restaurants = await restaurantModel.find({ $or: [{firstname : fname}, {lastname : lname}]});
    ///Use below query for AND condition
    //const restaurants = await restaurantModel.find({firstname : fname, lastname : lname});

    try {
      if(restaurants.length != 0){
        res.send(restaurants);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});
//Search By salary > 1000
//http://localhost:3000/restaurants/salary?value=1000
app.get('/restaurants/salary', async (req, res) => {
  //console.log(req.query)
  if(Object.keys(req.query).length != 1){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const salary = req.query.value
  
    //const restaurants = await restaurantModel.find({salary : {$gte : salary}});
    const restaurants = await restaurantModel.find({}).where("salary").gte(salary);
    // <= 10000
    //const restaurants = await restaurantModel.find({salary : {$lte : salary }});
    
    try {
      if(restaurants.length != 0){
        res.send(restaurants);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});
//Read By ID
//http://localhost:3000/restaurant?id=60174acfcde1ab2e78a3a9b0
app.get('/restaurant', async (req, res) => {
  //const restaurants = await restaurantModel.find({_id: req.query.id});
  //const restaurants = await restaurantModel.findById(req.query.id);
  const restaurants = await restaurantModel.find({_id: req.query.id}).select("firstname lastname salary");

  try {
    res.send(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Some more test queries
//http://localhost:3000/restaurants/test
app.get('/restaurants/test', async (req, res) => {
  try {
    const restaurants = restaurantModel.
                        find({})
                        .where('lastname').equals('patel')
                        .where('salary').gte(1000.00).lte(10000.00)
                        .where('firstname').in(['pritesh', 'moksh'])
                        .limit(10)
                        .sort('-salary')
                        .select('firstname lastname salary')
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});
//Create New Record
/*
    //Sample Input as JSON
    //application/json as Body
    {
      "firstname":"Pritesh",
      "lastname":"Patel",
      "email":"p@p.com",
      "gender":"Male",
      "city":"Toronto",
      "designation":"Senior Software Engineer",
      "salary": 10000.50
    }

//http://localhost:3000/restaurant
app.post('/restaurant', async (req, res) => {
  
    console.log(req.body)
    const restaurant = new restaurantModel(req.body);
    
    try {
      await restaurant.save((err) => {
        if(err){
          //Custome error handling
          //console.log(err.errors['firstname'].message)
          //console.log(err.errors['lastname'].message)
          //console.log(err.errors['gender'].message)
          //console.log(err.errors['salary'].message)
          res.send(err)
        }else{
          res.send(restaurant);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });
//Update Record
//http://localhost:3000/restaurant/60174acfcde1ab2e78a3a9b0
app.patch('/restaurant/:id', async (req, res) => {
  try {
    console.log(req.body)
    const restaurant =  await restaurantModel.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
    //const restaurant =  await restaurantModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
})
//Delete Record by ID
//http://localhost:3000/restaurant/5d1f6c3e4b0b88fb1d257237
app.delete('/restaurant/:id', async (req, res) => {
    try {
      const restaurant = await restaurantModel.findByIdAndDelete(req.params.id)

      if (!restaurant) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })
//Delete Record using findOneAndDelete()
//http://localhost:3000/restaurant/delete?emailid=5d1f6c3e4b0b88fb1d257237
app.get('/restaurant/delete', async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOneAndDelete({email: req.query.emailid})

    if (!restaurant) 
    {
      res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
    }else{
      //restaurant.remove() //Update for Mongoose v5.5.3 - remove() is now deprecated
      res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
    }
  } catch (err) {
    res.status(500).send(err)
  }
})
//Insert new Records
restaurantModel.create(
  [{
    "address": {
      "building": "718",
      "street": "Wislon Avenue",
      "zipcode": "11001"
   },
   "city": "Chicago",
   "cuisine": "Indian",
   "name": "Rajesh Dishes"
  }]
)
*/



