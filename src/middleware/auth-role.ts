// src/middleware/auth-role.ts
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore()
	const { token, user, role } = storeToRefs(authStore)

	// Sync state from cookies (SSR-safe)
	const cookieToken = useCookie('auth_token').value
	if (cookieToken) {
		token.value = cookieToken
	}
	const cookieRole = useCookie('role').value
	if (cookieRole) {
		role.value = cookieRole
	}

	if (process.client) {
		const localStorageUser = localStorage.getItem('user')
		if (localStorageUser && !user.value) {
			try {
				user.value = JSON.parse(localStorageUser)
			} catch (e) {
				console.error('Error parsing user from localStorage', e)
			}
		}
	}

	// Public routes
	const publicRoutes = ['/login', '/register', '/forgot-password', '/verification']
	const isPublicRoute = publicRoutes.some((route) => to?.path?.startsWith(route))

	// Allow public routes
	if (isPublicRoute) {
		if (token.value && ['/login', '/register'].includes(to.path)) {
			const homePage = role.value ? getRoleHome(role.value) : '/'
			return navigateTo(homePage)
		}
		return
	}

	// Check authentication
	if (!token.value) {
		return navigateTo('/login')
	}

	// Role-based redirection for root
	if (to.path === '/' && role.value) {
		return navigateTo(getRoleHome(role.value))
	}

	// Role-based access control
	if (role.value) {
		const rolePathPrefix = getRolePathPrefix(role.value)
		const sharedRoutes = ['/settings', '/profile', '/logout']
		
		const isSharedRoute = sharedRoutes.some((route) => to?.path?.startsWith(route))
		const isRoleAllowed = to.path.startsWith(rolePathPrefix) || isSharedRoute

		if (!isRoleAllowed) {
			return navigateTo(getRoleHome(role.value))
		}
	}

	// Explicit meta roles check
	if (to.meta.roles && Array.isArray(to.meta.roles) && role.value && !to.meta.roles.includes(role.value)) {
		return navigateTo('/403')
	}
})

function getRoleHome(role: string): string {
	switch (role) {
		case 'ADMIN':
			return '/admin'
		case 'BUSINESS_OWNER':
		case 'BUSINESS_MEMBER':
			return '/business'
		case 'USER':
			return '/user'
		default:
			return '/'
	}
}

function getRolePathPrefix(role: string): string {
	switch (role) {
		case 'ADMIN':
			return '/admin'
		case 'BUSINESS_OWNER':
		case 'BUSINESS_MEMBER':
			return '/business'
		case 'USER':
			return '/user'
		default:
			return '/'
	}
}
