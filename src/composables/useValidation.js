export const useValidation = () => {
	const required = (v) => {
		if (v === null || v === undefined) {
			return 'This is required'
		}

		if (Array.isArray(v)) {
			return (
				(v.length > 0 && v.every((item) => item !== null && item !== undefined && item !== '')) ||
				'This is required'
			)
		} else if (typeof v === 'object') {
			return (
				Object.values(v).every((value) => value !== null && value !== undefined && value !== '') ||
				'This is required'
			)
		}

		return (typeof v === 'string' ? v.trim() : v) !== '' || 'This is required'
	}
	const noSpaces = (value) => {
		if (value === null || value === undefined || value === '') {
			return 'Input cannot be empty or only spaces'
		}
		return value.trim().length > 0 || 'Input cannot be empty or only spaces'
	}
	const mobileNumber = (value) => /^\d{10}$/.test(value) || 'Mobile number must be exactly 10 digits'
	const validEmail = (value) =>
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) || 'Enter a valid email address'
	const email = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'
	const phoneNumber = (v) => /^\d{10}$/.test(v) || 'Phone number must be 10 digits'
	const pincode = (v) => /^\d{6}$/.test(v) || 'Invalid pincode'
	const name = (v) => /^[a-zA-Z\s'-]+$/.test(v) || 'Enter valid Name'
	const capitalize = (str) => {
		if (!str) return ''
		return str.trim().charAt(0).toUpperCase() + str.trim().slice(1)
	}
	const onlyNumbers = (value) => /^\d*$/.test(value) || 'Only numbers are allowed'

	const onlyPositiveNumbers = (value) => /^[1-9]\d*$/.test(value) || 'Enter Positive numbers'

	const onlyCharacters = (value) => /^[a-zA-Z\s'-]+$/.test(value) || 'Only characters are allowed'

	const onlyNumberKey = (event) => {
		if (!/^\d$/.test(event.key)) {
			event.preventDefault()
		}
	}
	const fullCapitalize = (str) => {
		if (!str) return ''
		return str
			.trim()
			.split(' ')
			.map((word) => capitalize(word))
			.join(' ')
	}

	const filterNullValues = (obj) => {
		if (obj === null || typeof obj !== 'object') {
			return obj
		}
		if (Array.isArray(obj)) {
			return obj.map((item) => filterNullValues(item))
		}
		return Object.fromEntries(
			Object.entries(obj)
				.filter(([_, v]) => v !== null && v !== undefined && v !== '')
				.map(([k, v]) => [k, filterNullValues(v)]),
		)
	}

	const formatToINR = (value) => {
		if (!value) return '₹0'
		const num = parseFloat(value.toString().replace(/,/g, ''))
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		}).format(num)
	}

	return {
		name,
		email,
		required,
		phoneNumber,
		pincode,
		fullCapitalize,
		onlyPositiveNumbers,
		capitalize,
		onlyNumbers,
		onlyNumberKey,
		onlyCharacters,
		validEmail,
		noSpaces,
		mobileNumber,
		filterNullValues,
		formatToINR,
	}
}
