export const useSSO = () => {
	const config = useRuntimeConfig()

	const handleGoogleLogin = () => {
		if (!import.meta.client) return
		const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${config.public.GOOGLE_CLIENT_ID}&redirect_uri=${config.public.APP_URL}/sso/google&scope=email profile`
		window.location.href = googleLoginUrl
	}

	const handleFacebookLogin = () => {
		if (!import.meta.client) return
		const facebookLoginUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${config.public.FACEBOOK_CLIENT_ID}&redirect_uri=${config.public.APP_URL}/sso/facebook&scope=email`
		window.location.href = facebookLoginUrl
	}

	return {
		handleGoogleLogin,
		handleFacebookLogin,
	}
}
