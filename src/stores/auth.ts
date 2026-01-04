import { defineStore } from 'pinia'

interface AuthState {
	token: string
	role: string
	user: object
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		token: '',
		role: '',
		user: {},
	}),
	actions: {
		checkAuth() {
			if (process.client) {
				this.token = (useCookie('token').value ?? localStorage.getItem('token')) || ''
				this.user = JSON.parse(localStorage.getItem('user') || '{}')
				this.role = localStorage.getItem('role') || ''
			}
		},
		addToken(payload: string) {
			this.token = payload
			if (process.client) {
				const tokenCookie = useCookie('token')
				tokenCookie.value = payload
				localStorage.setItem('token', payload)
			}
		},
		addUser(payload: object) {
			this.user = payload
			if (process.client) {
				localStorage.setItem('user', JSON.stringify(payload))
			}
		},
		addRole(payload: string) {
			this.role = payload
			if (process.client) {
				localStorage.setItem('role', payload)
			}
		},
		doLogout() {
			this.token = ''
			this.role = ''
			this.user = {}
			if (process.client) {
				const tokenCookie = useCookie('token')
				tokenCookie.value = null
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				localStorage.removeItem('role')
			}
			navigateTo('/')
		},
		setLoginData(loginResponse: any) {
			const { access_token, role } = loginResponse.data
			this.addToken(access_token)
			this.addRole(role)
		},
	},
	getters: {
		getToken: (state) => state.token,
		getUser: (state) => state.user,
		getRole: (state) => state.role,
	},
})
