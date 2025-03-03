import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjsBusinessDays from 'dayjs-business-days2'
dayjs.extend(relativeTime)
if (import.meta.client) {
	dayjs.extend(dayjsBusinessDays)
}

export const date_to_string = (date: any, format: string = 'YYYY-MM-DD') => {
	if (!date || !dayjs(date).isValid()) {
		throw new Error('Invalid date')
	}
	return dayjs(date).format(format)
}
// user example  const formattedDate = date_to_string(new Date(), "DD/MM/YYYY");

export const date_to_string_with_month_name = (date: any) => {
	if (!date) return ''
	return dayjs(date).format('YYYY MMM DD')
}

export const calculate_date = (start_date: any, end_date: any) => {
	if (start_date && end_date) {
		const relativeDifference = start_date.from(end_date)
		console.log(relativeDifference)
		return relativeDifference
	} else {
		return null
	}
}

export const input_date = () => {
	let data = dayjs.getWorkingWeekdays()
	//   let add_date = dayjs(`2020-12-24`).businessDaysAdd(1).format(`DD/MM/YYYY`);
	console.log('Data____________________', data)
	return data
}
