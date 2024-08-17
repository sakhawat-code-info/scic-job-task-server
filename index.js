const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://eloquent-quokka-816248.netlify.app",
			// "https://b9a11-client-side.firebaseapp.com"
		],
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// varify function
const middleChecker = (req, res, next) => {
	console.log(req.method, req.url);

	next();
};
const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).send({ message: "unauthorized access" });
	}
	jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
		if (err) return res.status(401).send({ message: "unauthorized access" });
		req.user = decoded;
		next();
	});
};

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.9i3jisk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
