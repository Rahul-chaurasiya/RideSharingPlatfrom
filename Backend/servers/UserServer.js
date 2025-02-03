const {app,port} = require("../index")
app.use(express.json());

app.get("/", (req, res) => {
    res.send(
        "What Do You Want to Do? Log In OR Sign Up \n For Log In : http://localhost:8080/login \n For Sign Up : http://localhost:8080/signup"
    );
    console.log("I have successfully imported the app and port");
});
