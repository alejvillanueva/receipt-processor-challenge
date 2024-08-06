const router = require("express").Router();
const { calculatePoints, isValidReceipt } = require("./helpers");
const receipts = {};

// GET /receipts/:id/points
// Given receipt ID, returns a JSON object containing the number of points awarded.
router.get("/:id/points", async (req, res, next) => {
	try {
		const { id } = req.params;
		const receipt = receipts[id];

		if (!receipt) {
			return res.status(404).send("No receipt found for that id.");
		}

		const { points } = receipts[id];
		res.send({ points });
	} catch (error) {
		next(error);
	}
});

// POST /receipts/process
// Given a JSON receipt, processes the receipt and returns JSON object containing ID.
router.post("/process", (req, res, next) => {
	try {
		const receipt = req.body;
		if (!isValidReceipt(receipt)) {
			return res.status(400).send("The receipt is invalid.");
		}

		const id = crypto.randomUUID();
		const points = calculatePoints(receipt);

		receipts[id] = {
			receipt,
			points,
		};
		res.send({ id });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
