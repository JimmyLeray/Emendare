// librairies
import mockingoose from 'mockingoose'
import bcrypt from 'bcrypt'
// Models and interfaces
import { User } from './User'
import { userMock, amendMock, textMock } from '../../../../interfaces'

describe('activateUser', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return error message account already activated', async () => {
    const activatedUser = {
      ...userMock,
      activated: true
    }
    mockingoose.User.toReturn(activatedUser, 'findOne').reset('find')
    expect(
      await User.activateUser('4d55a560ea0be764c55dc01a872c8fc8205cf262994c8')
    ).toMatchObject({
      error: {
        code: 405,
        message: 'Ce compte est déjà activé'
      }
    })
  })

  test('should return nothing because it works', async () => {
    const notActivatedUser = {
      ...userMock,
      activated: false
    }
    mockingoose.User.toReturn(notActivatedUser, 'findOne')
    mockingoose.User.toReturn(notActivatedUser, 'save')
    expect(
      await User.activateUser('4d55a560ea0be764c55dc01a872c8fc8205cf262994c8')
    ).toHaveProperty('data')
  })
})

describe('login', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return error : need to provide email and password ', async () => {
    expect(await User.login('', '', '')).toMatchObject({
      error: {
        code: 405,
        message: 'Vous devez spécifier un mot de passe et un email'
      }
    })
  })

  test('should return error : invalid email ', async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(await User.login('wrong.email@test.com', 'abcd', '')).toMatchObject({
      error: {
        code: 405,
        message: "L'email est invalide"
      }
    })
  })

  test('should return error : need to activate the account ', async () => {
    const notActivatedUser = {
      ...userMock,
      activated: false
    }
    mockingoose.User.toReturn(notActivatedUser, 'findOne')
    expect(await User.login('test@test.com', 'abcd', '')).toMatchObject({
      error: {
        code: 405,
        message: "Votre compte n'est pas activé"
      }
    })
  })

  test('should return error : password is invalid', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    expect(await User.login('test@test.com', 'abczd', '')).toMatchObject({
      error: {
        code: 405,
        message: 'Le mot de passe est invalide'
      }
    })
  })

  test('should return user token', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    expect(typeof token).toBe(
      'string'
    )
    expect(typeof (await User.login('', '', token)).data).toBe(
      'string'
    )
  })
})

describe('subscribe', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return email already uses', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    expect(await User.subscribe('test@test.com', 'abcd')).toMatchObject({
      error: {
        code: 405,
        message:
          "Cet email est déjà utilisé. Si il s'agit de votre compte, essayez de vous y connecter directement."
      }
    })
  })
})

describe('resetPassword', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test("should return email doesn't exist ", async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(
      await User.resetPassword({ email: 'wrong.email@test.com' })
    ).toMatchObject({
      error: {
        code: 405,
        message: "Cet email n'existe pas."
      }
    })
  })
})

describe('updatePassword', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test("should return email doesn't exist ", async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(await User.updatePassword('abssd', 'wrongToken')).toMatchObject({
      error: {
        code: 405,
        message: 'Token invalide'
      }
    })
  })

  test('should return user data', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    const res = await User.updatePassword('abcde', token)
    expect(bcrypt.compareSync('abcde', res.data.password)).toBeTruthy()
  })
})

describe('updateEmail', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return invalid token', async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(
      await User.updateEmail('new.email@test.com', 'bfb57793d31a7')
    ).toMatchObject({
      error: {
        code: 405,
        message: 'Token invalide'
      }
    })
  })

  test('should return email already used', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    expect(
      await User.updateEmail('test@test.com', token)
    ).toMatchObject({
      error: {
        code: 405,
        message: 'Cet email est déjà utilisée'
      }
    })
  })
})

describe('updateLastEventDate', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return user not connected', async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(await User.updateLastEventDate('bfb82457793d31a7')).toMatchObject({
      error: {
        code: 405,
        message: "Le token est invalide"
      }
    })
  })

  test('should return user data', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    expect(
      typeof (await User.updateLastEventDate(token)).data
    ).toBe('object')
  })
})

describe('toggleNotificationSetting', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  test('should return user not connected', async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(
      await User.toggleNotificationSetting('test', 'bfb82457793d31a7')
    ).toMatchObject({
      error: {
        code: 405,
        message: "Le token est invalide"
      }
    })
  })

  test('should return user data', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    expect(
      typeof (await User.toggleNotificationSetting(
        'newText',
        token
      )).data
    ).toBe('object')
  })

  test('should return error invalid key', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    expect(
      await User.toggleNotificationSetting('wrongKey', token)
    ).toMatchObject({
      error: {
        code: 405,
        message: 'Cette clé de requête est invalide'
      }
    })
  })
})

describe('delete', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })
  test('should user not connected', async () => {
    mockingoose.User.toReturn(null, 'findOne')
    expect(await User.delete('wrongToken')).toMatchObject({
      error: {
        code: 405,
        message: "Le token est invalide"
      }
    })
  })

  test('should delete user without error', async () => {
    mockingoose.User.toReturn(userMock, 'findOne')
    mockingoose.Amend.toReturn(amendMock, 'findOne')
    mockingoose.Text.toReturn(new Array(textMock), 'findOne')
    const token = (await User.login('test@test.com', 'abcd', '')).data
    const res = await User.delete(token)
    expect(res).not.toHaveProperty('error')
  })
})
