// src/stores/auth.ts
import { defineStore } from 'pinia'

interface AuthState {
	token: string | null
	role: string | null
	user: any
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		token: null,
		role: null,
		user: null,
	}),
	actions: {
		addRole(payload: string) {
			this.role = payload
			const roleCookie = useCookie('role')
			roleCookie.value = payload
		},
		doLogout() {
			this.token = null
			this.role = null
			this.user = null
			
			const tokenCookie = useCookie('auth_token')
			tokenCookie.value = null
			const roleCookie = useCookie('role')
			roleCookie.value = null
			
			if (process.client) {
				localStorage.removeItem('user')
			}
			
			navigateTo('/login')
		},
		checkAuth() {
			const tokenCookie = useCookie('auth_token')
			const roleCookie = useCookie('role')
			
			this.token = tokenCookie.value || null
			this.role = roleCookie.value || null
			
			if (process.client) {
				const savedUser = localStorage.getItem('user')
				if (savedUser) {
					try {
						this.user = JSON.parse(savedUser)
					} catch (e) {
						this.user = null
					}
				}
			}
		},
		addToken(payload: string) {
			this.token = payload
			const tokenCookie = useCookie('auth_token')
			tokenCookie.value = payload
		},
		addUser(payload: any) {
			this.user = payload
			if (process.client) {
				localStorage.setItem('user', JSON.stringify(payload))
			}
		},
		setLoginData(loginResponse: any) {
			const { access_token, role, user } = loginResponse.data || loginResponse
			this.addToken(access_token)
			this.addRole(role)
			if (user) {
				this.addUser(user)
			}
		},
	},
	getters: {
		getToken: (state) => state.token,
		getUser: (state) => state.user,
		getRole: (state) => state.role,
		isAuthenticated: (state) => !!state.token,
	},
})
