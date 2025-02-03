const User = require("../models/User");
const Ride = require("../models/Ride");
const axios = require('axios');



// Haversine formula to calculate distance
const EARTH_RADIUS = 6371;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c;
}

// Helper to get coordinates from Nominatim API
async function getCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;

    try {
        const response = await axios.get(url);
        if (response.data.length === 0) {
            throw new Error(`Could not find coordinates for: ${place}`);
        }
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
        throw new Error(`Error fetching coordinates for "${place}": ${error.message}`);
    }
}


const ride = async (req, res) => {
    let riderId = req.session.user._id;
    console.log(riderId);
    if (!riderId) {
        return res.status(400).json({ error: "Rider not authenticated" });
    }

    let { pickupLocation, dropoffLocation } = req.body;

    if (!pickupLocation || !dropoffLocation) {
        return res.status(400).json({ error: "Both pickup and dropoff locations are required." });
    }

    try {
        // Get coordinates for the locations
        const location1 = await getCoordinates(pickupLocation);
        const location2 = await getCoordinates(dropoffLocation);

        // Calculate distance
        const distance = calculateDistance(location1.lat, location1.lon, location2.lat, location2.lon);
        let fare = 0;

        if (distance <= 15) {
            fare = distance * 10;
        } else if (distance > 15 && distance <= 50) {
            fare = (15 * 10) + ((distance - 15) * 5);
        } else {
            fare = (15 * 10) + (35 * 5) + ((distance - 50) * 3);
        }

        // Save ride in the database
        const newRide = new Ride({
            riderId,
            driverId: null,
            pickupLocation,
            dropoffLocation,
            distance,
            status: "REQUESTED",
            fare,
            paymentStatus: "PENDING"
        });

        newRide.save().then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err)
        })

        res.json({
            message: "Ride booked successfully!",
            fare: fare,
            distance: `${distance.toFixed(2)} km`,
            rideDetails: newRide
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const requestedrides = async (req, res) => {
    if (req.session.user.role == 'ADMIN' || req.session.user.role == 'DRIVER') {
        let rides = await Ride.find();
        res.send({ message: "data", ride: rides })
        console.log(rides);
    } else {
        console.log("You are not an admin")
        res.send("Only Admin has access to this page... \n First LogIn as ADMIN: http://localhost:8080/login")
    }
}

const acceptride = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id);

        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        if (ride.status !== 'REQUESTED') {
            return res.status(400).json({ error: 'Ride cannot be accepted. Current status: ' + ride.status });
        }

        ride.status = 'ACCEPTED';
        await ride.save();

        res.json({ message: 'Ride status updated to ACCEPTED', ride });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { ride, requestedrides, acceptride } 