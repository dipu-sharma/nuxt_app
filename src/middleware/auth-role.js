import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()

	if (import.meta.server) return

	authStore.checkAuth()
	if (!authStore.isAuthenticated) {
		authStore.$ResetAuth()
		return navigateTo('/login')
	}

	const userRoles = Array.isArray(authStore.roles) ? authStore.roles : [authStore.roles]

	if (userRoles.includes('admin')) {
		return
	}

	const rolesRoutes = {
		superadmin: '/superadmin',
		vendor: '/vendor',
		user: '/user',
		admin: '/admin',
	}

	const userRole = userRoles.find((role) => rolesRoutes[role])

	if (userRole && authStore.isAuthenticated) {
		console.log('User role:', userRole)

		const specificRoute = rolesRoutes[userRole]
		if (to.path !== specificRoute) {
			return navigateTo(specificRoute)
		}
	} else {
		return navigateTo('/not-authorized')
	}
})
