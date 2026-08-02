<template>
	<v-app-bar flat
		style="background-color: rgb(var(--color-sidebar)); color: rgb(var(--color-sidebar-text)); border-bottom: 1px solid rgb(var(--color-border))">
		<div class="flex items-center justify-between h-full px-6 w-full text-primary">
			<!-- Mobile hamburger -->
			<button type="button"
				class="z-10 p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
				aria-label="Menu" @click="toggleMenu">
				<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			<!-- Page Title (Left Side) -->
			<div class="hidden md:block">
				<h2 class="text-lg font-bold truncate max-w-[200px] lg:max-w-md">
					{{ displayTitle }}
				</h2>
			</div>

			<!-- Search input -->
			<div class="flex justify-center flex-1 lg:mr-32">
				<div class="relative w-full max-w-xl mr-7 focus-within:text-primary"></div>
			</div>
			<ul class="flex items-center flex-shrink-0 space-x-6">
				<!-- Theme toggler -->
				<li class="flex">
					<v-tooltip location="bottom">
						<template v-slot:activator="{ props }">
							<button v-bind="props"
								class="rounded-full focus:outline-none focus:shadow-outline-purple p-2 hover:bg-primary/10 transition-colors"
								@click="themeStore.toggleTheme()" :aria-label="`Switch to ${getNextThemeName()} theme`">
								<div class="flex items-center justify-center w-6 h-6">
									<!-- Theme icon based on current theme -->
									<template v-if="themeStore.currentTheme === 'light'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd"
												d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
												clip-rule="evenodd"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'dark'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z">
											</path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'sepia'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'blue'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd"
												d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z"
												clip-rule="evenodd"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'green'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'coolBlue'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M11,2V4.07L8,3.58L7.58,5.5L10,5.89V8H8.11L6,5.89L4.5,7.38L6.71,9.6H4.6L2.83,7.83L1.41,9.24L3.76,11.59H2V13.59H3.76L1.41,15.94L2.83,17.35L4.6,15.58H6.71L4.5,17.8L6,19.29L8.11,17.18H10V19.29L7.58,19.68L8,21.6L11,21.11V23.18H13V21.11L16,21.6L16.42,19.68L14,19.29V17.18H15.89L18,19.29L19.5,17.8L17.29,15.58H19.4L21.17,17.35L22.59,15.94L20.24,13.59H22V11.59H20.24L22.59,9.24L21.17,7.83L19.4,9.6H17.29L19.5,7.38L18,5.89L15.89,8H14V5.89L16.42,5.5L16,3.58L13,4.07V2H11Z"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'glassmorphism'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path fill-rule="evenodd"
												d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
												clip-rule="evenodd"></path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'claymorphism'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z">
											</path>
										</svg>
									</template>
									<template v-else-if="themeStore.currentTheme === 'neomorphism'">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z">
											</path>
										</svg>
									</template>
									<template v-else>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 0 11-2 0v-1a1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
										</svg>
									</template>
								</div>
							</button>
						</template>
						<span class="capitalize font-medium">{{ themeStore.currentTheme }} Theme</span>
					</v-tooltip>
				</li>



				<!-- Notifications menu -->
				<li class="relative">
					<v-menu offset-y max-width="340" @update:model-value="onNotifMenuOpen">
						<template v-slot:activator="{ props }">
							<v-btn icon v-bind="props" aria-label="Notifications">
								<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
									</path>
								</svg>
								<!-- Unread badge -->
								<span v-if="unreadCount > 0" aria-hidden="true"
									class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border border-white rounded-full"
									style="transform: translate(30%, -30%)">
									{{ unreadCount > 9 ? '9+' : unreadCount }}
								</span>
							</v-btn>
						</template>
						<v-list min-width="300" max-height="400" class="overflow-y-auto">
							<div class="flex items-center justify-between px-3 py-2 border-b">
								<span class="font-semibold text-sm">Notifications</span>
								<v-btn v-if="unreadCount > 0" size="x-small" variant="text" color="primary"
									@click="markAllRead">Mark
									all read</v-btn>
							</div>
							<div v-if="loadingNotifs" class="py-6 flex justify-center">
								<v-progress-circular size="24" indeterminate color="primary" />
							</div>
							<template v-else-if="notifications.length">
								<v-list-item v-for="notif in notifications" :key="notif.id"
									:class="notif.is_read ? 'opacity-60' : 'bg-indigo-50'" @click="openNotifDetails(notif)">
									<template v-slot:prepend>
										<div class="w-2 h-2 rounded-full mr-2 flex-shrink-0"
											:class="notif.is_read ? 'bg-transparent' : 'bg-indigo-500'" />
									</template>
									<v-list-item-title class="text-sm font-medium">{{ notif.title }}</v-list-item-title>
									<v-list-item-subtitle class="text-xs">{{ notif.message }}</v-list-item-subtitle>
								</v-list-item>
							</template>
							<div v-else class="py-6 text-center text-slate-400 text-sm">No notifications</div>
						</v-list>
					</v-menu>
				</li>
				<!-- Premium Profile Menu -->
				<v-menu transition="slide-y-transition" :offset="12" location="bottom end">
					<template v-slot:activator="{ props }">
						<button v-bind="props"
							class="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:scale-105 transition-all shadow-sm ring-2 ring-transparent hover:ring-primary/30"
							style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
							<v-avatar size="32">
								<ClientOnly>
									<img v-if="authStore.user?.avatar_url" class="object-cover w-full h-full"
										:src="getImageUrl(authStore.user.avatar_url)" alt="User profile photo" />
									<span v-else
										class="text-white text-sm font-bold w-full h-full flex items-center justify-center"
										style="background: linear-gradient(135deg, var(--sidebar-gradient-start, rgb(var(--color-primary))), var(--sidebar-gradient-end, rgb(var(--color-primary))))">
										{{ userInitial }}
									</span>
									<template #fallback>
										<span
											class="text-white text-sm font-bold bg-primary w-full h-full flex items-center justify-center">U</span>
									</template>
								</ClientOnly>
							</v-avatar>
						</button>
					</template>

					<v-card class="rounded-[1.5rem] border border-border shadow-2xl overflow-hidden mt-2 min-w-[280px]"
						style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text)); border-color: rgb(var(--color-border))"
						elevation="0">

						<!-- Header with dynamic gradient -->
						<div class="relative p-6 flex flex-col items-center text-center overflow-hidden z-10">
							<div class="absolute inset-0 opacity-15"
								style="background: linear-gradient(135deg, var(--sidebar-gradient-start, rgb(var(--color-primary))), var(--sidebar-gradient-end, rgb(var(--color-accent)))); z-index: -1;">
							</div>

							<v-avatar size="64" class="mb-3 ring-4 shadow-lg"
								style="--tw-ring-color: rgb(var(--color-background))">
								<img v-if="authStore.user?.avatar_url" class="object-cover w-full h-full"
									:src="getImageUrl(authStore.user.avatar_url)" alt="User profile" />
								<span v-else
									class="text-white text-2xl font-bold w-full h-full flex items-center justify-center shadow-inner"
									style="background: linear-gradient(135deg, var(--sidebar-gradient-start, rgb(var(--color-primary))), var(--sidebar-gradient-end, rgb(var(--color-accent))))">
									{{ userInitial }}
								</span>
							</v-avatar>

							<h3 class="text-lg font-bold tracking-tight mb-0.5">{{ authStore.user?.first_name ||
								authStore.user?.username?.split('@')[0] || 'User' }}</h3>
							<p v-if="authStore.user?.email || authStore.user?.username?.includes('@')"
								class="text-xs opacity-70 font-medium tracking-wide">{{ authStore.user?.email ||
									authStore.user?.username }}</p>
							<span
								class="mt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-sm"
								style="color: rgb(var(--color-primary)); background-color: rgba(var(--color-primary), 0.1); border-color: rgba(var(--color-primary), 0.2)">
								{{ authStore.role }}
							</span>
						</div>

						<v-list class="p-2 space-y-1 overflow-hidden"
							style="background-color: rgb(var(--color-background))">
							<v-list-item :to="profileLink"
								class="rounded-xl transition-all hover:bg-primary/10 hover:text-primary hover:translate-x-1"
								active-class="bg-primary/10 text-primary">
								<template v-slot:prepend>
									<Icon name="mdi:account-outline" class="w-5 h-5 mr-3 opacity-70" />
								</template>
								<v-list-item-title class="font-medium text-sm">My Profile</v-list-item-title>
							</v-list-item>

							<v-list-item v-if="authStore.role === 'USER'" to="/user/wishlist"
								class="rounded-xl transition-all hover:bg-primary/10 hover:text-primary hover:translate-x-1"
								active-class="bg-primary/10 text-primary">
								<template v-slot:prepend>
									<Icon name="mdi:heart-outline" class="w-5 h-5 mr-3 opacity-70" />
								</template>
								<v-list-item-title class="font-medium text-sm">My Wishlist</v-list-item-title>
							</v-list-item>

							<v-list-item v-if="authStore.role === 'USER'" to="/user?tab=orders"
								class="rounded-xl transition-all hover:bg-primary/10 hover:text-primary hover:translate-x-1"
								active-class="bg-primary/10 text-primary">
								<template v-slot:prepend>
									<Icon name="mdi:package-variant-outline" class="w-5 h-5 mr-3 opacity-70" />
								</template>
								<v-list-item-title class="font-medium text-sm">My Orders</v-list-item-title>
							</v-list-item>
						</v-list>

						<div class="p-2 border-t border-border"
							style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
							<v-list-item @click="logout"
								class="rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500 text-red-500 hover:translate-x-1">
								<template v-slot:prepend>
									<Icon name="mdi:logout" class="w-5 h-5 mr-3" />
								</template>
								<v-list-item-title class="font-medium text-sm">Log out securely</v-list-item-title>
							</v-list-item>
						</div>
					</v-card>
				</v-menu>
			</ul>
		</div>

		<!-- Notification Details Modal -->
		<v-dialog v-model="notifDetailsDialog" max-width="500">
			<v-card v-if="selectedNotif" class="rounded-[1.5rem] border border-border overflow-hidden shadow-2xl"
				style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text)); border-color: rgb(var(--color-border))">
				
				<!-- Modal Header -->
				<div class="px-6 py-5 flex items-center justify-between border-b border-border"
					style="background: linear-gradient(135deg, rgba(var(--color-primary), 0.08), rgba(var(--color-accent, var(--color-primary)), 0.04))">
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
							:class="selectedNotif.is_read ? 'bg-slate-500/10 text-slate-500' : 'bg-primary/20 text-primary'">
							<Icon :name="selectedNotif.is_read ? 'mdi:email-open-outline' : 'mdi:bell-ring-outline'" class="w-5 h-5" />
						</div>
						<div>
							<h3 class="font-bold text-base leading-tight">{{ selectedNotif.title || selectedNotif.type || 'Notification' }}</h3>
							<span class="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block mt-1"
								:class="selectedNotif.is_read ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'">
								{{ selectedNotif.is_read ? 'Read' : 'Unread' }}
							</span>
						</div>
					</div>
					<v-btn icon size="small" variant="text" @click="notifDetailsDialog = false">
						<Icon name="mdi:close" class="w-5 h-5 opacity-60" />
					</v-btn>
				</div>

				<!-- Modal Body -->
				<div class="p-6 space-y-4">
					<p class="text-sm leading-relaxed whitespace-pre-wrap text-text/90">
						{{ selectedNotif.message || selectedNotif.body || 'No additional message details provided.' }}
					</p>

					<!-- Additional metadata if present -->
					<div v-if="selectedNotif.created_at || selectedNotif.order_id || selectedNotif.invoice_id"
						class="pt-4 mt-4 border-t border-border/50 text-xs text-text/70 space-y-1.5 grid grid-cols-1 gap-1">
						<div v-if="selectedNotif.created_at" class="flex justify-between">
							<span class="font-semibold opacity-75">Received:</span>
							<span>{{ new Date(selectedNotif.created_at).toLocaleString() }}</span>
						</div>
						<div v-if="selectedNotif.order_id" class="flex justify-between">
							<span class="font-semibold opacity-75">Order ID:</span>
							<span class="font-mono">{{ selectedNotif.order_id }}</span>
						</div>
						<div v-if="selectedNotif.invoice_id" class="flex justify-between">
							<span class="font-semibold opacity-75">Invoice ID:</span>
							<span class="font-mono">{{ selectedNotif.invoice_id }}</span>
						</div>
					</div>
				</div>

				<!-- Modal Actions -->
				<div class="px-6 py-4 flex items-center justify-end space-x-3 border-t border-border"
					style="background-color: rgb(var(--color-background, var(--color-card)))">
					<v-btn variant="text" size="small" class="rounded-lg text-xs capitalize" @click="notifDetailsDialog = false">
						Close
					</v-btn>
					<v-btn v-if="!selectedNotif.is_read" color="primary" variant="flat" size="small" class="rounded-lg text-xs capitalize font-semibold px-4 shadow-sm"
						@click="handleMarkAsReadInDialog">
						<Icon name="mdi:check-circle-outline" class="w-4 h-4 mr-1.5" />
						Mark as Read
					</v-btn>
				</div>
			</v-card>
		</v-dialog>
	</v-app-bar>
