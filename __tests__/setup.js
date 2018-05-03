const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const factory = require('./factories');

chai.use(chaiHttp);

module.exports = {
  app,
  chai,
  expect: chai.expect,
  factory,
};
