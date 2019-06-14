const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get all events
router.get('/', async (_req, res) => {
  const events = await loadEventsCollection();
  res.send(await events.find({}).toArray());
});

// Get all events that end after today-2.days and start before today+4.days
router.get('/current', async (_req, res) => {
  const events = await loadEventsCollection();
  res.send(await events.find({
    start: {
      $lte: addDays(new Date(), 4)
    },
    end: {
      $gte: subDays(new Date(), 2)
    }
  }).toArray());
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

// Update event
router.patch('/:id', async (req, res) => {
  const events = await loadEventsCollection();
  await events.updateOne({
    _id: new mongodb.ObjectID(req.params.id)
  },{
    type: req.body.type,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
  });
  res.status(201).send();
});

// Delete event
router.delete('/:id', async (req, res) => {
  const events = await loadEventsCollection();
  await events.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
});

// Get base events
router.get('/base', async (_req, res) => {
  const baseEvents = await loadBaseEventsCollection();
  res.send(await baseEvents.find({}).toArray());
});

// Add base event
router.post('/base', async (req, res) => {
  repeatValue = req.body.repeat || '0';
  parsedRepeat = parseInt(repeatValue);
  createBaseEvent({
    type: req.body.type,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    repeat: parsedRepeat,
  });
  createEventsFromBaseEvent(await baseEvents.findOne({type: req.body.type}));
  res.status(201).send();
});

// Update base event
router.patch('/base/:id', async (req, res) => {
  const baseEvents = await loadBaseEventsCollection();
  await baseEvents.updateOne({
    _id: new mongodb.ObjectID(req.params.id)
  }, {
    $set: {
      type: req.body.type,
      start: new Date(req.body.start),
      end: new Date(req.body.end),
      repeat: parseInt(req.body.repeat),
    }
  });
  createEventsFromBaseEvent(await baseEvents.findOne({type: req.body.type}));
  res.status(201).send();
});

// Delete base event
router.delete('/base/:id', async (req, res) => {
  const baseEvents = await loadBaseEventsCollection();
  await baseEvents.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
});

// Helper to create an event
async function createEvent(item) {
  const events = await loadEventsCollection();
  await events.insertOne(item);
}

// Helper to create many events with only one database call
async function createEvents(items) {
  const events = await loadEventsCollection();
  await events.insertMany(items);
}

// Helper to create a base event
async function createBaseEvent(item) {
  const baseEvents = await loadBaseEventsCollection();
  await baseEvents.insertOne(item);
}

// Helper to generate repating events based on a base event
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

// Helper to add X days to date
// Allows us to be sure repeated events are correctly spaced
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper to subtract X days from date
function subDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

// Load the events collection
async function loadEventsCollection() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://m001-student:m001-mongodb-basics@sandbox-s8g7n.mongodb.net/destiny-reset?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
    return client.db('destiny-reset').collection('events');
}

// Load the base events collection
async function loadBaseEventsCollection() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://m001-student:m001-mongodb-basics@sandbox-s8g7n.mongodb.net/destiny-reset?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
    return client.db('destiny-reset').collection('baseEvents');
}

module.exports = router;
