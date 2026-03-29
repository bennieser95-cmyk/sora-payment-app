import { Session, User, AuthData } from './types'

const USERS_KEY = 'sora_users'
const SESSION_KEY = 'sora_session'

export const authService = {
  async register(data: AuthData & { name: string }): Promise<User> {
    const users = await window.spark.kv.get<User[]>(USERS_KEY) || []
    
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
    await window.spark.kv.set(USERS_KEY, users)
    await window.spark.kv.set(`user_password_${newUser.id}`, data.password)

    return newUser
  },

  async login(data: AuthData): Promise<Session> {
    const users = await window.spark.kv.get<User[]>(USERS_KEY) || []
    const user = users.find((u: User) => u.email === data.email)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const storedPassword = await window.spark.kv.get<string>(`user_password_${user.id}`)
    
    if (storedPassword !== data.password) {
      throw new Error('Invalid email or password')
    }

    const session: Session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAuthenticated: true
    }

    await window.spark.kv.set(SESSION_KEY, session)
    return session
  },

  async logout(): Promise<void> {
    await window.spark.kv.delete(SESSION_KEY)
  },

  async getSession(): Promise<Session | null> {
    const session = await window.spark.kv.get<Session>(SESSION_KEY)
    return session || null
  },

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession()
    if (!session || !session.isAuthenticated) {
      return null
    }

    const users = await window.spark.kv.get<User[]>(USERS_KEY) || []
    return users.find((u: User) => u.id === session.userId) || null
  }
}

