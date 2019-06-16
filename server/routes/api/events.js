const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get all events
router.get('/', async (_req, res) => {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  res.send(await events.find({}).toArray());
  await closeMongoClient(client);
});

// Get all events that have this week between their start and end
// this means that the start of this week must be before the their end
// and the end of this week must be after their start
router.get('/current', async (_req, res) => {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  res.send(await events.find({
    start: {
      $lte: addHours(addDays(today, 4), 13)
    },
    end: {
      $gte: addHours(subDays(today, 2), 13)
    }
  }).toArray());
  await closeMongoClient(client);
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
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  await events.updateOne({
    _id: new mongodb.ObjectID(req.params.id)
  },{
    type: req.body.type,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
  });
  res.status(201).send();
  await closeMongoClient(client);
});

// Delete event
router.delete('/:id', async (req, res) => {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  await events.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
  await closeMongoClient(client);
});

// Get base events
router.get('/base', async (_req, res) => {
  const client = await getMongoClient();
  const baseEvents = await loadBaseEventsCollection(client);
  res.send(await baseEvents.find({}).toArray());
  await closeMongoClient(client);
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

// Add base events
router.post('/base/many', async (req, res) => {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  await events.deleteMany({});
  const baseEvents = await loadBaseEventsCollection(client);
  await baseEvents.deleteMany({});
  baseEventsToAdd = []
  for (index in req.body.items) {
    const event = req.body.items[index];
    baseEventsToAdd = [...baseEventsToAdd, {
      type: event.type,
      start: new Date(event.start),
      end: new Date(event.end),
      repeat: event.repeat,
    }];
  }
  createBaseEvents(baseEventsToAdd);
  baseEventsToAdd.forEach( baseEvent => {
    createEventsFromBaseEvent(baseEvent)
  });
  res.status(201).send();
  await closeMongoClient(client);
});

// Update base event
router.patch('/base/:id', async (req, res) => {
  const client = await getMongoClient();
  const baseEvents = await loadBaseEventsCollection(client);
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
  await closeMongoClient(client);
});

// Delete base event
router.delete('/base/:id', async (req, res) => {
  const client = await getMongoClient();
  const baseEvents = await loadBaseEventsCollection(client);
  await baseEvents.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
  await closeMongoClient(client);
});

// Helper to create an event
async function createEvent(item) {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  await events.insertOne(item);
  await closeMongoClient(client);
}

// Helper to create many events with only one database call
async function createEvents(items) {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
  await events.insertMany(items);
  await closeMongoClient(client);
}

// Helper to create a base event
async function createBaseEvent(item) {
  const client = await getMongoClient();
  const baseEvents = await loadBaseEventsCollection(client);
  await baseEvents.insertOne(item);
  await closeMongoClient(client);
}

// Helper to create many base events with only one database call
async function createBaseEvents(items) {
  const client = await getMongoClient();
  const baseEvents = await loadBaseEventsCollection(client);
  await baseEvents.insertMany(items);
  await closeMongoClient(client);
}

// Helper to generate repating events based on a base event
async function createEventsFromBaseEvent(baseEvent) {
  const client = await getMongoClient();
  const events = await loadEventsCollection(client);
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
  createEvents(eventsToAdd);
  await closeMongoClient(client);
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

// Helper to add X hours to a date
function addHours(date, h) {
  date.setTime(date.getTime() + (h*60*60*1000)); 
  return date;
}

// Helper to subtract X hours to a date
function subHours(date, h) {
  date.setTime(date.getTime() - (h*60*60*1000)); 
  return date;
}

// Load the events collection
async function loadEventsCollection(client) {
  return client.db('destiny-reset').collection('events');
}

// Load the base events collection
async function loadBaseEventsCollection(client) {
  return client.db('destiny-reset').collection('baseEvents');
}

async function getMongoClient() {
  const client = await mongodb.MongoClient.connect
    ('mongodb+srv://m001-student:m001-mongodb-basics@sandbox-s8g7n.mongodb.net/destiny-reset?retryWrites=true&w=majority', {
      useNewUrlParser: true
    });
  return client;
}

async function closeMongoClient(client) {
  client.close();
}

module.exports = router;
