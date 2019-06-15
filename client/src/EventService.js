import axios from 'axios';

const url = 'http://localhost:5000/api/events/';

class EventService {
  // Get Events
  static getEvents() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
        const data = res.data;
        resolve(
          data.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Get current Events
  static getCurrentEvents() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}current`);
        const data = res.data;
        resolve(
          data.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default EventService;