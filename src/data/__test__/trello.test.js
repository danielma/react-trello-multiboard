describe('data/Trello', () => {
  const resolve = jest.fn()
  const reject = jest.fn()

  // mock trello's client.js
  const TrelloJs = {
    authorize: jest.fn(args => args.success()), // default: resolve w/ success
    // eslint-disable-next-line
    get: jest.fn((api, successCb, errorCb) => {
      successCb('success')
    }),
  }

  const TrelloJsError = {
    get: jest.fn((api, successCb, errorCb) => {
      errorCb('error')
    }),
  }

  beforeEach(() => {
    global.Trello = TrelloJs
    TrelloJs.authorize.mockReset()
    TrelloJs.get.mockReset()
    resolve.mockReset()
    reject.mockReset()
    jest.resetModules() // will allow to change global.* in each test
  })

  afterAll(() => {
    jest.resetModules()
  })

  test('Trello exposes the correct methods', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    const expectedExport = {
      authenticateUser: expect.any(Function),
      getMeBoards: expect.any(Function),
      getLists: expect.any(Function),
      getCards: expect.any(Function),
      getMember: expect.any(Function),
      isTrelloAvailable: expect.any(Function),
      trello: expect.objectContaining({
        ...TrelloJs,
      }),
    }

    expect(Trello).toEqual(
      expect.objectContaining({
        default: expect.objectContaining({
          ...expectedExport,
        }),
        ...expectedExport,
      }),
    )
  })

  test('isTrelloAvailable: returns true if it does', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')
    expect(Trello.isTrelloAvailable()).toBe(true)
  })

  test('isTrelloAvailable: returns false if it does not', () => {
    global.Trello = undefined
    const Trello = require('../trello')
    expect(Trello.isTrelloAvailable()).toBe(false)
  })

  test('all exposed methods should throw an error if Trello does not exist', () => {
    global.Trello = undefined
    const Trello = require('../trello')
    expect(Trello.authenticateUser()).rejects.toEqual(new Error('Trello is not defined'))
    expect(Trello.getMeBoards()).rejects.toEqual(new Error('Trello is not defined'))
    expect(Trello.getLists()).rejects.toEqual(new Error('Trello is not defined'))
    expect(Trello.getCards()).rejects.toEqual(new Error('Trello is not defined'))
    expect(Trello.getMember()).rejects.toEqual(new Error('Trello is not defined'))
  })

  test('all exposed methods should resolve with the result, if trello.get resolves', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getMeBoards()).resolves.toEqual('success')
    expect(Trello.getLists()).resolves.toEqual('success')
    expect(Trello.getCards()).resolves.toEqual('success')
    expect(Trello.getMember()).resolves.toEqual('success')
  })

  test('all exposed methods should reject with an error, if trello.get rejects', () => {
    global.Trello = TrelloJsError
    const Trello = require('../trello')

    expect(Trello.getMeBoards()).rejects.toEqual('error')
    expect(Trello.getLists()).rejects.toEqual('error')
    expect(Trello.getCards()).rejects.toEqual('error')
    expect(Trello.getMember()).rejects.toEqual('error')
  })

  test('getQuery should reject an error if Trello does not exist', () => {
    global.Trello = undefined
    const Trello = require('../trello')
    Trello.getQuery('some-query', resolve, reject)

    expect(resolve).toHaveBeenCalledTimes(0)
    expect(reject).toHaveBeenCalledWith(new Error('Trello is not defined'))
    expect(reject).toHaveBeenCalledTimes(1)
  })

  test('getQuery should call trello.get', () => {
    const TrelloJsSuccess = {
      get: jest.fn((api, successCb) => {
        successCb('success')
      }),
    }
    global.Trello = TrelloJsSuccess
    const Trello = require('../trello')
    Trello.getQuery('some-query', resolve, reject)

    expect(resolve).toHaveBeenCalledTimes(1)
    expect(resolve).toHaveBeenCalledWith('success')
    expect(reject).toHaveBeenCalledTimes(0)
  })

  test('getQuery should call trello.get and reject if an error occures', () => {
    global.Trello = TrelloJsError
    const Trello = require('../trello')
    Trello.getQuery('some-query', resolve, reject)

    expect(resolve).toHaveBeenCalledTimes(0)
    expect(reject).toHaveBeenCalledWith('error')
    expect(reject).toHaveBeenCalledTimes(1)
  })

  test('getQuery should treat errors with status 401 properly', () => {
    const trelloGet = {
      get: jest.fn((api, successCb, errorCb) => {
        errorCb({
          status: 401,
          responseText: 'some-response',
          statusText: 'some-status',
        })
      }),
    }
    global.Trello = trelloGet
    const Trello = require('../trello')
    Trello.getQuery('some-query', resolve, reject)

    expect(resolve).toHaveBeenCalledTimes(0)
    expect(reject).toHaveBeenCalledWith({
      responseText: 'some-response',
      status: 401,
      statusText: 'some-status',
    })
    expect(reject).toHaveBeenCalledTimes(1)
  })

  test('authenticateUser should be called with the proper args', async () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')
    Trello.authenticateUser()

    expect(TrelloJs.authorize).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Trello Multiboard',
        type: 'redirect',
        scope: {
          read: true,
          write: false,
        },
        expiration: 'never',
        response_type: 'token',
      }),
    )
  })

  test('authenticateUser should reject if Authentication failed', async () => {
    global.Trello = { authorize: jest.fn(args => args.success()) }
    const Trello = require('../trello')
    expect(Trello.authenticateUser()).resolves.toEqual(true)
  })

  test('authenticateUser should reject if Authentication failed', async () => {
    global.Trello = { authorize: jest.fn(args => args.error()) }
    const Trello = require('../trello')

    expect(Trello.authenticateUser()).rejects.toEqual(new Error('Authentication failed'))
  })

  test('getMeBoards should be called with the correct query', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getMeBoards()).resolves.toEqual('success')
    expect(TrelloJs.get.mock.calls[0][0]).toBe('/member/me/boards?fields=id,name')
  })

  test('getBoard should be called with the correct query', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getBoard('board-1')).resolves.toEqual('success')
    expect(TrelloJs.get.mock.calls[0][0]).toBe('/boards/board-1?fields=id,name')
  })

  test('getLists should be called with the correct query', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getLists(123)).resolves.toEqual('success')
    expect(TrelloJs.get.mock.calls[0][0]).toBe('/boards/123/lists?fields=id,idBoard,name')
  })

  test('getCards should be called with the correct query', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getCards(123)).resolves.toEqual('success')
    expect(TrelloJs.get.mock.calls[0][0]).toBe(
      '/lists/123/cards?members=true&member_fields=avatarHash,fullName,initials,username&fields=badges,labels,name,id,idBoard,idList,idMembers,shortUrl',
    )
  })

  test('getMember should be called with the correct query', () => {
    global.Trello = TrelloJs
    const Trello = require('../trello')

    expect(Trello.getMember(123)).resolves.toEqual('success')
    expect(TrelloJs.get.mock.calls[0][0]).toBe(
      '/members/123?fields=username,avatarHash,fullName,initials',
    )
  })
})
