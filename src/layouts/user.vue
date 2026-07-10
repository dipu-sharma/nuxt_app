<template>
  <div style="background-color: rgb(var(--color-background)); min-height: 100vh" class="relative overflow-hidden transition-colors duration-500">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-80 mix-blend-normal" />
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob" />
      <div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000" />
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <header class="relative z-[100]">
        <Navbar />
      </header>
      <main class="flex-grow pt-20">
        <div class="min-h-screen relative overflow-hidden pt-8 pb-28 lg:py-6">
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div class="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-32">
            <div class="mb-10">
              <h1 class="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 leading-tight">{{ pageTitle }}</h1>
              <p class="text-text opacity-60 text-base mt-2 font-medium tracking-wide">{{ pageSubtitle }}</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <UserSidebar :profile-data="profileData" :active-tab="activeTab" @update:active-tab="onTabChange" @handle-image-upload="handleImageUpload" />
              <div class="lg:col-span-8 xl:col-span-9">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileUserNav />
      <AutoLogOut />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref(route.query.tab || 'overview')

const pageTitle = computed(() => {
  const titles = {
    '/user': 'User Dashboard',
    '/user/cart': 'Shopping Cart',
    '/user/wishlist': 'My Wishlist',
    '/user/invoices': 'My Invoices'
  }
  return titles[route.path] || 'User Dashboard'
})

const pageSubtitle = computed(() => {
  const subs = {
    '/user': 'Manage your profile, orders, addresses, and security settings.',
    '/user/cart': 'Review and manage items in your cart.',
    '/user/wishlist': 'Items you have saved for later.',
    '/user/invoices': 'View and manage your invoices.'
  }
  return subs[route.path] || ''
})

const profileData = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  avatar_url: authStore.user?.url || ''
})

const onTabChange = (tab) => {
  activeTab.value = tab
  router.push('/user?tab=' + tab)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const { updateProfileImage } = useProfile()
    await updateProfileImage(file)
  } catch { }
}

onMounted(async () => {
  try {
    const { getAuthMe } = useProfile()
    const meRes = await getAuthMe()
    if (meRes?.data) {
      Object.assign(profileData.value, {
        first_name: meRes.data.first_name || '',
        last_name: meRes.data.last_name || '',
        avatar_url: meRes.data.url || ''
      })
    }
    const { getProfile } = useProfile()
    const res = await getProfile()
    if (res?.data?.url) {
      profileData.value.avatar_url = res.data.url
    }
  } catch { }
})
</script>
