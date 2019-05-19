import { Meteor } from 'meteor/meteor';
import mqtt from 'mqtt';
const deviceStatus = new Mongo.Collection('deviceStatus');
const express = require('express');
const app = express();
const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

Meteor.startup(() => {
  const client = mqtt.connect('mqtt://13.235.15.87', { 'clientId': 'smartHomeBackend' });
  // code to run on server at startup
  client.on('connect', function() {
    console.log('client connected');
    client.subscribe('turnonStatus/+');
    client.subscribe('turnoffStatus/+');
  });

  Meteor.methods({
    turnonDevice: (clientId) => {
      client.publish('turnon/' + clientId, JSON.stringify({ 'token': 'sjfsdghfsjdf234332sdfdsfs1#3454%$^4' }));
      deviceStatus.update({ 'clientId': clientId }, { $set: { status: 1 } }, { upsert: true });
    },
    turnoffDevice: (clientId) => {
      client.publish('turnoff/' + clientId, JSON.stringify({ 'token': 'sjfsdghfsjdf234332sdfdsfs1#3454%$^4' }));
      deviceStatus.update({ 'clientId': clientId }, { $set: { status: 0 } }, { upsert: true });
    }
  });

  client.on('message', Meteor.bindEnvironment((topic, message) => {
    message = JSON.parse(message.toString());
    if (message.token === '0NTY3ODkwIiwibmFtZSI6IkpvaG4') {
      let topicArr = topic.split('/');
      if (topic.startsWith('turnonStatus')) {
        deviceStatus.update({ 'clientId': topicArr[1] }, { $set: { status: 1 } }, { upsert: true });
      } else if (topic.startsWith('turnoffStatus')) {
        deviceStatus.update({ 'clientId': topicArr[1] }, { $set: { status: 0 } }, { upsert: true });
      }
    }
  }));
});

Meteor.publish('allDeviceStatus', () => {
  return deviceStatus.find({});
});