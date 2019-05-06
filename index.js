// import express from 'express' ES2015 import modules
const express = require("express"); // commonJS import modules, this is how we typically write our server imports this will work on all versions of node with no extra config xz

// import our DB helper functions/methods
const db = require("./data/db.js");

const server = express(); //activate express server in a variable;
server.use(express.json()); // this teaches express how to read json objects

// ENDPOINTS - these tell express what the user can query to get a particular set of data
server.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// set an endpoint to get the Date and pass it back as a string
server.get("/now", (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
});

// GET ALL HUBS ENDPOINT
server.get("/hubs", (req, res) => {
  db.hubs
    .find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
  // .catch((response) => {
  //   const message = response.message
  //   const code = response.code
  // })
  // destructured variables from the response object
});

// GET INDIVIDUAL HUB - get a particular hub by id
server.get("/hubs/:id", (req, res) => {
  db.hubs
    .findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json({ success: true, hub });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Cannot find hub by that id" });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// POST - Add an object ot the db in our server
server.post("/hubs", (req, res) => {
  // One method from getting info from our use in in the req.body
  // we will be getting info from the client side for our post
  // axios.post(url, object)
  const hubInfo = req.body; // need the use json parsing in our server to read it (server.use(express.json()))
  console.log("request body name", hubInfo);

  db.hubs
    .add(hubInfo)
    .then(hub => {
      // hub was successfully added
      res.status(201).json({ success: true, hub });
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// DELETE - remove a hub from the db
server.delete("/hubs/:id", (req, res) => {
  // another way to get data from our user is in the req.params  (the url parameters)
  const id = req.params.id;

  db.hubs
    .remove(id)
    .then(deleted => {
      // the data layer returns the deleted record, but we wont use it, instead using the response headers status code and .end() to terminate the request
      res.status(204).end();
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// PUT - require an id from the params and some data from the user on the body that they want to change
server.put("/hubs/:id", (req, res) => {
  // destructuring id from req.params
  const { id } = req.params;
  const changes = req.body;

  db.hubs
    .update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Cannot find hub to update" });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

// setting up environment variables that will be utilized in the prod env.
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  // our server is now listening on the set port and our console will reflect that
  console.log(`\n*** Server listening on port ${PORT} ***\n`);
});
