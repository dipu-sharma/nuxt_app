<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Review Moderation</h1>
        <p class="text-slate-500 text-sm mt-1">Manage customer reviews</p>
      </div>
    </div>

    <!-- Status Filter Tabs -->
    <v-tabs v-model="statusTab" color="primary" class="mb-6">
      <v-tab value="all">All</v-tab>
      <v-tab value="pending">Pending</v-tab>
      <v-tab value="approved">Approved</v-tab>
    </v-tabs>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

    <div v-else class="space-y-4">
      <v-card v-for="review in reviews" :key="review.id" rounded="xl" class="pa-5">
        <div class="flex gap-4">
          <v-avatar color="primary" size="44">
            <span class="text-white font-bold">{{ review.user_name?.[0]?.toUpperCase() || 'U' }}</span>
          </v-avatar>
          <div class="flex-1">
            <div class="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p class="font-semibold">{{ review.user_name || 'Anonymous' }}</p>
                <p class="text-slate-500 text-sm">{{ review.product_name }}</p>
              </div>
              <div class="flex items-center gap-2">
                <v-rating :model-value="review.rating" density="compact" color="amber" readonly size="small" />
                <v-chip :color="review.is_approved ? 'success' : 'warning'" size="small" variant="flat">
                  {{ review.is_approved ? 'Approved' : 'Pending' }}
                </v-chip>
              </div>
            </div>
            <p class="text-slate-700 mt-3 leading-relaxed">{{ review.comment }}</p>
            <p class="text-slate-400 text-xs mt-2">{{ formatDate(review.created_at) }}</p>
            <div class="flex gap-2 mt-3">
              <v-btn v-if="!review.is_approved" size="small" color="success" variant="outlined" rounded
                :loading="approving === review.id" @click="approve(review)">
                <Icon name="mdi:check" class="mr-1" /> Approve
              </v-btn>
              <v-btn size="small" color="error" variant="outlined" rounded
                :loading="deleting === review.id" @click="remove(review)">
                <Icon name="mdi:trash-can-outline" class="mr-1" /> Delete
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>

      <div v-if="!reviews.length" class="text-center py-16 text-slate-400">
        <Icon name="mdi:comment-outline" class="w-12 h-12 mb-3 mx-auto" />
        <p>No reviews found for this filter.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

definePageMeta({ title: 'Review Moderation', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const approving = ref(null)
const deleting = ref(null)
const reviews = ref([])
const statusTab = ref('all')

const formatDate = (d) => dayjs(d).format('DD MMM YYYY, hh:mm A')

const fetch = async () => {
  loading.value = true
  try {
    const { getAdminReviews } = useReviews()
    const params = statusTab.value !== 'all' ? { status: statusTab.value } : {}
    const res = await getAdminReviews(params)
    reviews.value = res?.data?.items || res?.data || []
  } catch { toast.error('Failed to load reviews') }
  finally { loading.value = false }
}

const approve = async (review) => {
  approving.value = review.id
  try {
    const { approveReview } = useReviews()
    await approveReview(review.id)
    review.is_approved = true
    toast.success('Review approved!')
  } catch { toast.error('Failed to approve review') }
  finally { approving.value = null }
}

const remove = async (review) => {
  deleting.value = review.id
  try {
    const { deleteAdminReview } = useReviews()
    await deleteAdminReview(review.id)
    reviews.value = reviews.value.filter(r => r.id !== review.id)
    toast.success('Review deleted!')
  } catch { toast.error('Failed to delete review') }
  finally { deleting.value = null }
}

watch(statusTab, fetch)
onMounted(fetch)
</script>
