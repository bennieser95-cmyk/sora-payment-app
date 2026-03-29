import { Session, User, AuthData } from './types'

const USERS_KEY = 'sora_users'
const SESSION_KEY = 'sora_session'

type KvClient = {
  get: <T>(key: string) => Promise<T | undefined>
  set: <T>(key: string, value: T) => Promise<void>
  delete: (key: string) => Promise<void>
}

const localStorageKv: KvClient = {
  async get<T>(key: string): Promise<T | undefined> {
    if (typeof window === 'undefined') {
      return undefined
    }

    const rawValue = window.localStorage.getItem(key)
    if (rawValue === null) {
      return undefined
    }

    try {
      return JSON.parse(rawValue) as T
    } catch {
      return rawValue as T
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  },

  async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(key)
  }
}

function getKv(): KvClient {
  if (typeof window !== 'undefined') {
    const sparkKv = (window as typeof window & { spark?: { kv?: KvClient } }).spark?.kv
    if (sparkKv) {
      return {
        async get<T>(key: string): Promise<T | undefined> {
          try {
            const sparkValue = await sparkKv.get<T>(key)
            if (sparkValue !== undefined) {
              return sparkValue
            }
          } catch {
            // Fall back to localStorage when Spark KV is unavailable or fails.
          }

          return localStorageKv.get<T>(key)
        },

        async set<T>(key: string, value: T): Promise<void> {
          try {
            await sparkKv.set<T>(key, value)
          } catch {
            // Ignore Spark KV write failures and continue with local fallback.
          }

          await localStorageKv.set<T>(key, value)
        },

        async delete(key: string): Promise<void> {
          try {
            await sparkKv.delete(key)
          } catch {
            // Ignore Spark KV delete failures and continue with local fallback.
          }

          await localStorageKv.delete(key)
        }
      }
    }
  }

  return localStorageKv
}

export const authService = {
  async register(data: AuthData & { name: string }): Promise<User> {
    const kv = getKv()
    const users = await kv.get<User[]>(USERS_KEY) || []
    
    const existingUser = users.find((u: User) => u.email === data.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    await kv.set(USERS_KEY, users)
    await kv.set(`user_password_${newUser.id}`, data.password)

    return newUser
  },

  async login(data: AuthData): Promise<Session> {
    const kv = getKv()
    const users = await kv.get<User[]>(USERS_KEY) || []
    const user = users.find((u: User) => u.email === data.email)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const storedPassword = await kv.get<string>(`user_password_${user.id}`)
    
    if (storedPassword !== data.password) {
      throw new Error('Invalid email or password')
    }

    const session: Session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAuthenticated: true
    }

    await kv.set(SESSION_KEY, session)
    return session
  },

  async logout(): Promise<void> {
    const kv = getKv()
    await kv.delete(SESSION_KEY)
  },

  async getSession(): Promise<Session | null> {
    const kv = getKv()
    const session = await kv.get<Session>(SESSION_KEY)
    return session || null
  },

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession()
    if (!session || !session.isAuthenticated) {
      return null
    }

    const kv = getKv()
    const users = await kv.get<User[]>(USERS_KEY) || []
    return users.find((u: User) => u.id === session.userId) || null
  }
}

