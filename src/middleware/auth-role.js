import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore()
	const { token, user, role } = storeToRefs(authStore)

	// Sync state from cookies/localStorage (SSR-safe)
	const CookieToken = useCookie('token').value
	if (CookieToken) token.value = CookieToken

	if (process.client) {
		const LocalStorageUser = localStorage.getItem('user')
		const LocalStorageRole = localStorage.getItem('role')

		if (LocalStorageUser) user.value = JSON.parse(LocalStorageUser)
		if (LocalStorageRole) role.value = LocalStorageRole
	}

	// Public routes
	const publicRoutes = ['/login', '/register', '/forgot-password']
	const isPublicRoute = publicRoutes.some((route) => to?.path?.startsWith(route))

	// Allow public routes
	if (isPublicRoute) {
		// If already authenticated and trying to access login/register, redirect to home
		// But only if they're not already on their home page
		if (process.client && token.value && ['/login', '/register'].includes(to.path)) {
			const homePage = role.value ? getRoleHome(role.value) : '/'
			if (to.path !== homePage) {
				return navigateTo(homePage)
			}
		}
		return
	}

	// Check authentication
	if (!token.value) {
		return navigateTo('/login')
	}
	if (role.value) {
		const roleHome = getRoleHome(role.value)
		if (to.path === '/') {
			return navigateTo(roleHome)
		}
		const rolePathPrefix = getRolePathPrefix(role.value)
		if (!to.path.startsWith(rolePathPrefix)) {
			// Allow some shared routes (optional)
			const sharedRoutes = ['/settings', '/profile']
			if (!sharedRoutes.some((route) => to?.path?.startsWith(route))) {
				return navigateTo(roleHome)
			}
		}
	}
	if (to.meta.roles && !to.meta.roles.includes(role.value)) {
		return navigateTo('/403')
	}
	if (import.meta.client && !to.matched.length) {
		return navigateTo('/404')
	}
})
function getRoleHome(role) {
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

function getRolePathPrefix(role) {
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
