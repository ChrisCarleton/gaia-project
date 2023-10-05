import { Collection } from 'mongodb';

import { CollectionNames, UserDocument } from '../../../src/data';
import { UserInstance } from '../../../src/users';
import { mongoClient } from '../../mongo-client';
import { createTestLogger } from '../../test-logger';

const Log = createTestLogger('user-instance');
const TestUserData: UserDocument = {
  _id: '130274A5-6513-44AB-B474-DFEBC98B5746',
  displayName: 'Paul Atreides',
  email: 'Paul@gmail.com',
  emailLowered: 'paul@gmail.com',
  memberSince: new Date(),
  avatar: 'https://gravatar.com/someimage',
  googleId: 'google-12345',
};

describe('User class', () => {
  let Users: Collection<UserDocument>;

  beforeAll(() => {
    Users = mongoClient.db().collection(CollectionNames.Users);
  });

  it('will return properties correctly', () => {
    const user = new UserInstance(mongoClient, Log, TestUserData);
    expect(user.avatar).toEqual(TestUserData.avatar);
    expect(user.displayName).toEqual(TestUserData.displayName);
    expect(user.email).toEqual(TestUserData.email);
    expect(user.googleId).toEqual(TestUserData.googleId);
    expect(user.memberSince).toEqual(TestUserData.memberSince);
  });

  it.todo('will return optional properties as undefined');

  it('will save a new user', async () => {
    const user = new UserInstance(mongoClient, Log, TestUserData);
    await user.save();
    const result = await Users.findOne({ _id: TestUserData._id });
    expect(result).toBeDefined();
    expect(result).toEqual(TestUserData);
  });

  it('will update an existing user', async () => {
    const user = new UserInstance(mongoClient, Log, TestUserData);
    const avatar = 'https://giphy.com/some_other_graphic';
    const displayName = "Paul Muad'Dib";
    await Users.insertOne(TestUserData);

    user.avatar = avatar;
    user.displayName = displayName;
    await user.save();

    const result = await Users.findOne({ _id: TestUserData._id });
    expect(result).toEqual({
      ...TestUserData,
      displayName,
      avatar,
    });
  });
});