</template>
<script setup>
import { toast } from 'vue3-toastify'
import { useNavStore } from '~/stores/navStore'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'
import { useCartStore } from '~/stores/cartStore'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()
const { getImageUrl } = useImageUrl()

const router = useRouter()
const authStore = useAuthStore()
const navStore = useNavStore()
const themeStore = useThemeStore()
const cartStore = useCartStore()

// ── Notifications ─────────────────────────────────
const notifications = ref([])
const unreadCount = ref(0)
const loadingNotifs = ref(false)

const userInitial = computed(() => {
	const u = authStore.user
	if (!u) return 'U'
	return (u.first_name?.[0] || u.username?.[0] || u.email?.[0] || 'U').toUpperCase()
})

const profileLink = computed(() => {
	const role = authStore.role
	if (role === 'ADMIN' || role === 'SUPERADMIN') return '/admin/profile'
	if (role === 'BUSINESS_OWNER' || role === 'BUSINESS_MEMBER') return '/business/profile'
	return '/user?tab=profile'
})

const { getNotifications, markAsRead, markAllRead: doMarkAll, getUnreadCount } = useNotifications()

const onNotifMenuOpen = async (open) => {
	if (!open) return
	loadingNotifs.value = true
	try {
		const res = await getNotifications({ per_page: 20 })
		notifications.value = res?.data?.items || res?.data || []
		unreadCount.value = notifications.value.filter(n => !n.is_read).length
	} catch { /* silently fail */ }
	finally { loadingNotifs.value = false }
}

