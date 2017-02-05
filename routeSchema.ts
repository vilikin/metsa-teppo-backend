import mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    name: {type:String, required: true},
    length: {type: Number, required: true},
    positions: {type: Array, required: true}
});

export let Route = mongoose.model('Route', routeSchema);