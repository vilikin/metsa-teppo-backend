import express = require("express");
import mongoose = require("mongoose");
import * as bodyParser from "body-parser";
import { Route } from "./routeSchema";

mongoose.connect('mongodb://localhost/teppo');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("mongo connected");
});

let app = express();

app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(bodyParser.json());

app.post("/routes", (req, res) => {
    console.log(req.body);
    let route = new Route({name: req.body.name, length: req.body.length, positions: req.body.positions});
    route.save((err) => {
        if (!err) {
            res.json({
                status: 200,
                message: "Successfully saved route"
            });
        } else {
            res.json({
                status: 500,
                message: "Error saving route"
            });
            console.log(err);
        }
    })
});

app.get("/routes", (req, res) => {
    Route.find((err, result) => {
        if (!err) {
            res.json({
                status: 200,
                routes: result
            })
        } else {
            console.log(err);
            res.json({
                status: 500,
                message: "Error getting routes or no routes found"
            })
        }
    })
});

app.get("/routes/:id", (req, res) => {
    let objectId:string = req.params.id;
    Route.find({"_id":objectId}, (err, result) => {
        if (!err) {
            res.json({
                status: 200,
                route: result
            })
        } else {
            console.log(err);
            res.json({
                status: 500,
                message: "Error getting route or route not found"
            })
        }
    })
});


let port = 80;
app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});