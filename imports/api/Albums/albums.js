import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class AlbumCollection extends Mongo.Collection {
  insert(album, cb) {
    const result = super.insert(album, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Albums = new AlbumCollection('album');

Albums.schema = new SimpleSchema({
  name: { type: String },
  user: { type: String, denyUpdate: true },
  createdAt: { type: Date, denyUpdate: true },
});

Albums.attachSchema(Albums.schema);

Albums.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import faker from 'faker';
  import { Factory } from 'meteor/dburles:factory';

  Factory.define('album', Albums, {
    name: () => faker.hacker.noun(),
    user: () => faker.internet.userName(),
    createdAt: () => new Date(),
  });
}
