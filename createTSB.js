#!/usr/bin/env node
// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate
console.log("Creating TypeScript Boilerplate...");

const { exec } = require('child_process');
const fs = require('fs');

const commands = [];

const runCommand = (cmd) => {
	commands.push(new Promise((resolve, reject) => {
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
	}));
}

runCommand('yarn add -D typescript');
runCommand('yarn add -D nodemon');

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
fs.writeFile('nodemon.json', JSON.stringify(nodemonConfig), () => console.log('Error creating nodemon.json'));

const package = fs.readFileSync('package.json').toString();
