const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Task } = require("./Schema");
const path = require("path");

require("dotenv").config();
const app = express();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// serve static assets if in production
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// creating the endPoint for the adding the task
app.post("/api/addTask", (req, res,next) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      res.status(422).json({ error: "Please add all the fields" });
    }
    const task = new Task({
      title,
      description,
      status,
    });
    task
      .save()
      .then((result) => {
        res.json({ task: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
// api to get all the data
app.get("/api/getAllTask", (req, res,next) => {
  try {
    Task.find()
      .then((result) => {
        res.json({ task: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// endpoint for getting the single data from the db
app.get("/api/getTask/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    Task.findById(id)
      .then((result) => {
        res.json({ task: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// endpoint for updating the data
app.put("/api/updateTask/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, status } = req.body;
    if (!title || !description) {
      res.status(422).json({ error: "Please add all the fields" });
    }
    Task.findByIdAndUpdate(id, {
      title,
      description,
      status,
    })

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// delete the todo permanently
app.delete("/api/deleteTask/:id", (req, res,next) => {
  try {
    const id = req.params.id;
    Task.findByIdAndRemove(id)
      .then((result) => {
        res.json({ task: result });
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Update the status of the todo
app.put("/api/updateStatus/:id", (req, res,next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    console.log("Received status:", status);
    if (!status) {
      console.log("put something");
    }
    Task.findByIdAndUpdate(id, {
      status,
    })
      .then((result) => {
        res.send("done");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
