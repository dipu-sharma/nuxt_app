import { storeToRefs } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore()
	const { token, user, role } = storeToRefs(authStore)

	// Sync state from cookies/localStorage
	const CookieToken = useCookie('token').value
	const LocalStorageUser = useStorage('user').value
	const LocalStorageRole = useStorage('role').value

	if (CookieToken) token.value = CookieToken
	if (LocalStorageUser) user.value = JSON.parse(LocalStorageUser)
	if (LocalStorageRole) role.value = LocalStorageRole

	// Public routes
	const publicRoutes = ['/login', '/register', '/forgot-password']
	const isPublicRoute = publicRoutes.some((route) => to?.path?.startsWith(route))

	// Allow public routes
	if (isPublicRoute) {
		// If already authenticated and trying to access login/register, redirect to home
		if (token.value && ['/login', '/register'].includes(to.path)) {
			return navigateTo(role.value ? getRoleHome(role.value) : '/')
		}
		return
	}

	// Check authentication
	if (!token.value) {
		return navigateTo('/login')
	}

	// Handle role-based routing
	if (role.value) {
		const roleHome = getRoleHome(role.value)

		// Redirect to role home if trying to access root
		if (to.path === '/') {
			return navigateTo(roleHome)
		}

		// Check if user is trying to access their role's area
		if (!to.path.startsWith(`/${role.value.toLowerCase()}`)) {
			// Allow some shared routes (optional)
			const sharedRoutes = ['/settings', '/profile'] // Add your shared routes
			if (!sharedRoutes.some((route) => to?.path?.startsWith(route))) {
				return navigateTo(roleHome)
			}
		}
	}

	// Check route role requirements
	if (to.meta.roles && !to.meta.roles.includes(role.value)) {
		return navigateTo('/403')
	}

	// Handle 404
	if (import.meta.client && !to.matched.length) {
		return navigateTo('/404')
	}
})

// Helper function to get home route for each role
function getRoleHome(role) {
	switch (role) {
		case 'ADMIN':
			return '/admin'
		case 'VENDOR':
			return '/vendor'
		case 'USER':
			return '/user'
		default:
			return '/'
	}
}
