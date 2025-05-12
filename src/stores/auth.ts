import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

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
			if (import.meta.client) {
				this.token = useCookie('token').value ?? localStorage.getItem('token')
				this.user = JSON.parse(localStorage.getItem('user') || '{}')
				this.role = localStorage.getItem('role') || ''
			}
		},
		addToken(payload: string) {
			const tokenCookie = useCookie('token')
			const tokenLocalStorage = useStorage('token', '')
			this.token = payload
			tokenCookie.value = payload
			tokenLocalStorage.value = payload
		},
		addUser(payload: object) {
			const userLocalStorage = useStorage('user', {})
			this.user = payload
			userLocalStorage.value = payload
		},
		addRole(payload: string) {
			const roleLocalStorage = useStorage('role', '')
			this.role = payload
			roleLocalStorage.value = payload
		},
		doLogout() {
			const tokenCookie = useCookie('token')
			const tokenLocalStorage = useStorage('token', '')
			const themLocalStorage = useStorage('theme', '')

			this.token = ''
			tokenLocalStorage.value = null
			tokenCookie.value = null
			themLocalStorage.value = null

			this.user = {}
			const userLocalStorage = useStorage('user', {})
			userLocalStorage.value = null

			this.role = ''
			const roleLocalStorage = useStorage('role', '')
			roleLocalStorage.value = null
			navigateTo('/')
		},
	},
	getters: {
		getToken: (state) => state.token,
		getUser: (state) => state.user,
		getRole: (state) => state.role,
	},
})
