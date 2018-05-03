const nodemailer = require('nodemailer');
const sinon = require('sinon');

const transport = {
  sendMail: sinon.spy(),
};

sinon.stub(nodemailer, 'createTransport').returns(transport);

const {
  app,
  chai,
  expect,
  factory,
} = require('../setup');

const mongoose = require('mongoose');

const User = mongoose.model('User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.remove();
  });

  describe('Sign up', () => {
    it('it should be able to sign up', async () => {
      const user = await factory.attrs('User');

      const response = await chai.request(app)
        .post('/api/signup')
        .send(user);

      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
      expect(transport.sendMail.calledOnce).to.be.true;
    });

    it('it should not be able to sign up with duplicates', async () => {
      const user = await factory.create('User');

      const response = await chai.request(app)
        .post('/api/signup')
        .send(user);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });
  });

  describe('Sign in', () => {
    it('it should be able to sign in', async () => {
      const { email } = await factory.create('User', {
        password: '123456',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email, password: '123456' });

      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });

    it('it should not be able to sign in with nonexistent user', async () => {
      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email: 'a@b.com', password: '123' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });

    it('it should not be able to sign in with wrong password', async () => {
      const { email } = await factory.create('User', {
        password: '123456',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email, password: '123' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });
  });
});
