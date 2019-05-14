const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Pusher = require("pusher");
const Vote = require("../model/vote");

var pusher = new Pusher({
  appId: "780648",
  key: "02aa8af22271ca295d51",
  secret: "47bd5f41d46b7f3511f0",
  cluster: "ap2",
  encrypted: true
});

router.get("/", (req, res) => {
  Vote.find().then(votes => res.json({ sucess: true, votes: votes }));
});

router.post("/", (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger("os-poll", "os-vote", {
      points: parseInt(vote.points),
      os: vote.os
    });

    return res.json({ success: true, message: "Thank you for voting" });
  });
});

module.exports = router;
