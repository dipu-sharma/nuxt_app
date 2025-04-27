import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()
	if (import.meta.server) return

	authStore.checkAuth()

	if (!authStore.isAuthenticated) {
		authStore.logout()
		return navigateTo('/login')
	}

	const userRoles = Array.isArray(authStore.role) ? authStore.role : [authStore.role]

	const roleRoutes = {
		ADMIN: '/admin/',
		VENDOR: '/vendor/',
		USER: '/user/',
	}
	const hasAccess = userRoles.some((role) => {
		const commonRoutes = ['/profile', '/settings']
		if (commonRoutes.some((route) => to.path.startsWith(route))) return true
		return to.path.startsWith(roleRoutes[role])
	})
	if (!hasAccess) {
		const primaryRole = userRoles.find((role) => ['ADMIN', 'VENDOR', 'USER'].includes(role))

		if (primaryRole) {
			return navigateTo(roleRoutes[primaryRole])
		} else {
			return navigateTo('/not-authorized')
		}
	}
})
