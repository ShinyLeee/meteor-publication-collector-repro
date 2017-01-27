/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Photos } from '../photos.js';
import { Albums } from '../../Albums/albums.js';

Meteor.publish('Photos.all', function getAll() {
  return Photos.find({});
});

Meteor.publishComposite('Photos.inAlbum', function inAlbum({ user, album }) {
  new SimpleSchema({
    user: { type: String },
    album: { type: String },
  }).validator({ clean: true, filter: false });
  return {
    find() {
      return Albums.find({
        name: album,
        user,
      });
    },
    children: [{
      find(album) {
        return Photos.find({
          user: album.user,
          album: album.name,
        });
      },
    }],
  };
});
