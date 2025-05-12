import writeXlsxFile from 'write-excel-file'

export const useExcel = () => {
	const convertToExcel = async (
		excelData,
		no_download = false,
		file_name = 'template.xlsx',
		multiSheet = false,
	) => {
		const roleOptions = ['Admin', 'Approver', 'Approver_And_Initiator']

		let excelConfig = []

		if (!multiSheet) {
			// Prepare headers
			const headers = Object.keys(excelData[0] || {})
			const headerRow = headers.map((header) => ({
				value: header,
				fontWeight: 'bold',
				backgroundColor: '#f0f0f0',
			}))

			// Prepare data rows
			const dataRows = excelData.map((row) => {
				return headers.map((header) => {
					if (header === 'Role') {
						return {
							value: row[header],
							dataValidation: {
								type: 'list',
								allowBlank: true,
								showInputMessage: true,
								prompt: 'Please select a role',
								formulae: [roleOptions],
							},
						}
					}
					return { value: row[header] }
				})
			})

			excelConfig = [headerRow, ...dataRows]
		} else {
			console.warn('Multi-sheet export not fully supported with write-excel-file in browser context')
			excelConfig = []
			for (const [sheetName, sheetData] of Object.entries(excelData)) {
				const headers = Object.keys(sheetData[0] || {})
				const headerRow = headers.map((header) => ({
					value: header,
					fontWeight: 'bold',
				}))

				const dataRows = sheetData.map((row) => {
					return headers.map((header) => ({ value: row[header] }))
				})

				excelConfig = [...excelConfig, ...dataRows]
			}
		}

		try {
			if (!no_download) {
				await writeXlsxFile(excelConfig, {
					fileName: file_name,
					getHeaderStyle: {
						backgroundColor: '#eeeeee',
						fontWeight: 'bold',
						stickyRowsCount: 1,
					},
				})
			} else {
				const blob = await writeXlsxFile.toBlob(excelConfig, {
					getHeaderStyle: {
						backgroundColor: '#eeeeee',
						fontWeight: 'bold',
					},
				})
				return blob
			}
		} catch (error) {
			console.error('Error generating Excel file:', error)
			throw error
		}
	}

	const transformJSON = (arrayData, renameMap) => {
		if (!arrayData || !arrayData?.length) return []

		const headers = arrayData[0]
		const rows = arrayData.slice(1)

		return rows.map((row) => {
			const rowObject = {}
			headers.forEach((header, index) => {
				const key = renameMap[header] || header // Use the renamed key if available
				rowObject[key] = row[index]
			})
			return rowObject
		})
	}

	const convertToJSON = async (excel_file, renameMap) => {
		try {
			// Create a FileReader to read the file
			const fileReader = new FileReader()

			return new Promise((resolve, reject) => {
				fileReader.onload = (event) => {
					try {
						// Parse the Excel data
						const excel_data = new Uint8Array(event.target.result)
						const workbook = read(excel_data, { type: 'array' })

						// Convert the first sheet to JSON
						const firstSheetName = workbook.SheetNames[0]
						const worksheet = workbook.Sheets[firstSheetName]
						const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

						resolve(transformJSON(jsonData, renameMap))
					} catch (error) {
						reject(`Error parsing Excel file: ${error.message}`)
					}
				}

				fileReader.onerror = (error) => {
					reject(`Error reading file: ${error.message}`)
				}

				// Read the file as an array buffer
				fileReader.readAsArrayBuffer(excel_file)
			})
		} catch (error) {
			console.error('Error reading Excel file:', error)
			throw error
		}
	}

	return {
		convertToJSON,
		convertToExcel,
	}
}
