<template>
  <div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30 py-8 lg:py-6">
    <!-- Cool Background Gradient Blobs -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none">
    </div>

    <div class="relative z-10 max-w-8xl mx-auto sm:px-4 lg:px-32">
      <!-- Title Header -->
      <div class="mb-10">
        <h1
          class="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 leading-tight">
          User Settings
        </h1>
        <p class="text-text opacity-60 text-base mt-2 font-medium tracking-wide">
          Manage your personal details, saved shipping addresses, and security settings.
        </p>
      </div>

      <ClientOnly>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Sidebar Navigation Menu -->
          <aside class="lg:col-span-4 xl:col-span-3">
            <div
              class="bg-card/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 relative overflow-hidden">
              <!-- Sidebar avatar summary -->
              <div class="flex flex-col items-center text-center pb-6 border-b border-border/50">
                <div class="w-full flex flex-col items-center">
                  <div class="relative group cursor-pointer mb-4" @click="triggerUpload">
                    <div
                      class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary/40 flex items-center justify-center relative shadow-inner">
                      <img v-if="profileData.avatar_url" :src="profileData.avatar_url" alt="Avatar"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <Icon v-else name="mdi:account" class="w-12 h-12 text-text opacity-40" />
                    </div>
                    <!-- Hover Edit Overlay -->
                    <div
                      class="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div><Icon name="mdi:camera" class="w-6 h-6 text-white" /></div>
                    </div>
                  </div>
                  <div class="font-extrabold text-lg text-text mb-1">
                    <span>{{ profileData.first_name || authStore.user?.first_name || authStore.user?.username || 'Guest' }} {{ profileData.last_name || authStore.user?.last_name || '' }}</span>
                  </div>
                  <p class="text-text opacity-50 text-xs font-semibold">@{{ authStore.user?.username || 'user' }}</p>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                </div>
              </div>

              <!-- Tab List Buttons -->
              <nav class="space-y-2 mt-6">
                <button @click="activeTab = 'overview'"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                  :class="activeTab === 'overview'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
                  <Icon name="mdi:view-dashboard-outline" class="w-5 h-5" />
                  Overview
                </button>

                <button @click="activeTab = 'profile'"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                  :class="activeTab === 'profile'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
                  <Icon name="mdi:account-outline" class="w-5 h-5" />
                  Profile
                </button>

                <button @click="activeTab = 'address'"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                  :class="activeTab === 'address'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
                  <Icon name="mdi:map-marker-outline" class="w-5 h-5" />
                  Saved Addresses
                </button>

                <button @click="activeTab = 'security'"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                  :class="activeTab === 'security'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
                  <Icon name="mdi:lock-outline" class="w-5 h-5" />
                  Password & Security
                </button>

                <button @click="activeTab = 'orders'"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                  :class="activeTab === 'orders'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
                  <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
                  My Orders
                </button>
              </nav>
            </div>
          </aside>

          <!-- Main Workspace Tab Forms -->
          <main class="lg:col-span-8 xl:col-span-9">
            <UserOrderHistory v-if="activeTab === 'orders'" />

            <!-- Overview Pane -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
              <div class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
                <h2 class="text-2xl font-bold mb-2 text-text flex items-center gap-2">
                  Welcome back, {{ profileData.first_name || 'Guest' }}! 👋
                </h2>
                <p class="text-text opacity-70 text-sm mb-6">Here is an overview of your recent activity.</p>

                <!-- Quick Stats -->
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8">
                  <div class="bg-background rounded-2xl p-5 border border-border flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Icon name="mdi:package-variant" class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">Recent Orders</p>
                      <p class="text-2xl font-black text-text">{{ dashboardOrders.length }}</p>
                    </div>
                  </div>
                </div>

                <!-- Recent Orders -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-text">Recent Orders</h3>
                    <button @click="activeTab = 'orders'" class="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div v-if="loadingDashboard" class="flex justify-center py-8">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                  <div v-else-if="!dashboardOrders.length"
                    class="text-center py-8 bg-background border border-border rounded-2xl">
                    <p class="text-text opacity-50 text-sm">No recent orders found.</p>
                  </div>
                  <div v-else class="space-y-4">
                    <div v-for="order in dashboardOrders" :key="order.id"
                      class="bg-background border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p class="text-sm font-medium text-text">#{{ order.order_id || order.order_number || order.id
                          }}</p>
                          <p class="text-xs text-text opacity-60 mt-1">{{ formatDate(order.created_at) }}</p>
                        </div>
                        <div class="flex items-center gap-4">
                          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            :class="statusBadgeClass(order.status)">
                            {{ order.status }}
                          </span>
                          <p class="font-bold text-text whitespace-nowrap">₹{{ (order.total_price || order.total_amount
                            || 0).toLocaleString('en-IN') }}</p>
                        </div>
                      </div>
                      <div class="mt-4 pt-4 border-t border-border flex justify-end"
                        v-if="['PENDING', 'SHIPPED'].includes(order.status?.toUpperCase())">
                        <button @click="activeTab = 'orders'"
                          class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          <Icon name="mdi:truck-delivery-outline" /> Track Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Profile Form Pane -->
            <div v-if="activeTab === 'profile'"
              class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
              <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
                <Icon name="mdi:account-box-outline" class="text-primary w-6 h-6" /> Profile Details
              </h2>

              <form @submit.prevent="saveProfile" class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <!-- First Name -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">First
                      Name</label>
                    <div class="relative">
                      <Icon name="mdi:account-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.first_name" type="text" required placeholder="First Name"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Last
                      Name</label>
                    <div class="relative">
                      <Icon name="mdi:account-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.last_name" type="text" required placeholder="Last Name"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Phone
                      Number</label>
                    <div class="relative">
                      <Icon name="mdi:phone-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.phone" type="tel" maxlength="10"
                        @input="profileData.phone = filterDigits(profileData.phone, 10)" placeholder="10-digit number"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- Address Line 1 -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address
                      Line 1</label>
                    <div class="relative">
                      <Icon name="mdi:home-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.address_line_1" type="text" placeholder="Address Line 1"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- Address Line 2 -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address
                      Line 2</label>
                    <div class="relative">
                      <Icon name="mdi:home-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.address_line_2" type="text" placeholder="Address Line 2"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- City -->
                  <div>
                    <label
                      class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">City</label>
                    <div class="relative">
                      <Icon name="mdi:map-marker-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.city" type="text" placeholder="City"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- State -->
                  <div>
                    <label
                      class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">State</label>
                    <div class="relative">
                      <Icon name="mdi:map-outline"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.state" type="text" placeholder="State"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- Country -->
                  <div>
                    <label
                      class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Country</label>
                    <div class="relative">
                      <Icon name="mdi:earth"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.country" type="text" placeholder="Country"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>
                  <!-- Zip Code -->
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Zip
                      Code</label>
                    <div class="relative">
                      <Icon name="mdi:mailbox"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                      <input v-model="profileData.address.zip_code" type="text" placeholder="Zip Code"
                        class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    </div>
                  </div>

                  <!-- Email -->

                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Bio /
                    Description</label>
                  <textarea v-model="profileData.bio" rows="4" maxlength="500"
                    placeholder="Tell us a little bit about yourself..."
                    class="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text resize-none"></textarea>
                </div>

                <!-- Action button -->
                <div class="flex justify-end pt-4">
                  <button type="submit" :disabled="saving"
                    class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/20 transition-all h-12 px-8 flex items-center justify-center disabled:opacity-50">
                    <div class="absolute inset-0 bg-primary"></div>
                    <div class="relative z-10 flex items-center justify-center gap-2">
                      <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
                      <Icon v-else name="mdi:content-save-outline" class="w-5 h-5" />
                      Save Details
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <!-- Address Management Pane -->
            <div v-if="activeTab === 'address'" class="space-y-6">
              <div
                class="flex flex-wrap justify-between items-center gap-4 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-md rounded-[1.5rem] p-6">
                <div>
                  <h2 class="text-xl font-bold text-text flex items-center gap-2">
                    <Icon name="mdi:map-marker-radius" class="text-primary w-6 h-6" /> Shipping Addresses
                  </h2>
                  <p class="text-xs text-text opacity-60 mt-1">Add and manage multiple delivery locations.</p>
                </div>
                <button @click="openNewAddress"
                  class="px-5 py-2.5 rounded-xl bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm">
                  <Icon name="mdi:plus" class="w-4 h-4" /> Add New Address
                </button>
              </div>

              <!-- Loader -->
              <div v-if="loadingAddresses"
                class="flex flex-col items-center justify-center py-20 bg-card/60 border border-white/10 rounded-[2rem]">
                <div class="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
              </div>

              <!-- Empty address placeholder -->
              <div v-else-if="addresses.length === 0"
                class="text-center py-20 bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem]">
                <div
                  class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/10">
                  <Icon name="mdi:map-marker-off-outline" class="w-10 h-10 text-primary opacity-60" />
                </div>
                <h3 class="text-2xl font-bold text-text mb-2">No addresses saved</h3>
                <p class="text-text opacity-50 text-sm max-w-xs mx-auto">Please add a shipping address so you can place
                  orders smoothly.</p>
              </div>

              <!-- Addresses Grid -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div v-for="addr in addresses" :key="addr.id"
                  class="bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem] p-6 flex flex-col justify-between relative group hover:shadow-md transition-all duration-300">
                  <div>
                    <div class="flex justify-between items-start mb-4">
                      <span v-if="addr.is_default"
                        class="text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase border border-emerald-500/20">
                        Default
                      </span>
                      <span v-else class="h-4"></span>

                      <button @click="editAddress(addr)"
                        class="w-8 h-8 rounded-full bg-secondary/80 text-text/75 hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm">
                        <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                      </button>
                    </div>

                    <p class="font-bold text-lg text-text">{{ addr.address_line1 }}</p>
                    <p class="text-text opacity-60 text-sm mt-1" v-if="addr.address_line2">{{ addr.address_line2 }}</p>
                    <p class="text-text opacity-60 text-sm mt-1">
                      {{ addr.city }}, {{ addr.state }} - <span class="font-semibold text-text">{{ addr.pincode
                      }}</span>
                    </p>
                    <p class="text-text opacity-50 text-xs mt-2 uppercase tracking-widest font-bold">{{ addr.country }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password & Security Pane -->
            <div v-if="activeTab === 'security'"
              class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
              <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
                <Icon name="mdi:lock-check-outline" class="text-primary w-6 h-6" /> Change Password
              </h2>

              <form @submit.prevent="changePassword" class="space-y-6">
                <!-- Current password -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Current
                    Password</label>
                  <div class="relative">
                    <Icon name="mdi:lock-outline"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input v-model="pwdForm.current" :type="showCurrentPwd ? 'text' : 'password'" required
                      placeholder="Enter current password"
                      class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    <button type="button" @click="showCurrentPwd = !showCurrentPwd"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity">
                      <Icon :name="showCurrentPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- New password -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">New
                    Password</label>
                  <div class="relative">
                    <Icon name="mdi:lock-reset"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input v-model="pwdForm.new_password" :type="showNewPwd ? 'text' : 'password'" required
                      placeholder="Minimum 6 characters"
                      class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    <button type="button" @click="showNewPwd = !showNewPwd"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity">
                      <Icon :name="showNewPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Confirm password -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Confirm New
                    Password</label>
                  <div class="relative">
                    <Icon name="mdi:lock-check"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input v-model="pwdForm.confirm" :type="showConfirmPwd ? 'text' : 'password'" required
                      placeholder="Repeat new password"
                      class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                    <button type="button" @click="showConfirmPwd = !showConfirmPwd"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity">
                      <Icon :name="showConfirmPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Save button -->
                <div class="flex justify-end pt-4">
                  <button type="submit" :disabled="savingPwd"
                    class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/20 transition-all h-12 px-8 flex items-center justify-center disabled:opacity-50">
                    <div class="absolute inset-0 bg-primary"></div>
                    <div class="relative z-10 flex items-center justify-center gap-2">
                      <Icon v-if="savingPwd" name="mdi:loading" class="w-5 h-5 animate-spin" />
                      <Icon v-else name="mdi:key-change" class="w-5 h-5" />
                      Update Password
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </ClientOnly>
    </div>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="720" transition="dialog-bottom-transition">
      <v-card v-if="selectedOrder" class="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-background">

        <div class="px-8 py-8 md:px-12 md:py-10">
          <div class="flex justify-between items-start mb-10">
            <div>
              <p class="text-text opacity-50 font-medium mb-2 tracking-widest uppercase text-[10px]">Order Details</p>
              <h2 class="text-3xl font-light tracking-tight text-text mb-2">#{{ selectedOrder.order_number ||
                selectedOrder.id }}</h2>
              <p class="text-text opacity-70 font-medium tracking-wide text-sm">{{ formatDate(selectedOrder.created_at)
              }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              :class="statusBadgeClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="space-y-4 mb-10">
            <div v-for="item in selectedOrder.items" :key="item.id"
              class="flex gap-6 items-center p-4 rounded-2xl hover:bg-card transition-colors">
              <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 relative">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                  class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                <Icon v-else name="mdi:image-outline" class="w-8 h-8 absolute inset-0 m-auto text-text opacity-30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text truncate text-lg">{{ item.name }}</p>
                <p class="text-text opacity-70 text-sm font-medium tracking-wide mt-1">Qty: {{ item.quantity }} <span
                    class="mx-2 opacity-30">×</span> ₹{{ item.price?.toLocaleString('en-IN') }}</p>
              </div>
              <p class="font-light text-xl text-text whitespace-nowrap pl-4">₹{{ (item.price *
                item.quantity).toLocaleString('en-IN') }}</p>
            </div>
          </div>

          <v-divider class="my-8 opacity-50 dark:opacity-20 border-border" />

          <!-- Totals -->
          <div class="mb-10 pl-4 pr-4 md:pl-28">
            <div class="space-y-4 text-sm font-medium tracking-wide text-text opacity-80">
              <div class="flex justify-between items-center">
                <span>Subtotal</span>
                <span class="text-text">₹{{ selectedOrder.subtotal?.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="selectedOrder.discount" class="flex justify-between items-center text-primary">
                <span>Discount</span>
                <span>-₹{{ selectedOrder.discount?.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-border mt-4">
                <span class="font-bold uppercase tracking-widest text-[10px] text-text opacity-50">Total</span>
                <span class="text-3xl font-light text-text tracking-tight">₹{{
                  selectedOrder.total_amount?.toLocaleString('en-IN') }}</span>
              </div>
            </div>
          </div>

          <!-- Tracking Timeline -->
          <div v-if="tracking && tracking.tracking"
            class="bg-card rounded-3xl p-8 border border-border mb-10 relative overflow-hidden">
            <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium text-text opacity-70">Order Status:</span> <span class="font-bold ml-1">{{
                tracking.order_status }}</span></div>
              <div v-if="tracking.tracking.carrier"><span class="font-medium text-text opacity-70">Carrier:</span> <span
                  class="font-bold ml-1">{{ tracking.tracking.carrier }}</span></div>
              <div v-if="tracking.tracking.tracking_number"><span class="font-medium text-text opacity-70">Tracking
                  #:</span> <span class="font-bold ml-1">{{ tracking.tracking.tracking_number }}</span></div>
              <div v-if="tracking.tracking.tracking_url"><span class="font-medium text-text opacity-70">Tracking
                  Link:</span> <a :href="tracking.tracking.tracking_url" target="_blank"
                  class="text-primary hover:underline ml-1">View Details</a></div>
              <div v-if="tracking.tracking.shipped_at"><span class="font-medium text-text opacity-70">Shipped At:</span>
                <span class="font-bold ml-1">{{ formatDate(tracking.tracking.shipped_at) }}</span>
              </div>
              <div v-if="tracking.tracking.estimated_delivery"><span class="font-medium text-text opacity-70">Est.
                  Delivery:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.estimated_delivery)
                  }}</span></div>
              <div v-if="tracking.tracking.delivered_at"><span class="font-medium text-text opacity-70">Delivered
                  At:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.delivered_at) }}</span></div>
            </div>
            <div v-if="tracking.tracking.notes" class="mt-4 pt-4 border-t border-border">
              <span class="font-medium text-text opacity-70 block mb-1">Notes:</span>
              <p class="text-sm opacity-90">{{ tracking.tracking.notes }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <v-btn variant="text" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full"
              @click="detailDialog = false">
              Close
            </v-btn>
            <v-btn v-if="['pending', 'processing'].includes(selectedOrder.status?.toLowerCase())" color="error"
              variant="tonal" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium"
              :loadingDashboard="cancelling" @click="cancelOrder(selectedOrder.order_id)">
              Cancel Order
            </v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-white"
              :loadingDashboard="loadingDashboardTracking" @click="loadTracking(selectedOrder.id)">
              Track Package
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>


    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="720" transition="dialog-bottom-transition">
      <v-card v-if="selectedOrder" class="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-background">

        <div class="px-8 py-8 md:px-12 md:py-10">
          <div class="flex justify-between items-start mb-10">
            <div>
              <p class="text-text opacity-50 font-medium mb-2 tracking-widest uppercase text-[10px]">Order Details</p>
              <h2 class="text-3xl font-light tracking-tight text-text mb-2">#{{ selectedOrder.order_number ||
                selectedOrder.id }}</h2>
              <p class="text-text opacity-70 font-medium tracking-wide text-sm">{{ formatDate(selectedOrder.created_at)
              }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              :class="statusBadgeClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="space-y-4 mb-10">
            <div v-for="item in selectedOrder.items" :key="item.id"
              class="flex gap-6 items-center p-4 rounded-2xl hover:bg-card transition-colors">
              <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 relative">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                  class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                <Icon v-else name="mdi:image-outline" class="w-8 h-8 absolute inset-0 m-auto text-text opacity-30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text truncate text-lg">{{ item.name }}</p>
                <p class="text-text opacity-70 text-sm font-medium tracking-wide mt-1">Qty: {{ item.quantity }} <span
                    class="mx-2 opacity-30">×</span> ₹{{ item.price?.toLocaleString('en-IN') }}</p>
              </div>
              <p class="font-light text-xl text-text whitespace-nowrap pl-4">₹{{ (item.price *
                item.quantity).toLocaleString('en-IN') }}</p>
            </div>
          </div>

          <v-divider class="my-8 opacity-50 dark:opacity-20 border-border" />

          <!-- Totals -->
          <div class="mb-10 pl-4 pr-4 md:pl-28">
            <div class="space-y-4 text-sm font-medium tracking-wide text-text opacity-80">
              <div class="flex justify-between items-center">
                <span>Subtotal</span>
                <span class="text-text">₹{{ selectedOrder.subtotal?.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="selectedOrder.discount" class="flex justify-between items-center text-primary">
                <span>Discount</span>
                <span>-₹{{ selectedOrder.discount?.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-border mt-4">
                <span class="font-bold uppercase tracking-widest text-[10px] text-text opacity-50">Total</span>
                <span class="text-3xl font-light text-text tracking-tight">₹{{
                  selectedOrder.total_amount?.toLocaleString('en-IN') }}</span>
              </div>
            </div>
          </div>

          <!-- Tracking Timeline -->
          <div v-if="tracking && tracking.tracking"
            class="bg-card rounded-3xl p-8 border border-border mb-10 relative overflow-hidden">
            <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium text-text opacity-70">Order Status:</span> <span class="font-bold ml-1">{{
                tracking.order_status }}</span></div>
              <div v-if="tracking.tracking.carrier"><span class="font-medium text-text opacity-70">Carrier:</span> <span
                  class="font-bold ml-1">{{ tracking.tracking.carrier }}</span></div>
              <div v-if="tracking.tracking.tracking_number"><span class="font-medium text-text opacity-70">Tracking
                  #:</span> <span class="font-bold ml-1">{{ tracking.tracking.tracking_number }}</span></div>
              <div v-if="tracking.tracking.tracking_url"><span class="font-medium text-text opacity-70">Tracking
                  Link:</span> <a :href="tracking.tracking.tracking_url" target="_blank"
                  class="text-primary hover:underline ml-1">View Details</a></div>
              <div v-if="tracking.tracking.shipped_at"><span class="font-medium text-text opacity-70">Shipped At:</span>
                <span class="font-bold ml-1">{{ formatDate(tracking.tracking.shipped_at) }}</span>
              </div>
              <div v-if="tracking.tracking.estimated_delivery"><span class="font-medium text-text opacity-70">Est.
                  Delivery:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.estimated_delivery)
                  }}</span></div>
              <div v-if="tracking.tracking.delivered_at"><span class="font-medium text-text opacity-70">Delivered
                  At:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.delivered_at) }}</span></div>
            </div>
            <div v-if="tracking.tracking.notes" class="mt-4 pt-4 border-t border-border">
              <span class="font-medium text-text opacity-70 block mb-1">Notes:</span>
              <p class="text-sm opacity-90">{{ tracking.tracking.notes }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <v-btn variant="text" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full"
              @click="detailDialog = false">
              Close
            </v-btn>
            <v-btn v-if="['pending', 'processing'].includes(selectedOrder.status?.toLowerCase())" color="error"
              variant="tonal" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium"
              :loadingDashboard="cancelling" @click="cancelOrder(selectedOrder.order_id)">
              Cancel Order
            </v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-white"
              :loadingDashboard="loadingDashboardTracking" @click="loadTracking(selectedOrder.id)">
              Track Package
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>


    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="720" transition="dialog-bottom-transition">
      <v-card v-if="selectedOrder" class="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-background">

        <div class="px-8 py-8 md:px-12 md:py-10">
          <div class="flex justify-between items-start mb-10">
            <div>
              <p class="text-text opacity-50 font-medium mb-2 tracking-widest uppercase text-[10px]">Order Details</p>
              <h2 class="text-3xl font-light tracking-tight text-text mb-2">#{{ selectedOrder.order_number ||
                selectedOrder.id }}</h2>
              <p class="text-text opacity-70 font-medium tracking-wide text-sm">{{ formatDate(selectedOrder.created_at)
              }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              :class="statusBadgeClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="space-y-4 mb-10">
            <div v-for="item in selectedOrder.items" :key="item.id"
              class="flex gap-6 items-center p-4 rounded-2xl hover:bg-card transition-colors">
              <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 relative">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                  class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                <Icon v-else name="mdi:image-outline" class="w-8 h-8 absolute inset-0 m-auto text-text opacity-30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text truncate text-lg">{{ item.name }}</p>
                <p class="text-text opacity-70 text-sm font-medium tracking-wide mt-1">Qty: {{ item.quantity }} <span
                    class="mx-2 opacity-30">×</span> ₹{{ item.price?.toLocaleString('en-IN') }}</p>
              </div>
              <p class="font-light text-xl text-text whitespace-nowrap pl-4">₹{{ (item.price *
                item.quantity).toLocaleString('en-IN') }}</p>
            </div>
          </div>

          <v-divider class="my-8 opacity-50 dark:opacity-20 border-border" />

          <!-- Totals -->
          <div class="mb-10 pl-4 pr-4 md:pl-28">
            <div class="space-y-4 text-sm font-medium tracking-wide text-text opacity-80">
              <div class="flex justify-between items-center">
                <span>Subtotal</span>
                <span class="text-text">₹{{ selectedOrder.subtotal?.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="selectedOrder.discount" class="flex justify-between items-center text-primary">
                <span>Discount</span>
                <span>-₹{{ selectedOrder.discount?.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-border mt-4">
                <span class="font-bold uppercase tracking-widest text-[10px] text-text opacity-50">Total</span>
                <span class="text-3xl font-light text-text tracking-tight">₹{{
                  selectedOrder.total_amount?.toLocaleString('en-IN') }}</span>
              </div>
            </div>
          </div>

          <!-- Tracking Timeline -->
          <div v-if="tracking && tracking.tracking"
            class="bg-card rounded-3xl p-8 border border-border mb-10 relative overflow-hidden">
            <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium text-text opacity-70">Order Status:</span> <span class="font-bold ml-1">{{
                tracking.order_status }}</span></div>
              <div v-if="tracking.tracking.carrier"><span class="font-medium text-text opacity-70">Carrier:</span> <span
                  class="font-bold ml-1">{{ tracking.tracking.carrier }}</span></div>
              <div v-if="tracking.tracking.tracking_number"><span class="font-medium text-text opacity-70">Tracking
                  #:</span> <span class="font-bold ml-1">{{ tracking.tracking.tracking_number }}</span></div>
              <div v-if="tracking.tracking.tracking_url"><span class="font-medium text-text opacity-70">Tracking
                  Link:</span> <a :href="tracking.tracking.tracking_url" target="_blank"
                  class="text-primary hover:underline ml-1">View Details</a></div>
              <div v-if="tracking.tracking.shipped_at"><span class="font-medium text-text opacity-70">Shipped At:</span>
                <span class="font-bold ml-1">{{ formatDate(tracking.tracking.shipped_at) }}</span>
              </div>
              <div v-if="tracking.tracking.estimated_delivery"><span class="font-medium text-text opacity-70">Est.
                  Delivery:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.estimated_delivery)
                  }}</span></div>
              <div v-if="tracking.tracking.delivered_at"><span class="font-medium text-text opacity-70">Delivered
                  At:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.delivered_at) }}</span></div>
            </div>
            <div v-if="tracking.tracking.notes" class="mt-4 pt-4 border-t border-border">
              <span class="font-medium text-text opacity-70 block mb-1">Notes:</span>
              <p class="text-sm opacity-90">{{ tracking.tracking.notes }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <v-btn variant="text" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full"
              @click="detailDialog = false">
              Close
            </v-btn>
            <v-btn v-if="['pending', 'processing'].includes(selectedOrder.status?.toLowerCase())" color="error"
              variant="tonal" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium"
              :loadingDashboard="cancelling" @click="cancelOrder(selectedOrder.order_id)">
              Cancel Order
            </v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" size="x-large"
              class="flex-1 text-none tracking-widest font-medium text-white"
              :loadingDashboard="loadingDashboardTracking" @click="loadTracking(selectedOrder.id)">
              Track Package
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>


    <!-- Address Dialog Modal overlay -->
    <div v-if="showAddressDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
      @click.self="showAddressDialog = false">
      <div
        class="bg-card border border-white/20 rounded-[2rem] shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto relative animate-[scaleIn_0.3s_ease-out]">
        <!-- Close button -->
        <button @click="showAddressDialog = false"
          class="absolute right-6 top-6 w-8 h-8 rounded-full bg-secondary/80 text-text/80 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>

        <h3 class="text-2xl font-extrabold text-text mb-6">
          {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
        </h3>

        <form @submit.prevent="saveAddress" class="space-y-4">
          <!-- Line 1 -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line
              1</label>
            <input v-model="addressForm.address_line1" type="text" required maxlength="255"
              placeholder="House, Flat no, Building, Street"
              class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
          </div>

          <!-- Line 2 -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line 2
              (optional)</label>
            <input v-model="addressForm.address_line2" type="text" maxlength="255"
              placeholder="Apartment, Colony, Area, LandMark"
              class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
          </div>

          <!-- Grid row: City, State -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">City</label>
              <input v-model="addressForm.city" type="text" required maxlength="100" placeholder="City"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">State</label>
              <input v-model="addressForm.state" type="text" required maxlength="100" placeholder="State"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
            </div>
          </div>

          <!-- Grid row: Country, Pincode -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Country</label>
              <input v-model="addressForm.country" type="text" required maxlength="100" placeholder="India"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Pincode</label>
              <input v-model="addressForm.pincode" type="text" required maxlength="6"
                @input="addressForm.pincode = filterDigits(addressForm.pincode, 6)" placeholder="6-digit pincode"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
            </div>
          </div>

          <!-- Checkbox default -->
          <div class="flex items-center gap-2 pt-2">
            <input v-model="addressForm.is_default" type="checkbox" id="is_default_idx"
              class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/30" />
            <label for="is_default_idx" class="text-sm font-bold text-text opacity-70 cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <!-- Footer save -->
          <div class="flex gap-4 pt-6">
            <button type="button" @click="showAddressDialog = false"
              class="flex-1 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase bg-secondary text-text/70 hover:bg-secondary/80 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="savingAddress"
              class="flex-1 relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 transition-all h-12 flex items-center justify-center disabled:opacity-50">
              <div class="absolute inset-0 bg-primary"></div>
              <div class="relative z-10 flex items-center justify-center gap-2">
                <Icon v-if="savingAddress" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <Icon v-else name="mdi:content-save" class="w-5 h-5" />
                Save Address
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useDebounceFn } from '@vueuse/core';

const page = ref(1)
const totalPages = ref(1)
const search = ref('')
const statusFilter = ref(null)
const detailDialog = ref(false)
const selectedOrder = ref(null)
const tracking = ref(null)
const cancelling = ref(false)
const loadingTracking = ref(false)

const statusOptions = ['pending', 'shipped', 'delivered', 'canceled']

const debouncedFetch = useDebounceFn(() => { fetchOrders() }, 400)

const fetchOrders = async () => {
  loadingDashboard.value = true
  try {
    const { getOrders } = useOrders()
    const res = await getOrders({ page: page.value, per_page: 10, search: search.value, status: statusFilter.value })

    const rawOrders = Array.isArray(res?.data) ? res.data : (res?.data?.items || [])
    dashboardOrders.value = rawOrders.map(order => {
      let computedSubtotal = 0
      let computedDiscount = 0

      const mappedItems = (order.items || order.order_items || []).map(item => {
        const finalPrice = item.price || item.price_per_unit || 0
        const discountPct = item.product?.discount_percentage || 0
        const originalPrice = discountPct > 0 ? (finalPrice / (1 - discountPct / 100)) : finalPrice

        computedSubtotal += originalPrice * item.quantity
        computedDiscount += (originalPrice - finalPrice) * item.quantity

        return {
          ...item,
          price: finalPrice,
          name: item.product_name_snapshot || item.product?.product_name || item.name || `Product #${item.product_id}`,
          image_url: item.product?.images?.[0]?.url || item.product?.images?.[0]?.image_url || item.product?.images?.[0] || item.image_url || null
        }
      })

      const totalAmount = order.total_price || order.total_amount || 0

      return {
        ...order,
        order_number: order.order_number || order.order_id || `ord_${order.id}`,
        items: mappedItems,
        total_amount: totalAmount,
        subtotal: computedSubtotal > totalAmount ? computedSubtotal : totalAmount,
        discount: computedDiscount > 0 ? computedDiscount : (order.discount || 0)
      }
    })

    const totalItems = res?.total || res?.data?.total || rawOrders.length
    totalPages.value = Math.ceil(totalItems / 10) || 1
  } catch (err) {
    console.error(err)
  }
  finally { loadingDashboard.value = false }
}

const viewOrder = async (order) => {
  selectedOrder.value = order
  tracking.value = null
  detailDialog.value = true
}

const loadTracking = async (order_id) => {
  loadingTracking.value = true
  try {
    const { trackOrder } = useOrders()
    const orderId = selectedOrder.value?.order_id || order_id
    const res = await trackOrder(orderId)
    tracking.value = res?.data || {}
  } catch {
    // silently fail
  } finally {
    loadingTracking.value = false
  }
}

const cancelOrder = async (order_id) => {
  cancelling.value = true
  try {
    const { cancelOrder: doCancel } = useOrders()
    await doCancel(order_id)
    detailDialog.value = false
    fetchOrders()
  } catch { }
  finally { cancelling.value = false }
}

watch(statusFilter, fetchOrders)

const loadDashboardData = async () => {
  await fetchOrders()
}







import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import { useValidation } from '~/composables/useValidation'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'
import { useOrders } from '~/composables/useOrders'
import { useCart } from '~/composables/useCart'

definePageMeta({
  title: 'User Dashboard',
  description: 'Manage your user profile',
  middleware: ['auth-role'],
  role: ['User', 'ADMIN'],
  layout: 'default'
})

const authStore = useAuthStore()
const { validEmail } = useValidation()

const route = useRoute()
const activeTab = ref(route.query.tab || 'overview')
const saving = ref(false)
const savingAddress = ref(false)
const savingPwd = ref(false)
const loadingAddresses = ref(false)
const showAddressDialog = ref(false)
const editingAddress = ref(null)
const fileInput = ref(null)
const addresses = ref([])
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const loadingDashboard = ref(false)
const dashboardOrders = ref([])
const dashboardWishlistCount = ref(0)

const statusBadgeClass = (s) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50',
    processing: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border border-sky-200/50',
    shipped: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200/50',
    delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200/50'
  }
  return map[s?.toLowerCase()] || 'bg-secondary text-text opacity-80 border border-border'
}

