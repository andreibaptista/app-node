const { expect, factory } = require('../setup');

const httpMock = require('node-mocks-http');
const authMiddleware = require('../../app/middlewares/auth');
const sinon = require('sinon');

describe('Auth middleware', () => {
  beforeEach(() => {
    this.response = httpMock.createResponse();
  });

  it('it should validate the presence of JWT token', async () => {
    const request = httpMock.createRequest();

    await authMiddleware(request, this.response);

    expect(this.response.statusCode).to.eq(401);
  });

  it('it should validate if token is valid', async () => {
    const request = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 123123',
      },
    });

    await authMiddleware(request, this.response);

    expect(this.response.statusCode).to.eq(401);
  });

  it('it should pass if token is valid', async () => {
    const user = await factory.create('User');

    const callbackSpy = sinon.spy();

    const request = httpMock.createRequest({
      headers: {
        authorization: `Bearer ${user.generateToken()}`,
      },
    });

    await authMiddleware(request, this.response, callbackSpy);

    expect(request).to.include({ userId: user.id });
    expect(callbackSpy.calledOnce).to.be.true;
  });
});
