#!/usr/bin/env node
// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate
console.log("Creating TypeScript Boilerplate...");

const { exec } = require('child_process');
const fs = require('fs');

const runCommand = (cmd) => {
	new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				reject(error);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				reject(error);
				return;
			}
			console.log(`stdout: ${stdout}`);
			resolve(stdout);
		});
	});
}

const runSetup = async () => {
	try {
		await runCommand('yarn add -D typescript');
		await runCommand('yarn add -D nodemon');

		const nodemonConfig = {
			watch: [
				"src"
			],
			ext: "ts,json",
			ignore: [
				"src/**/*.spec.ts"
			],
			exec: "ts-node ./src/index.ts"
		};
		fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig));

		const package = fs.readFileSync('package.json').toString();
	}
	catch (err) {
		console.log('oops... something went wrong:');
		console.log(err);
	}
}

runSetup();

