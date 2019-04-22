// implement your API here
const express = require("express");
const db = require("./data/db");
const server = express();

server.use(express.json());
server.get("/", (req, res) => {
  res.send("its alive");
});

server.post("/api/users", (req, res) => {
  const userInformation = req.body;
  console.log("request body:", userInformation);

  db.insert(userInformation)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(400).json({
        error: err,
        message: "Please provide name and bio for the user."
      });
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.json({ error: err, message: "somethings broken" });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(id => {
      res.json(id);
    })
    .catch(err => {
      res.status(404).json({
        error: err,
        message: "The user with the specified ID does not exist."
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err, message: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (res, req) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  db.update(id, { name, bio })
    .then(response => {
      db.findById(id)
        .then(user => {
          if (user.length === 0) {
            sendUserError(404, "User with that id not found", res);
            return;
          }
          res.json(user);
        })
        .catch(err => {
          res.status(500).json({
            error: err,
            message: "The user with the specified ID does not exist."
          });
        });
    })

    .catch(err => {
      res
        .status(500)
        .json({ error: err, message: "The user could not be removed" });
      return;
    });
});

server.listen(5000, () => {
  console.log("\n Api ruuning on port 5k");
});
