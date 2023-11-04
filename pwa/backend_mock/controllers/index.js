import express from 'express';
// import Nonce from '../models/Nonce';
import createUser from './createUser.js';
import { sign } from 'jsonwebtoken';
import { utils } from 'ethers';
import { randomUUID } from 'crypto';
import chalk from 'chalk';
const router = express.Router();

const dbHost = 'dbhost';
if(dbHost == undefined) {
	console.error(chalk.red("MongoDB Connection String Undefined"));
}
//Connect To MongoDB
import { MongoClient, ServerApiVersion } from "mongodb";
const mongo = new MongoClient(dbHost,  {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

const jwtSecret = "HARDCODED JWT SECRET";

// TODO: Change model definition for user schema to match
//Also works as a registration function if user does not yet exist
router.post('/getNonce', async (req, res) => {
	const address = req.query.address;
	
	//Check if publicKey is a valid Ethereum address
	if(utils.isAddress(address)) {
		//Push public key and nonce to DB
		const accountInfo = await mongo.db("exilirate").collection("users").findOne({"eAddr" : address});
        
        // refactor to use createUser function
		if(accountInfo == null){
            const newUser = await createUser( address, address, ['user'], "Anonymous", "", "", "")
			await mongo.db("exilirate").collection("users").insertOne(newUser);
		}

		//Generate nonce using crypto lib
		const nonce = randomUUID();

		//Set nonce in MongoDB
		await mongo.db("exilirate").collection("users").updateOne(
			{
				"eAddr" : address
			},{ 
				$set: { 
					nonce: nonce
				}
			}
		);

		//Return nonce to user
		res.status(200).json({nonce: nonce, msg: "Success"});
	} else {
		//Error if public key is invalid
		res.status(400).json({nonce: null, msg: "Invalid Request: Invalid Public Key"});
	}
});

//Login using signed nonce and ethereum public key
router.post('/login', async (req, res) => {
	//Get needed data for signature verification
	const address = req.query.address;
	const nonce = req.query.nonce;
	const signature = req.query.signature;
	//Check validity of public ethereum address
	if(utils.isAddress(address)) {

		//Get nonce from DB to ensure registration
		const mongoDoc = await mongo.db("exilirate").collection("users").findOne({"eAddr" : address});
		const storedNonce = mongoDoc.nonce
		console.log("storedNonce: " + storedNonce);

		//Ensure user didn't sign arbitrary nonce
		if((nonce == storedNonce) && (nonce != undefined)) {
			//Validate signature
			const valid = await verifyMessage(address, nonce, signature);
			if(valid){
				const roles = mongoDoc.roles;
				console.log("roles: " + roles);
				//Sign JWT
				const token = sign({
					address: address,
					roles: roles,
				}, jwtSecret, {expiresIn: "2h"})

				//Return JWT to user
				res.status(200).json({JWT: token, msg: "Success"});
			} else {
				//Error if signature is invalid
				res.status(400).json({JWT: null, msg: "Invalid Request: Invalid Signature"});
			}
		} else {
			//Error if nonce is invalid
			res.status(400).json({JWT: null, msg: "Invalid Request: Invalid Nonce"});
		}
	} else {
		//Error if public key is invalid
		res.status(400).json({JWT: null, msg: "Invalid Request: Invalid Public Key"});
	}
});

//Verify if signature is valid with additional error catching
const verifyMessage = async (address, nonce, signature) => {
	try {
		const address = await utils.verifyMessage(nonce, signature);
		if (address !== address) {
			return false;
		}
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export default router;