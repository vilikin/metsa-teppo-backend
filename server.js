"use strict";
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var routeSchema_1 = require("./routeSchema");
mongoose.connect('mongodb://localhost/teppo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log("mongo connected");
});
var app = express();
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    }
    else {
        next();
    }
});
app.use(bodyParser.json());
app.post("/routes", function (req, res) {
    console.log(req.body);
    var route = new routeSchema_1.Route({ name: req.body.name, length: req.body.length, positions: req.body.positions });
    route.save(function (err) {
        if (!err) {
            res.json({
                status: 200,
                message: "Successfully saved route"
            });
        }
        else {
            res.json({
                status: 500,
                message: "Error saving route"
            });
            console.log(err);
        }
    });
});
app.get("/routes", function (req, res) {
    routeSchema_1.Route.find(function (err, result) {
        if (!err) {
            res.json({
                status: 200,
                routes: result
            });
        }
        else {
            console.log(err);
            res.json({
                status: 500,
                message: "Error getting routes or no routes found"
            });
        }
    });
});
app.get("/routes/:id", function (req, res) {
    var objectId = req.params.id;
    routeSchema_1.Route.find({ "_id": objectId }, function (err, result) {
        if (!err) {
            res.json({
                status: 200,
                route: result
            });
        }
        else {
            console.log(err);
            res.json({
                status: 500,
                message: "Error getting route or route not found"
            });
        }
    });
});
var port = 80;
app.listen(port, function () {
    console.log("Server is listening to port: " + port);
});
