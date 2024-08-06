const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./api/index");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.listen(PORT, () => {
	console.log(`App is listening at post ${PORT}`);
});

// Error Handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).send({ error: err.message });
});
