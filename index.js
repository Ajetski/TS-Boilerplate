#!/usr/bin/env node

// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate

const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');

const args = process.argv;
const useYarn = args.slice(-1)[0].toLowerCase() !== '--use-npm';

const tsConfigBackup = {
	compilerOptions: {
		noImplicitAny: true,
		removeComments: true,
		preserveConstEnums: true,
		outDir: 'dist/',
		sourceMap: true,
		moduleResolution: 'Node',
		module: 'CommonJS'
	},
	include: [
		'src/**/*'
	],
	exclude: [
		'node_modules',
		'**/*.spec.ts'
	]
};

const nodemonConfigBackup = {
	watch: [
		'src'
	],
	ext: 'ts,json',
	ignore: [
		'src/**/*.spec.ts'
	],
	exec: 'ts-node ./src/index.ts'
};

const readmeTextBackup = `## TypeScript Boilerplate
- run \`yarn start\` or \`npm start\` to start the application.'
- run \`yarn run dev\` or \`npm run dev\` to start the application in developer mode.'

## MIT License
Copyright (c) 2021 Adam Jeniski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const indexTSCodeBackup = `console.log('ts-boilerplate works. delete this and write your code here 😃');
`;

const gitIgnoreTextBackup = `# Build files
dist/*
build/*

# NPM modules
node_modules/*

# Editor config files
.vscode/*

# Secrets
.env
`

const runCommand = (cmd, rejectStdErr = true) => {
	// console.log(cmd);
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr && rejectStdErr && stderr.toLowerCase().indexOf('warn') === -1) {
				reject(stderr);
				return;
			}
			resolve();
		});
	});
}

const runSetup = async () => {
	try {
		const operations = [];

		console.log(`Creating TypeScript Boilerplate using ${useYarn ? 'yarn' : 'npm'}...`);

		console.log('configuring package.json...')
		let packageConfig;
		try {
			packageConfig = JSON.parse(fs.readFileSync('package.json').toString());
		} catch (err) {
			console.log('package.json does not exist. Creating one...');
			await runCommand(useYarn ? 'yarn init -y' : 'npm init -y', false);
			packageConfig = JSON.parse(fs.readFileSync('package.json').toString());
		}
		packageConfig.main = 'dist/index.js'
		packageConfig.scripts = {
			...packageConfig.scripts,
			prestart: 'npm run rebuild',
			start: 'node .',
			dev: 'nodemon .',
			build: 'tsc',
			rebuild: 'npm run clean && npm run build',
			clean: 'rm -rf dist/*',
		}
		operations.push(new Promise((resolve, reject) => {
			fs.writeFile('package.json', JSON.stringify(packageConfig), (err) => {
				if (err) reject(err);
				resolve();
			});
		}));

		console.log('installing typescript...');
		await runCommand(useYarn ? 'yarn add -D typescript' : 'npm i --save-dev typescript');

		operations.push(new Promise((resolve, reject) => {
			console.log('configuring typescript...');
			axios.get('https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/tsconfig.json')
				.then(({ data: tsConfig }) => {
					fs.writeFile('tsconfig.json', JSON.stringify(tsConfig), (err) => {
						if (err) reject(err);
						resolve();
					});
				}).catch(err => {
					console.log('cannot fetch lastest version from github, writing nodemon.json from backup...');
					fs.writeFile('tsconfig.json', JSON.stringify(tsConfigBackup), (err) => {
						if (err) reject(err);
						resolve();
					});
				});
		}))

		console.log('installing nodemon...');
		await runCommand(useYarn ? 'yarn add -D nodemon' : 'npm i --save-dev nodemon');

		operations.push(new Promise((resolve, reject) => {
			console.log('configuring nodemon...');
			axios.get('https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/nodemon.json')
				.then(({ data: nodemonConfig }) => {
					fs.writeFile('README.md', JSON.stringify(nodemonConfig), (err) => {
						if (err) reject(err);
						resolve();
					});
				}).catch(err => {
					console.log('cannot fetch lastest version from github, writing nodemon.json from backup...');
					fs.writeFile('nodemon.json', JSON.stringify(nodemonConfigBackup), (err) => {
						if (err) reject(err);
						resolve();
					});
				});
		}));

		operations.push(new Promise((resolve, reject) => {
			console.log('adding README.md...');
			axios.get('https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/README.md')
				.then(({ data: readmeText }) => {
					fs.writeFile('README.md', readmeText, (err) => {
						if (err) reject(err);
						resolve();
					});
				}).catch(err => {
					console.log('cannot fetch lastest version from github, writing READEME.md from backup...');
					fs.writeFile('README.md', readmeTextBackup, (err) => {
						if (err) reject(err);
						resolve();
					});
				});
		}));

		operations.push(new Promise((resolve, reject) => {
			console.log('creating src folder...');
			fs.mkdir('src', (err) => {
				if (err) reject(err);
				console.log('creating src/index.ts');
				axios.get('https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/src/index.ts')
					.then(({ data: indexTSCode }) => {
						fs.writeFile('src/index.ts', indexTSCode, (err) => {
							if (err) reject(err);
							resolve();
						});
					}).catch(err => {
						console.log('cannot fetch lastest version from github, writing index.ts from backup...');
						fs.writeFile('src/index.ts', indexTSCodeBackup, (err) => {
							if (err) reject(err);
							resolve();
						});
					});
			});
		}));

		operations.push(new Promise((resolve, reject) => {
			console.log('creating .gitignore');
			axios.get('https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/.gitignore')
				.then(({ data: gitIgnoreText }) => {
					fs.writeFile('.gitignore', gitIgnoreText, (err) => {
						if (err) reject(err);
						resolve();
					});
				}).catch(err => {
					console.log('cannot fetch lastest version from github, writing gitignore from backup...');
					fs.writeFile('.gitignore', gitIgnoreText, (err) => {
						if (err) reject(err);
						resolve();
					});
				});
		}));

		try {
			await runCommand('git init');
		} finally {
			// fail silently
			// either git repo already exists or user does not have git installed
		}

		await Promise.all(operations);
		console.log('setup complete. happy coding! :)');
	}
	catch (err) {
		console.log('oops... something went wrong:');
		console.log(err);
	}
}

runSetup();
