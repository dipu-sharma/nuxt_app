export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const baseUrl = (config.public.API_BASE_URL || 'http://localhost:8000') as string
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${cleanBaseUrl}${cleanUrl}`
  }
  return { getImageUrl }
}