const readNotif = async (notif) => {
	if (notif.is_read) return
	try {
		await markAsRead(notif.id)
		notif.is_read = true
		unreadCount.value = Math.max(0, unreadCount.value - 1)
	} catch { /* silently fail */ }
}

const notifDetailsDialog = ref(false)
const selectedNotif = ref(null)

const openNotifDetails = (notif) => {
	selectedNotif.value = notif
	notifDetailsDialog.value = true
}

const handleMarkAsReadInDialog = async () => {
	if (selectedNotif.value && !selectedNotif.value.is_read) {
		await readNotif(selectedNotif.value)
		toast.success('Marked as read')
	}
}

const markAllRead = async () => {
	try {
		await doMarkAll()
		notifications.value.forEach(n => n.is_read = true)
		unreadCount.value = 0
	} catch { /* silently fail */ }
}

// Load unread count and cart on mount
onMounted(async () => {
	// Fetch Cart only for users or guests
	if (!authStore.role || authStore.role?.toUpperCase() === 'USER') {
		cartStore.fetchCart()
	}

	try {
		const res = await getUnreadCount()
		unreadCount.value = res?.data?.count || 0
	} catch { /* silently fail */ }
})

// ── Display Title ─────────────────────────────────
const displayTitle = computed(() => {
	const role = authStore.role || ''
	const title = route.meta.title || 'Dashboard'

	// Format role: ADMIN -> Admin, BUSINESS_OWNER -> Business Owner
	const formattedRole = role
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	if (!formattedRole) return title

	// If title already starts with the role, don't duplicate
	if (title.toLowerCase().startsWith(formattedRole.toLowerCase())) {
		return title
	}

	return `${formattedRole} ${title}`
})

const toggleMenu = () => {
	navStore.toggleMobileSideMenu()
}

const getNextThemeName = () => {
	const currentIndex = themeStore.themes.indexOf(themeStore.currentTheme)
	const nextIndex = (currentIndex + 1) % themeStore.themes.length
	return themeStore.themes[nextIndex]
}

const logout = () => {
	try {
		authStore.doLogout()
		toast.success('You have been logged out successfully.', {
			position: 'top-right',
			autoClose: 3000,
		})
	} catch (error) {
		console.error('An error occurred during logout:', error)
		toast.error('An error occurred during logout.', {
			position: 'top-right',
			autoClose: 3000,
		})
	}
}
</script>
<style>
/* Add any custom styles here if needed */
</style>
