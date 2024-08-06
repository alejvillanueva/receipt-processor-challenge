// One point for every alphanumeric character in the retailer name.
const pointsFromRetailer = retailer => {
	let points = 0;
	const alphaNumeric = /^[a-zA-Z0-9]$/;

	for (char of retailer) {
		if (alphaNumeric.test(char)) points++;
	}

	return points;
};

// 6 points if the day in the purchase date is odd.
const pointsFromDate = date => {
	const day = date.split("-")[2];
	const points = Number(day) % 2 ? 6 : 0;

	return points;
};

//10 points if the time of purchase is after 2:00pm and before 4:00pm.
const pointsFromTime = time => {
	let points = 0;
	const [hour, minute] = time.split(":");
	if (Number(hour) === 14 && Number(minute) > 0) {
		points = 10;
	} else if (Number(hour) === 15 && Number(minute) >= 0) {
		points = 10;
	}

	return points;
};

// 50 points if the total is a round dollar amount with no cents.
// 25 points if the total is a multiple of 0.25.
const pointsFromTotal = total => {
	let points = 0;

	if (!(Number(total) % 0.25)) points += 25;
	if (total.split(".")[1] === "00") points += 50;

	return points;
};

//5 points for every two items on the receipt.
//If the trimmed length of the item description is a multiple of 3,
//multiply the price by 0.2 and round up to the nearest integer.
//The result is the number of points earned.
const pointsFromItems = items => {
	let points = 0;
	const itemPairsPoints = Math.floor(items.length / 2) * 5;
	for (item of items) {
		const { shortDescription, price } = item;

		if (!(shortDescription.trim().length % 3)) {
			points += Math.ceil(price * 0.2);
		}
	}

	points += itemPairsPoints;

	return points;
};

const calculatePoints = receipt => {
	const receiptFields = Object.entries(receipt);
	return receiptFields.reduce((points, field) => {
		const [key, value] = field;
		switch (key) {
			case "retailer":
				points += pointsFromRetailer(value);
				break;
			case "purchaseDate":
				points += pointsFromDate(value);
				break;
			case "purchaseTime":
				points += pointsFromTime(value);
				break;
			case "total":
				points += pointsFromTotal(value);
				break;
			case "items":
				points += pointsFromItems(value);
				break;
			default:
				points += 0;
				break;
		}
		return points;
	}, 0);
};

const isValidReceipt = receipt => {
	const hasRetailer = receipt["retailer"];
	const hasPurchaseDate = receipt["purchaseDate"];
	const hasPurchaseTime = receipt["purchaseTime"];
	const hasItems = receipt["items"];
	const hasTotal = receipt["total"];
	const isValidReceipt =
		hasRetailer && hasPurchaseDate && hasPurchaseTime && hasItems && hasTotal;
	return !!isValidReceipt;
};

module.exports = {
	calculatePoints,
	isValidReceipt,
	pointsFromRetailer,
	pointsFromDate,
	pointsFromTime,
	pointsFromTotal,
	pointsFromItems,
};