const formatDate = (d) => d ? dayjs(d).format('MMM DD, YYYY') : 'N/A'

const profileData = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  phone: authStore.user?.phone || '',
  username: authStore.user?.username || '',
  bio: authStore.user?.bio || '',
  url: authStore.user?.url || '',
  avatar_url: authStore.user?.url || '',
  address: {
    address_line_1: '',
    address_line_2: '',
    country: '',
    state: '',
    city: '',
    zip_code: ''
  }
})
const addressForm = ref({ address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false })
const pwdForm = ref({ current: '', new_password: '', confirm: '' })

const triggerUpload = () => fileInput.value?.click()

const filterDigits = (val, maxLen) => {
  if (!val) return ''
  const digits = val.replace(/\D/g, '')
  return digits.substring(0, maxLen)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const { updateProfileImage } = useProfile()
    await updateProfileImage(file)
    await loadProfile()
  } catch {
    // toast.error('Failed to upload photo')
  }
}

const loadProfile = async () => {
  try {
    // Fetch fresh user account details
    const { getAuthMe } = useProfile()
    const meRes = await getAuthMe()
    if (meRes?.data) {
      Object.assign(profileData.value, {
        first_name: meRes.data.first_name || '',
        last_name: meRes.data.last_name || '',
        phone: meRes.data.phone || '',
        username: meRes.data.username || '',
        bio: meRes.data.bio || '',
        url: meRes.data.url || '',
        avatar_url: meRes.data.url || '',
        address: {
          address_line_1: meRes.data.address?.[0]?.address_line_1 || '',
          address_line_2: meRes.data.address?.[0]?.address_line_2 || '',
          country: meRes.data.address?.[0]?.country || '',
          state: meRes.data.address?.[0]?.state || '',
          city: meRes.data.address?.[0]?.city || '',
          zip_code: meRes.data.address?.[0]?.zip_code || ''
        }
      })
    }
    // Then fetch profile (image) data
    const { getProfile } = useProfile()
    const res = await getProfile()
    if (res?.data) {
      const { url, ...rest } = res.data
      Object.assign(profileData.value, { ...rest, avatar_url: url, url: url })
    }
  } catch {
    // silently fail
  }
}

