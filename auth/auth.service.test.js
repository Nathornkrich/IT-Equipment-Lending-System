process.env.JWT_SECRET = 'testsecret'
process.env.JWT_EXPIRES_IN = '1d'

const authService = require('../src/services/auth.service')

describe('authService.hashPassword', () => {
  it('returns a hashed string different from original', async () => {
    const hash = await authService.hashPassword('mypassword')
    expect(hash).not.toBe('mypassword')
    expect(typeof hash).toBe('string')
  })
})

describe('authService.comparePassword', () => {
  it('returns true for correct password', async () => {
    const hash = await authService.hashPassword('correct')
    const result = await authService.comparePassword('correct', hash)
    expect(result).toBe(true)
  })

  it('returns false for wrong password', async () => {
    const hash = await authService.hashPassword('correct')
    const result = await authService.comparePassword('wrong', hash)
    expect(result).toBe(false)
  })
})

describe('authService.generateToken / verifyToken', () => {
  it('generates and verifies a token', () => {
    const payload = { userId: 'uuid-1', role: 'user' }
    const token = authService.generateToken(payload)
    const decoded = authService.verifyToken(token)

    expect(decoded.userId).toBe('uuid-1')
    expect(decoded.role).toBe('user')
  })

  it('throws on invalid token', () => {
    expect(() => authService.verifyToken('badtoken')).toThrow()
  })
})
