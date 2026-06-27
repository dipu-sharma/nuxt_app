import { resolve, extname } from 'path'
import { promises as fs } from 'fs'


// Simple MIME type mapping
const mimeTypes = {
	'.js': 'application/javascript',
	'.css': 'text/css',
	'.html': 'text/html',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.eot': 'application/vnd.ms-fontobject',
	'.otf': 'font/otf',
}

export default defineEventHandler(async (event) => {
	const req = event.node.req
	const res = event.node.res

	const acceptEncoding = req.headers['accept-encoding'] || ''
	const url = req.url ? req.url.split('?')[0] : '' // Remove query params

	// Only process requests for static assets that Nuxt builds, usually under /_nuxt/
	// You might need to adjust this condition based on where your compressed assets are located
	if (url.startsWith('/_nuxt/') || url.match(/\.(js|css|json|html|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|otf)$/)) {
		// Resolve the absolute path to the potential uncompressed file in the build output
		const buildOutputPath = resolve(process.cwd(), '.output', 'public')
		const originalFilePath = resolve(buildOutputPath, url.substring(1)) // Remove leading slash

		let compressedFilePath = ''
		let contentEncoding = ''
		let fileExtension = extname(url) || '.html' // Default to .html if no extension

		// Prefer Brotli if supported and .br file exists
		if (acceptEncoding.includes('br')) {
			try {
				await fs.access(originalFilePath + '.br') // Check if .br file exists
				compressedFilePath = originalFilePath + '.br'
				contentEncoding = 'br'
			} catch (e) {
				// .br file does not exist, fall back to gzip
			}
		}

		// Fallback to Gzip if Brotli not available/supported and .gz file exists
		if (!compressedFilePath && acceptEncoding.includes('gzip')) {
			try {
				await fs.access(originalFilePath + '.gz') // Check if .gz file exists
				compressedFilePath = originalFilePath + '.gz'
				contentEncoding = 'gzip'
			} catch (e) {
				// .gz file does not exist
			}
		}

		if (compressedFilePath) {
			try {
				const fileContent = await fs.readFile(compressedFilePath)
				res.setHeader('Content-Encoding', contentEncoding)
				res.setHeader('Content-Type', mimeTypes[fileExtension] || 'application/octet-stream')
				res.setHeader('Vary', 'Accept-Encoding') // Important for caching
				res.end(fileContent)
				return // Stop processing this event
			} catch (e) {
				// Error reading compressed file, let Nuxt handle the original file
				console.error(`Error serving compressed file ${compressedFilePath}:`, e)
			}
		}
	}
})