const loadAddresses = async () => {
  loadingAddresses.value = true
  try {
    const { getAddresses } = useAddress()
    const res = await getAddresses()
    addresses.value = res?.data || []
  } catch {
    toast.error('Failed to load addresses')
  } finally {
    loadingAddresses.value = false
  }
}

const saveProfile = async () => {
  if (!profileData.value.first_name?.trim() || !profileData.value.last_name?.trim()) {
    return toast.error('First and Last name are required')
  }
  if (profileData.value.username && !validEmail(profileData.value.username)) {
    return toast.error('Please enter a valid username address')
  }
  if (profileData.value.phone && profileData.value.phone.length !== 10) {
    return toast.error('Phone number must be exactly 10 digits')
  }

  saving.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({
      first_name: profileData.value.first_name,
      last_name: profileData.value.last_name,
      phone: profileData.value.phone,
      username: profileData.value.username,
      bio: profileData.value.bio,
      address: {
        address_line_1: profileData.value.address.address_line_1,
        address_line_2: profileData.value.address.address_line_2,
        country: profileData.value.address.country,
        state: profileData.value.address.state,
        city: profileData.value.address.city,
        zip_code: profileData.value.address.zip_code
      }
    })
    // Reload fresh data
    await loadProfile()
    toast.success('Profile details updated successfully!')
  } catch {
    toast.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const openNewAddress = () => {
  editingAddress.value = null
  addressForm.value = { address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false }
  showAddressDialog.value = true
}

const editAddress = (addr) => {
  editingAddress.value = addr
  Object.assign(addressForm.value, addr)
  showAddressDialog.value = true
}

const saveAddress = async () => {
  if (!addressForm.value.address_line1?.trim()) {
    return toast.error('Address Line 1 is required')
  }
  if (!addressForm.value.city?.trim() || !addressForm.value.state?.trim()) {
    return toast.error('City and State are required')
  }
  if (!addressForm.value.pincode || addressForm.value.pincode.length !== 6) {
    return toast.error('Pincode must be exactly 6 digits')
  }

  savingAddress.value = true
  try {
    const { addAddress, updateAddress } = useAddress()
    if (editingAddress.value) {
      await updateAddress({ ...addressForm.value, id: editingAddress.value.id })
    } else {
      await addAddress(addressForm.value)
    }
    toast.success('Address saved successfully!')
    showAddressDialog.value = false
    editingAddress.value = null
    loadAddresses()
  } catch {
    toast.error('Failed to save address')
  } finally {
    savingAddress.value = false
  }
}

const changePassword = async () => {
  if (!pwdForm.value.current || !pwdForm.value.new_password) {
    return toast.error('Please fill in all password fields')
  }
  if (pwdForm.value.new_password.length < 6) {
    return toast.error('New password must be at least 6 characters long')
  }
  if (pwdForm.value.new_password !== pwdForm.value.confirm) {
    return toast.error('Passwords do not match')
  }

  savingPwd.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({ current_password: pwdForm.value.current, new_password: pwdForm.value.new_password })
    toast.success('Password changed successfully!')
    pwdForm.value = { current: '', new_password: '', confirm: '' }
  } catch {
    toast.error('Failed to change password. Check your current password.')
  } finally {
    savingPwd.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
  loadDashboardData()
})
</script>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
