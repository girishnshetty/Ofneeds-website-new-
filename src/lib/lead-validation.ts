export function validateLead(data: FormData) {
	const keys = [
		'enquiryType',
		'name',
		'company',
		'email',
		'phone',
		'productRequirement',
		'quantity',
		'budget',
		'deliveryDate',
		'deliveryCity',
		'notes',
		'brandingRequirements',
		'source'
	];
	const values: Record<string, string> = {};
	const errors: Record<string, string> = {};
	for (const key of keys) {
		const value = data.get(key);
		values[key] = typeof value === 'string' ? value.trim() : '';
	}
	values.enquiryType ||= 'buyer';
	if (!['buyer', 'supplier', 'other'].includes(values.enquiryType)) errors.enquiryType = 'Choose buyer, supplier or other enquiry.';
	for (const key of [
		'name',
		'company',
		'email',
		'phone',
		'productRequirement',
		'deliveryCity'
	])
		if (!values[key]) errors[key] = 'Please complete this field.';
	if (values.enquiryType === 'buyer' && !values.quantity) errors.quantity = 'Please complete this field.';
	for (const [key, max] of Object.entries({
		name: 200,
		company: 200,
		email: 254,
		phone: 30,
		productRequirement: 2000,
		deliveryCity: 200,
		notes: 4000,
		brandingRequirements: 1000,
		source: 200
	}))
		if (values[key].length > max) errors[key] = `Please keep this field to ${max} characters.`;
	if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
		errors.email = 'Enter a valid email address.';
	if (values.phone && !/^\+?[\d\s().-]+$/.test(values.phone))
		errors.phone = 'Enter a valid phone number.';
	const digits = values.phone.replace(/\D/g, '');
	if (values.phone && (digits.length < 8 || digits.length > 15))
		errors.phone = 'Enter a phone number with 8 to 15 digits.';
	const quantity = values.quantity ? Number(values.quantity) : null;
	if (quantity !== null && (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100000000))
		errors.quantity = 'Enter a whole quantity of at least 1.';
	const budget = values.budget ? Number(values.budget) : null;
	if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 100000000))
		errors.budget = 'Enter a valid budget of 0 or more.';
	if (values.deliveryDate) {
		const date = new Date(values.deliveryDate + 'T00:00:00Z');
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(values.deliveryDate) ||
			Number.isNaN(date.valueOf()) ||
			date.toISOString().slice(0, 10) !== values.deliveryDate
		)
			errors.deliveryDate = 'Enter a valid delivery date.';
	}
	if (data.get('website'))
		errors.form = 'We could not process this enquiry. Please contact our team directly.';
	return { values, errors, quantity, budget };
}
