import { Meteor } from 'meteor/meteor';
import mqtt from 'mqtt';
import './dashboard.js';

Meteor.startup(() => {
  client = mqtt.connect('mqtt://13.235.15.87', { 'clientId': 'smartHomeBackenddev' });
  // code to run on server at startup
  client.on('connect', function() {
    console.log('client connected');
    client.subscribe('turnonStatus/+');
    client.subscribe('turnoffStatus/+');
  });

  client.on('message', Meteor.bindEnvironment((topic, message) => {
    message = JSON.parse(message.toString());
    if (message.token === '0NTY3ODkwIiwibmFtZSI6IkpvaG4') {
      let topicArr = topic.split('/');
      if (topic.startsWith('turnonStatus')) {
        DeviceStatus.update({ 'clientId': topicArr[1] }, { $set: { status: 1 } }, { upsert: true });
      } else if (topic.startsWith('turnoffStatus')) {
        DeviceStatus.update({ 'clientId': topicArr[1] }, { $set: { status: 0 } }, { upsert: true });
      }
    }
  }));
});

