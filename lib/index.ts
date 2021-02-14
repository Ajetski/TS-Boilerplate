#!/usr/bin/env node

// This file create the typescript boilerplate when the following command is run:
// npx github:Ajetski/TS-Boilerplate

import { exec } from 'child_process';
import { mkdir, writeFile, readFile, mkdirSync } from 'fs';
import axios from 'axios';

const useYarn = !process.argv.some(arg => arg === '--use-npm');
const addExpress = process.argv.some(arg => arg === '--express');
const projectFolder = process.argv.find(arg => arg.indexOf('npx') === -1
	&& arg.indexOf('yarn') === -1
	&& arg.indexOf('--use-npm') === -1
	&& arg.indexOf('create') === -1
	&& arg.indexOf('tsb') === -1
	&& arg.indexOf('node.exe') === -1
	&& arg.indexOf('index.js') === -1
	&& arg.indexOf('--express') === -1);

const makeFileAsync = async (url: string, writeUrl = url) => {
	console.log(`adding ${writeUrl}...`);
	let { data } = await axios.get(`https://raw.githubusercontent.com/Ajetski/create-tsb/master/resources/${url}`);
	if (typeof data === 'object')
		data = JSON.stringify(data);
	await new Promise<void>((resolve, reject) =>
		writeFile(projectFolder ? `${projectFolder}/${writeUrl}` : writeUrl, data, (err) => {
			if (err) reject(err);
			resolve();
		}));
};

const makeDirAsync = async (dirName: string) => {
	await new Promise<void>((resolve, reject) =>
		mkdir(projectFolder ? `${projectFolder}/${dirName}` : dirName, { recursive: true }, (err) => {
			if (err) reject(err);
			resolve();
		}));
}

const readFileAsync = (fileName: string): Promise<string> => new Promise<string>((resolve, reject) =>
	readFile(projectFolder ? `${projectFolder}/${fileName}` : fileName, (err, data) => {
		if (err) {
			reject(err);
			return;
		}
		resolve(data.toString());
	}));

const runCommand = (cmd: string, rejectStdErr = true) => {
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

const configurePackage = async (pkg: string, fileName?: string, prodDepedency = false) => {
	console.log(`installing ${pkg}...`);
	await runCommand((projectFolder ? `cd ${projectFolder} && ` : '')
		+ (useYarn ? `yarn add ${!prodDepedency ? '-D' : ''} ${pkg}` : `npm i ${!prodDepedency ? '--save-dev' : ''} ${pkg}`));
	if (fileName)
		await makeFileAsync(fileName);
};

const runSetup = async () => {
	try {
		if (projectFolder) {
			console.log(`creating ${projectFolder} project folder...`);
			mkdirSync(projectFolder);
		}
		const operations = [];
		console.log(`Creating TypeScript Boilerplate using ${useYarn ? 'yarn' : 'npm'}...`);
		const managePackages = async () => {
			console.log('configuring package.json...');
			let packageConfig: { main: string, scripts: { [script: string]: string } };
			try {
				packageConfig = JSON.parse(await readFileAsync('package.json'));
			} catch (err) {
				console.log('package.json does not exist. Creating one...');
				await runCommand((projectFolder ? `cd ${projectFolder} && ` : '') + (useYarn ? 'yarn init -y' : 'npm init -y'), false);
				packageConfig = JSON.parse(await readFileAsync('package.json'));
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
				writeFile(projectFolder ? `${projectFolder}/package.json` : 'package.json', JSON.stringify(packageConfig), (err) => {
					if (err) reject(err);
					resolve();
				});
			})

			await configurePackage('typescript', 'tsconfig.json')
			await configurePackage('nodemon', 'nodemon.json');
			if (addExpress) {
				await configurePackage('express', undefined, true);
				await configurePackage('@types/express');
			}
		};

		const makeSourceCode = async () => {
			await makeDirAsync('src');
			if (!addExpress)
				await makeFileAsync('src/index.ts');
			else
				await makeFileAsync('src/express.ts', 'src/index.ts');
		}

		operations.push(managePackages());
		operations.push(makeFileAsync('README.md'));
		operations.push(makeSourceCode());
		operations.push(makeFileAsync('.gitignore'));
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
