const User = require("../models/User");
const Ride = require("../models/Ride");

const bookride = (req, res) => {
    let { name, email, password, role, phone } = req.body;
    let newUser = new User({
        name: name,
        email: email,
        password: password,
        role: role,
        phone: phone,
        // profilePicture: profilePicture==undefined?null:profilePicture,
        // vehicleDetails: vehicleDetails==undefined?null:vehicleDetails,
        totalTrips: 0,
        created_at: new Date(),
    });

    newUser.save().then((res) => {
        console.log(res);
        res.redirect("/");
    }).catch((err) => {
        console.log(err)
    }) 
    res.send("Email Already Exist \n You can Log In: http://localhost:8080/login")
}
