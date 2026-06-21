export const noLeadingSpace = (v) => !v || (typeof v === 'string' && !v.startsWith(' ')) || 'Cannot start with space'
export const exactLength = (len, msg) => (v) => !v || (typeof v === 'string' && v.length === len) || msg
export const digitsOnly = (v) => !v || /^\d+$/.test(v) || 'Must contain only digits'
export const isPhone = (v) => !v || /^\d{10}$/.test(v) || 'Phone number must be exactly 10 digits'
export const isPincode = (v) => !v || /^\d{6}$/.test(v) || 'Postal code must be exactly 6 digits'

export const filterDigits = (v, maxLen) => {
    if (!v) return ''
    const digits = v.toString().replace(/\D/g, '')
    return maxLen ? digits.slice(0, maxLen) : digits
}
