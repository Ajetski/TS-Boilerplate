#!/usr/bin/env node

// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate

const { exec } = require('child_process');
const fs = require('fs');

const tsConfig = {
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

const nodemonConfig = {
	watch: [
		'src'
	],
	ext: 'ts,json',
	ignore: [
		'src/**/*.spec.ts'
	],
	exec: 'ts-node ./src/index.ts'
};

const readmeText = `## TS-Boilerplate +
- Download or clone +
- run \`yarn install\` to install depedencies.' 
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

const indexTSCode = `console.log('ts-boilerplate works. delete this and write your code here 😊');
`;

const gitIgnoreText = `# Build files
dist/*

# NPM modules
node_modules/*

# Editor config files
.vscode/*
`

const runCommand = (cmd, rejectStdErr = true) => {
	// console.log(cmd);
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr && rejectStdErr) {
				reject(error);
				return;
			}
			if (stdout.toLowerCase().indexOf('done') || stdout.toLowerCase().indexOf('git'))
				resolve();
		});
	});
}

const runSetup = async () => {
	try {
		console.log('Creating TypeScript Boilerplate...');

		console.log('configuring package.json...')
		let packageConfig;
		try {
			packageConfig = JSON.parse(fs.readFileSync('package.json').toString());
		} catch (err) {
			console.log('package.json does not exist. Creating one...');
			await runCommand('yarn init -y', false);
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
		fs.writeFileSync('package.json', JSON.stringify(packageConfig));

		console.log('installing typescript...');
		await runCommand('yarn add -D typescript');

		console.log('configuring typescript...');
		fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig));

		console.log('installing nodemon...');
		await runCommand('yarn add -D nodemon');

		console.log('configuring nodemon...');
		fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig));

		console.log('adding README.md...');
		fs.writeFileSync('README.md', readmeText);

		console.log('creating src folder...');
		fs.mkdirSync('src');

		console.log('creating src/index.ts');
		fs.writeFileSync('src/index.ts', indexTSCode);

		console.log('creating .gitignore');
		fs.writeFileSync('.gitignore', gitIgnoreText);

		try {
			await runCommand('git init');
		} finally {
			// fail silently
			// either git repo already exists or user does not have git installed
		}

		console.log('setup complete. happy coding! :)')
	}
	catch (err) {
		console.log('oops... something went wrong:');
		console.log(err);
	}
}

runSetup();
