const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        required: true 
    },
     
    role: { 
        type: String, 
        enum: ["RIDER", "DRIVER", "ADMIN"], 
        required: true 
    },

    phone: { 
        type: String, 
        required: true 
    },

    profilePicture: 
    { 
        type: String 
    },

    // vehicleDetails: {
    //     type: {
    //         model: String,
    //         licensePlate: String,
    //         capacity: Number,
    //     },
    //     required: function () { return this.role === "DRIVER"; }
    // },
 
    totalTrips: {
        type: Number, 
        default: 0 
    },

    created_at: { 
        type: Date, 
        default: Date.now 
    },

});

module.exports = mongoose.model("User", UserSchema);
