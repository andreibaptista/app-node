const {
  app,
  chai,
  expect,
  factory,
} = require('../setup');

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Tweet = mongoose.model('Tweet');

describe('Like', () => {
  beforeEach(async () => {
    await User.remove();
    await Tweet.remove();

    this.user = await factory.create('User');
    this.jwtToken = this.user.generateToken();
  });

  it('it should be able to like an tweet', async () => {
    const tweet = await factory.create('Tweet');

    const response = await chai.request(app)
      .post(`/api/like/${tweet.id}`)
      .set('Authorization', `Bearer ${this.jwtToken}`)
      .send();

    expect(response).to.have.status(200);

    expect(response.body.likes).to.include(this.user.id);
  });
});
