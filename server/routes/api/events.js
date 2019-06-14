const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get events
router.get('/', async (req, res) => {
  const events = await loadEventsCollection();
  res.send(await events.find({}).toArray());
});

// Get base events
router.get('/base', async (req, res) => {
  const baseEvents = await loadBaseEventsCollection();
  res.send(await baseEvents.find({}).toArray());
});

// Add event
router.post('/', async (req, res) => {
  createEvent({
    type: req.body.type,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
  });
  res.status(201).send();
});

// Update base event
router.patch('/', async (req, res) => {
  const baseEvents = await loadBaseEventsCollection();
  await baseEvents.updateOne({
    type: req.body.type
  }, {
    $set: {
      start: new Date(req.body.start),
      end: new Date(req.body.end),
      repeat: parseInt(req.body.repeat),
    }
  });
  createEventsFromBaseEvent(await baseEvents.findOne({type: req.body.type}));
  res.status(201).send();
});

async function createEvent(item) {
  const events = await loadEventsCollection();
  await events.insertOne(item);
}

async function createEvents(items) {
  const events = await loadEventsCollection();
  await events.insertMany(items);
}

async function createEventsFromBaseEvent(baseEvent) {
  const events = await loadEventsCollection();
  await events.deleteMany({type: baseEvent.type});
  date = new Date(baseEvent.start);
  eventsToAdd = [];
  while (date < new Date('2021-06-13T17:00:00.000+00:00') && baseEvent.repeat >= 1) {
    eventsToAdd = [...eventsToAdd, {
        type: baseEvent.type,
        start: date,
        end: addDays(date, baseEvent.repeat),
    }];
    date = addDays(date, baseEvent.repeat);
  }
  createEvents(eventsToAdd)
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function loadEventsCollection() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://m001-student:m001-mongodb-basics@sandbox-s8g7n.mongodb.net/destiny-reset?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
    return client.db('destiny-reset').collection('events');
}

async function loadBaseEventsCollection() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://m001-student:m001-mongodb-basics@sandbox-s8g7n.mongodb.net/destiny-reset?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
    return client.db('destiny-reset').collection('baseEvents');
}

module.exports = router;
