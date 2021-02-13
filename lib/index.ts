#!/usr/bin/env node

// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate

import { exec } from 'child_process';
import fs, { mkdir } from 'fs';
import axios from 'axios';

const useYarn = !process.argv.some(arg => arg === '--use-npm');

const makeFile = async (url: string) => {
	console.log(`adding ${url}...`);
	let { data } = await axios.get(`https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/${url}`);
	if (typeof data === 'object')
		data = JSON.stringify(data);
	await new Promise<void>((resolve, reject) =>
		fs.writeFile(url, data, (err) => {
			if (err) reject(err);
			resolve();
		}));
};

const makeDir = async (dirName: string) => {
	await new Promise<void>((resolve, reject) =>
		fs.mkdir(dirName, (err) => {
			if (err) reject(err);
			resolve();
		}));
}

const runCommand = (cmd: string, rejectStdErr = true) => {
	// console.log(cmd);
	return new Promise<void>((resolve, reject) => {
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
};

const configurePackage = async (pkg: string, fileName?: string) => {
	console.log(`installing ${pkg}...`);
	await runCommand(useYarn ? `yarn add -D ${pkg}` : `npm i --save-dev ${pkg}`);
	if (fileName)
		await makeFile(fileName);
};

const runSetup = async () => {
	try {
		const operations = [];
		console.log(`Creating TypeScript Boilerplate using ${useYarn ? 'yarn' : 'npm'}...`);
		const managePackages = async () => {
			console.log('configuring package.json...');
			let packageConfig: { main: string, scripts: { [script: string]: string } };
			try {
				packageConfig = JSON.parse(fs.readFileSync('package.json').toString());
			} catch (err) {
				console.log('package.json does not exist. Creating one...');
				await runCommand(useYarn ? 'yarn init -y' : 'npm init -y', false);
				packageConfig = JSON.parse(fs.readFileSync('package.json').toString());
			}
			packageConfig = {
				...packageConfig,
				main: 'dist/index.js',
				scripts: {
					...packageConfig.scripts,
					prestart: 'npm run rebuild',
					start: 'node .',
					dev: 'nodemon .',
					build: 'tsc',
					rebuild: 'npm run clean && npm run build',
					clean: 'rm -rf dist/*',
				}
			};

			await new Promise<void>((resolve, reject) => {
				fs.writeFile('package.json', JSON.stringify(packageConfig), (err) => {
					if (err) reject(err);
					resolve();
				});
			})

			await configurePackage('typescript', 'tsconfig.json')
			await configurePackage('nodemon', 'nodemon.json');
		};

		const makeSourceCode = async () => {
			await makeDir('src');
			await makeFile('src/index.ts');
		}


		operations.push(managePackages());
		operations.push(makeFile('README.md'));
		operations.push(makeSourceCode());
		operations.push(makeFile('.gitignore'));
		await Promise.all(operations);

		try {
			await runCommand('git init');
		} finally {
			// fail silently
			// either git repo already exists or user does not have git installed
		}

		console.log('setup complete. happy coding! :)');
	}
	catch (err) {
		console.log('oops... something went wrong:');
		console.log(err);
	}
}

runSetup();
