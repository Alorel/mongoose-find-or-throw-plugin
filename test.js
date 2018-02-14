const {expect} = require('chai');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const v4 = require('uuid/v4');
const noop = require('lodash/noop');
require('./index');
const {ObjectID} = require('bson');

describe('MongooseFindOrThrow plugin', () => {
  let model;

  before('Connect', () => {
    const host = process.env.MONGODB_HOST || '127.0.0.1';
    mongoose.Promise = Promise;

    return mongoose.connect(`mongodb://${host}/${v4()}`);
  });

  before('Define model', () => {
    const sch = new Schema({foo: String}, {versionKey: false, skipVersioning: true});
    model = mongoose.model(v4(), sch);
  });

  describe('Should reject if', () => {
    const shouldReject = (promise, done) => {
      promise.then(() => done('Did not throw'))
        .catch(e => {
          expect(e.status).to.eq(404);
          expect(e.message).to.eq('Not found');
          expect(e.name).to.eq('MongooseDocumentNotFoundError');
          done();
        })
        .catch(done);
    };

    it('findOne not found (lean)', done => {
      shouldReject(model.findOne({foo: v4()}).lean().throwIfEmpty(), done)
    });
    it('findOne not found', done => {
      shouldReject(model.findOne({foo: v4()}).throwIfEmpty(), done)
    });
    it('findById not found', done => {
      shouldReject(model.findById(new ObjectID()).throwIfEmpty(), done);
    });
    it('findOneAndUpdate not found', done => {
      shouldReject(model.findOneAndUpdate({foo: v4()}, {foo: v4()}).throwIfEmpty(), done);
    });
    it('findOneAndUpdate not found (upsert)', done => {
      shouldReject(model.findOneAndUpdate({foo: v4()}, {foo: v4()}, {upsert: true}).throwIfEmpty(), done);
    });
    it('find, empty array', done => {
      shouldReject(model.find({foo: v4()}).throwIfEmpty(), done);
    });
    it('find condition is rewritten', done => {
      shouldReject(model.findOne({foo: v4()}).throwIfEmpty().findOne({_id: new ObjectID()}), done)
    })
  });

  describe('Should not reject if', () => {
    it('findOneAndUpdate not found, upsert, new', done => {
      model.findOneAndUpdate({_id: new ObjectID()}, {foo: v4()}, {upsert: true, new: true}).throwIfEmpty()
        .then(() => done())
        .catch(done);
    });
  });

  it('Should throw if callback style is used', () => {
    expect(() => {
      model.findOne({foo: v4()}).throwIfEmpty().exec(() => {
      });
    })
      .to.throw(Error, 'Use promises after calling throwIfEmpty()');
  })

  after('Destroy DB', () => {
    if (mongoose.connection) {
      return mongoose.connection.dropDatabase().catch(noop)
    }
  });

  after('Disconnect', () => {
    if (mongoose.connection) {
      return mongoose.disconnect().catch(noop);
    }
  });
});