const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({

    riderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },

    pickupLocation: { 
        type: String, 
        required: true 
    },

    dropoffLocation: { 
        type: String, 
        required: true 
    },

    distance: { 
        type: Number, 
        required: true 
    }, 

    status: {
        type: String,
        enum: ["REQUESTED","ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
        default: "REQUESTED"
    },

    fare: { 
        type: Number 
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },

    created_at: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model("Ride", RideSchema);
