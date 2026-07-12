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

	if (import.meta.client) {
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

	// Business setup and status routing check
	if (['BUSINESS_OWNER', 'BUSINESS_MEMBER'].includes(role.value || '')) {
		if (authStore.businessStatus === null && token.value) {
			try {
				const { getProfile } = useBusinessProfile()
				const res = await getProfile()
				const bizData = res?.data || res
				if (bizData && (bizData.status || bizData.business_id)) {
					authStore.businessStatus = bizData.status || 'PENDING'
				} else {
					authStore.businessStatus = 'NOT_SET'
				}
			} catch (err) {
				authStore.businessStatus = 'NOT_SET'
			}
		}

		if (authStore.businessStatus === 'NOT_SET' || authStore.businessStatus === 'PENDING') {
			if (to.path !== '/business/setup') {
				return navigateTo('/business/setup')
			}
		} else if (authStore.businessStatus === 'ACTIVE') {
			if (to.path === '/business/setup') {
				return navigateTo('/business')
			}
		}
	}

	// Role-based access control
	if (role.value) {
		const rolePathPrefix = getRolePathPrefix(role.value)
		const sharedRoutes = ['/settings', '/profile', '/logout', '/business/branches', '/business/setup']
		
		const isSharedRoute = sharedRoutes.some((route) => to?.path?.startsWith(route))
		const isRoleAllowed = to.path.startsWith(rolePathPrefix) || isSharedRoute

		if (!isRoleAllowed) {
			return navigateTo(getRoleHome(role.value))
		}
	}

	// Explicit meta roles check
	const rawRouteRoles = to.meta.roles || to.meta.role
	if (rawRouteRoles && role.value) {
		const routeRoles = Array.isArray(rawRouteRoles) ? rawRouteRoles : [rawRouteRoles]
		const hasAccess = routeRoles.some((r) => typeof r === 'string' && r.toUpperCase() === role.value.toUpperCase())
		if (!hasAccess) {
			return navigateTo('/403')
		}
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
