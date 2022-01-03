const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../category/app')
const app2 = require('../../template/app')
const db = require('../../category/app/db')

const { constants } = require('../../category/app/utils')
const { CATEGORY_NOT_FOUND } = constants
const { expect } = chai
chai.use(chaiHttp)

let travelDestinationId
let mexicoId
let germanyId
let beachId
let exclusiveId
let acapulcoId

describe('API Integration Test', () => {
  before((done) => {
    db.dropCollection('categories', (err, res) => {
      if (err) {
        console.log('categories collection not found')
      }
      console.log('Dropped categories collection')
      db.dropCollection('templates', (err, res) => {
        if (err) {
          console.log('templates collection not found')
        }
        console.log('Dropped templates collection')
      })
      done()
    })
  })
  it('Should Insert the category Travel Destinations', (done) => {
    chai.request(app).post('/api/v1/category/create').send({
      displayName: 'Travel Destinations',
      categoryId: null
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('Travel Destinations')
        expect(res.body.data.categoryId).to.be.equal(null)
        expect(res.body.data.ancestorsIds).to.be.an('array')
        expect(res.body.data.ancestorsIds.length).to.be.equal(0)
        travelDestinationId = res.body.data._id
        done()
      })
  })
  it('Should Insert the category Mexico grouped under Travel Destinations', (done) => {
    chai.request(app).post('/api/v1/category/create').send({
      displayName: 'Mexico',
      categoryId: travelDestinationId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('Mexico')
        expect(res.body.data.categoryId).to.be.equal(travelDestinationId)
        mexicoId = res.body.data._id
        done()
      })
  })
  it('Should Insert the category Germany grouped under Travel Destinations', (done) => {
    chai.request(app).post('/api/v1/category/create').send({
      displayName: 'Germany',
      categoryId: travelDestinationId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('Germany')
        expect(res.body.data.categoryId).to.be.equal(travelDestinationId)
        germanyId = res.body.data._id
        done()
      })
  })
  it('Should Insert the template acapulco grouped under Mexico', (done) => {
    chai.request(app2).post('/api/v1/template/create').send({
      displayName: 'acapulco',
      categoryId: mexicoId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('acapulco')
        expect(res.body.data.categoryId).to.be.equal(mexicoId)
        acapulcoId = res.body.data._id
        done()
      })
  })
  it('Should Insert the template munich grouped under Germany', (done) => {
    chai.request(app2).post('/api/v1/template/create').send({
      displayName: 'munich',
      categoryId: germanyId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('munich')
        expect(res.body.data.categoryId).to.be.equal(germanyId)
        done()
      })
  })
  it('Should Insert the category Beach grouped under Germany == semantic mistake', (done) => {
    chai.request(app).post('/api/v1/category/create').send({
      displayName: 'Beach',
      categoryId: germanyId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('Beach')
        expect(res.body.data.categoryId).to.be.equal(germanyId)
        beachId = res.body.data._id
        done()
      })
  })
  it('Should Insert the template los cabos grouped under Beach', (done) => {
    chai.request(app2).post('/api/v1/template/create').send({
      displayName: 'los cabos',
      categoryId: beachId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('los cabos')
        expect(res.body.data.categoryId).to.be.equal(beachId)
        done()
      })
  })
  it('Should Insert the category Exclusive grouped under Beach', (done) => {
    chai.request(app).post('/api/v1/category/create').send({
      displayName: 'Exclusive',
      categoryId: beachId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('Exclusive')
        expect(res.body.data.categoryId).to.be.equal(beachId)
        exclusiveId = res.body.data._id
        done()
      })
  })
  it('Should Insert the template la paz grouped under Exclusive', (done) => {
    chai.request(app2).post('/api/v1/template/create').send({
      displayName: 'la paz',
      categoryId: exclusiveId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('la paz')
        expect(res.body.data.categoryId).to.be.equal(exclusiveId)
        done()
      })
  })
  it('Should Move the category Beach to the template acapulco the api response is 404 cause template is not a category', (done) => {
    chai.request(app).patch(`/api/v1/category/move/${beachId}`).send({
      toCategoryId: acapulcoId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('fail')
        expect(res.statusCode).to.equal(404)
        expect(res.body.message).to.be.a('string').equal(CATEGORY_NOT_FOUND)
        done()
      })
  })
  it('Should Move the category Beach to the category Mexico fix semantic mistake in test 6', (done) => {
    chai.request(app).patch(`/api/v1/category/move/${beachId}`).send({
      toCategoryId: mexicoId
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        done()
      })
  })
  it('Should Delete the category Beach', (done) => {
    chai.request(app).delete(`/api/v1/category/${beachId}`)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.category).to.be.equal(null)
        expect(res.body.data.template).to.be.an('array')
        expect(res.body.data.template.length).to.be.equal(0)
        expect(res.body.data.subCategory).to.be.an('array')
        expect(res.body.data.subCategory.length).to.be.equal(0)
        done()
      })
  })
  it('Should Insert the template memo which is not grouped under no category', (done) => {
    chai.request(app2).post('/api/v1/template/create').send({
      displayName: 'memo',
      categoryId: null
    })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.status).to.be.equal('success')
        expect(res.body.data.displayName).to.be.equal('memo')
        expect(res.body.data.categoryId).to.be.equal(null)
        expect(res.body.data.ancestorsIds).to.be.an('array')
        expect(res.body.data.ancestorsIds.length).to.be.equal(0)
        done()
      })
  })
})
