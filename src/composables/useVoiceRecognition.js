export const useVoiceRecognition = () => {
	const isListening = ref(false)
	const isSupported = ref(true)
	const error = ref('')
	const transcript = ref('')
	const activeField = ref(null)
	let recognition = null

	const startListening = (fieldName = null) => {
		if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
			isSupported.value = false
			error.value = 'Speech recognition not supported in your browser'
			return
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		recognition = new SpeechRecognition()

		isListening.value = true
		activeField.value = fieldName
		transcript.value = ''

		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = 'en-US'

		recognition.onresult = (event) => {
			const results = Array.from(event.results)
			transcript.value = results[results.length - 1][0].transcript
		}

		recognition.onerror = (event) => {
			error.value = 'Error: ' + event.error
			stopListening()
		}

		recognition.start()
	}

	const stopListening = () => {
		if (recognition) {
			recognition.stop()
		}
		isListening.value = false
		return transcript.value
	}

	return {
		isListening,
		isSupported,
		error,
		transcript,
		activeField,
		startListening,
		stopListening,
	}
}
