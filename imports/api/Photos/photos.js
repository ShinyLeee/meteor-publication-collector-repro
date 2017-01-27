import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PhotosCollection extends Mongo.Collection {
  insert(photo, cb) {
    const result = super.insert(photo, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Photos = new PhotosCollection('photos');

Photos.schema = new SimpleSchema({
  user: { type: String, max: 20, denyUpdate: true },
  album: { type: String, max: 20 },
  name: { type: String, label: '图片名' },
  createdAt: { type: Date, denyUpdate: true },
});

Photos.attachSchema(Photos.schema);

Photos.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import faker from 'faker';
  import { Factory } from 'meteor/dburles:factory';

  Factory.define('photo', Photos, {
    user: () => faker.internet.userName(),
    album: () => faker.hacker.noun(),
    name: () => faker.random.uuid(),
    createdAt: () => new Date(),
  });
}
