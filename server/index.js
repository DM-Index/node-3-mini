require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mc = require(`./controllers/messages_controller`);
const createInitialSession = require(`${__dirname}/middlewares/session.js`);
const filter = require(`${__dirname}/middlewares/filter.js`);

const app = express();
// TOP LEVEL MIDDLEWARE GETS HIT WITH EVERY REQUEST
// REQUEST LEVEL MIDDLEWARE IS CALLED AS A SPECIFIC METHOD
app.use(sessions());
app.use(bodyParser.json());
// takes in the location of our front end build folder
// SPA. Use for production
app.use(express.static(`${__dirname}/../build`));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
    cookie: { maxAge: 100000 }
  })
);

app.use((req, res, next) => filter(req, res, next));

app.use((req, res, next) => createInitialSession(req, res, next));

// ENDPOINTS
app.post("/api/messages", mc.create);
app.get("/api/messages", mc.read);
app.put("/api/messages", mc.update);
app.delete("/api/messages", mc.delete);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
