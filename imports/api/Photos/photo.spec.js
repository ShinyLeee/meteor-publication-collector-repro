/* eslint-disable no-unused-expressions */
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Albums } from '../Albums/albums.js';
import { Photos } from './photos.js';

if (Meteor.isServer) {
  import './server/publication.js';

  describe('Photos API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const photo = Factory.create('photo');
        assert.typeOf(photo.user, 'string', 'user field must unique username');
        assert.typeOf(photo.album, 'string', 'album field must be specific album name');
        assert.typeOf(photo.name, 'string', 'name field must be String');
        assert.typeOf(photo.createdAt, 'date');
      });
    });

    describe('publication', () => {
      const user = faker.internet.userName();
      let albumObj;
      before(() => {
        Albums.remove({});
        Photos.remove({});

        albumObj = Factory.create('album', { user });
        
        Factory.create('photo');
        _.times(2, () => Factory.create('photo', { user, album: albumObj.name }));
      });

      describe('Photos.all', () => {
        it('should send all photo documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Photos.all', (collections) => {
            assert.equal(collections.photos.length, 3);          
            done();
          });
        });
      });
      
      // make server test failure without report
      describe('Photos.inAlbum', () => {
        it('should send all phots in specific album', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'Photos.inAlbum',
            { user, album: albumObj.name },
            (collections) => {
              assert.equal(collections.album.length, 1);
              assert.equal(collections.photos.length, 2);       
              done();
            }
          );
        });
      });
    });
  });
}
