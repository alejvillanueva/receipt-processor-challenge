const {
	calculatePoints,
	isValidReceipt,
	pointsFromRetailer,
	pointsFromDate,
	pointsFromTime,
	pointsFromTotal,
	pointsFromItems,
} = require("../api/helpers");

describe("isValidReceipt", () => {
	it("return false if missing field from receipt", () => {
		// Missing Total
		const receipt1 = {
			retailer: "Target",
			purchaseDate: "2022-01-02",
			purchaseTime: "13:13",
			items: [{ shortDescription: "Pepsi - 12-oz", price: "1.25" }],
		};
		expect(isValidReceipt(receipt1)).toBe(false);
	});
	it("return true if valid receipt", () => {
		const receipt2 = {
			retailer: "Walgreens",
			purchaseDate: "2022-01-02",
			purchaseTime: "08:13",
			total: "2.65",
			items: [
				{ shortDescription: "Pepsi - 12-oz", price: "1.25" },
				{ shortDescription: "Dasani", price: "1.40" },
			],
		};
		expect(isValidReceipt(receipt2)).toBe(true);
	});
});

describe("calculatePoints", () => {
	it("returns correct total points", () => {
		const receipt1 = {
			retailer: "Target",
			purchaseDate: "2022-01-01",
			purchaseTime: "13:01",
			items: [
				{
					shortDescription: "Mountain Dew 12PK",
					price: "6.49",
				},
				{
					shortDescription: "Emils Cheese Pizza",
					price: "12.25",
				},
				{
					shortDescription: "Knorr Creamy Chicken",
					price: "1.26",
				},
				{
					shortDescription: "Doritos Nacho Cheese",
					price: "3.35",
				},
				{
					shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
					price: "12.00",
				},
			],
			total: "35.35",
		};
		const receipt2 = {
			retailer: "M&M Corner Market",
			purchaseDate: "2022-03-20",
			purchaseTime: "14:33",
			items: [
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
				{
					shortDescription: "Gatorade",
					price: "2.25",
				},
			],
			total: "9.00",
		};
		expect(calculatePoints(receipt1)).toBe(28);
		expect(calculatePoints(receipt2)).toBe(109);
	});
});

describe("pointsFromRetailer", () => {
	it("returns one point for every alphanumeric character in the retailer name", () => {
		const retailer1 = "Walgreens";
		const retailer2 = "Home Depot";
		const retailer3 = "Lowe's";
		const retailer4 = "Cats & Plants 4Ever!";
		const retailer5 = "M&M Corner Market";

		expect(pointsFromRetailer(retailer1)).toBe(9);
		expect(pointsFromRetailer(retailer2)).toBe(9);
		expect(pointsFromRetailer(retailer3)).toBe(5);
		expect(pointsFromRetailer(retailer4)).toBe(15);
		expect(pointsFromRetailer(retailer5)).toBe(14);
	});
});

describe("pointsFromDate", () => {
	it("returns 6 points if the day in the purchase date is odd", () => {
		const date1 = "2024-04-27";
		const date2 = "2024-01-03";
		const date3 = "2021-08-01";

		expect(pointsFromDate(date1)).toBe(6);
		expect(pointsFromDate(date2)).toBe(6);
		expect(pointsFromDate(date3)).toBe(6);
	});
	it("returns 0 points if the day in the purchase date is even.", () => {
		const date1 = "2024-04-28";
		const date2 = "2024-01-04";
		const date3 = "2021-08-02";

		expect(pointsFromDate(date1)).toBe(0);
		expect(pointsFromDate(date2)).toBe(0);
		expect(pointsFromDate(date3)).toBe(0);
	});
});

describe("pointsFromTime", () => {
	it("returns 10 points if the time of purchase is after 2:00pm and before 4:00pm", () => {
		const time1 = "14:01";
		const time2 = "15:00";
		const time3 = "15:59";

		expect(pointsFromTime(time1)).toBe(10);
		expect(pointsFromTime(time2)).toBe(10);
		expect(pointsFromTime(time3)).toBe(10);
	});
	it("returns 0 points during other times", () => {
		const time1 = "13:59";
		const time2 = "00:00";
		const time3 = "16:01";

		expect(pointsFromDate(time1)).toBe(0);
		expect(pointsFromDate(time2)).toBe(0);
		expect(pointsFromDate(time3)).toBe(0);
	});
});

describe("pointsFromTotal", () => {
	it("returns 50 if the total is a round dollar amount with no cent", () => {
		// These will return 75 because if it has no cents its also a multiple .25
		const total1 = "13.00";
		const total2 = "424.00";
		const total3 = "3.00";

		expect(pointsFromTotal(total1)).toBe(75);
		expect(pointsFromTotal(total2)).toBe(75);
		expect(pointsFromTotal(total3)).toBe(75);
	});
	it("returns 25 points if the total is a multiple of 0.25", () => {
		const total1 = "13.25";
		const total2 = "424.50";
		const total3 = "3.75";

		expect(pointsFromTotal(total1)).toBe(25);
		expect(pointsFromTotal(total2)).toBe(25);
		expect(pointsFromTotal(total3)).toBe(25);
	});
	it("returns 0 points if the total is neither", () => {
		const total1 = "13.05";
		const total2 = "424.62";
		const total3 = "3.38";

		expect(pointsFromTotal(total1)).toBe(0);
		expect(pointsFromTotal(total2)).toBe(0);
		expect(pointsFromTotal(total3)).toBe(0);
	});
});

describe("pointsFromItems", () => {
	it("returns 5 points for every two items on the receipt and other points depending on length of description", () => {
		const items1 = [
			{
				shortDescription: "Gatorade",
				price: "2.25",
			},
			{
				shortDescription: "Gatorade",
				price: "2.25",
			},
			{
				shortDescription: "Gatorade",
				price: "2.25",
			},
			{
				shortDescription: "Gatorade",
				price: "2.25",
			},
		];
		const items2 = [
			{
				shortDescription: "Mountain Dew 12PK",
				price: "6.49",
			},
			{
				shortDescription: "Emils Cheese Pizza",
				price: "12.25",
			},
			{
				shortDescription: "Knorr Creamy Chicken",
				price: "1.26",
			},
			{
				shortDescription: "Doritos Nacho Cheese",
				price: "3.35",
			},
			{
				shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
				price: "12.00",
			},
		];
		const items3 = [{ shortDescription: "Pepsi", price: "1.25" }];

		expect(pointsFromItems(items1)).toBe(10);
		expect(pointsFromItems(items2)).toBe(16);
		expect(pointsFromItems(items3)).toBe(0);
	});
});
