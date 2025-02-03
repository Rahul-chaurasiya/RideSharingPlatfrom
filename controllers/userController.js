const User = require("../models/User");

const Default = (req, res) => {
    res.send(
        "What Do You Want to Do? Log In OR Sign Up \n " +
        "For Log In : http://localhost:8080/login \n " +
        "For Log Out : http://localhost:8080/logout \n"+
        "For Dashboard : http://localhost:8080/dashboard \n"+
        "For Sign Up : http://localhost:8080/signup \n" +
        "For Get All Users(Admin Only) : http://localhost:8080/users \n"+
        "For Update profile(Logged In Only) : http://localhost:8080/edit \n"+
        "For Pending rides : http://localhost:8080/requestedrides \n"+
        "For Accept any ride : http://localhost:8080/requestedrides/{id} \n"
    );
    console.log("I have successfully imported the app and port");
}

const getUsers = async (req, res) => { 
    if (req.session.user.role == 'ADMIN') {
        console.log();
        let users = await User.find();
        res.send({ message: "data", users: users })
        console.log(users);
    } else {
        console.log("You are not an admin")
        res.send("Only Admin has access to this page... \n First LogIn as ADMIN: http://localhost:8080/login")
    }
} 

const signup = (req, res) => {
    let { name, email, password, role, phone, profilePicture} = req.body;
    profilePicture = profilePicture === undefined || profilePicture === null ? null : profilePicture;
    let newUser = new User({
        name: name,
        email: email,
        password: password,
        role: role,
        phone: phone,
        profilePicture: profilePicture,
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
    res.send("Now You can Log In: http://localhost:8080/login")
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).send("Invalid email or password!");
        }

        req.session.user = user;
        res.send("Login successful!" + user);
    } catch (error) {
        res.status(500).send("Error during login!");
        console.log(error)
    }
} 

const update = async (req, res) => {
    let { name, password, role, phone } = req.body;
    console.log(req.session.user.name);
    let updatedUser = await User.findOneAndUpdate(
      { email: req.session.user.email },
      { name, password, role, phone },
      { runValidators: true, new: true }
    );
  
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
  
    console.log("Updated ToDo: ", updatedUser);
    res.status(200).json(updatedUser);
  }
 

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error during logout!");
    } 
    res.send("Logged out successfully!");
  });
}
module.exports = { Default, getUsers, signup, login, update, logout}