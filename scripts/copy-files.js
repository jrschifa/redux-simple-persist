const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');

const repositoryRootPath = path.resolve(__dirname, '..');
const buildPath = path.resolve(repositoryRootPath, 'build');

async function createPackageFile() {
    const packageData = await fse.readFile(path.resolve(repositoryRootPath, 'package.json'));
    const {
        scripts,
        private,
        devDependencies,
        ...rest
    } = JSON.parse(packageData);
    const newPackageData = {
        ...rest
    };
    const targetPath = path.resolve(buildPath, 'package.json');

    await fse.writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8');
    console.log(`Created package.json in ${targetPath}`);

    return newPackageData;
}

async function copySupportingFiles() {
    await Promise.all([
        './.gitignore'
    ].map(async (file) => {
        try {
            const srcPath = path.resolve(repositoryRootPath, file);
            const relPath = path.dirname(path.relative(srcPath, srcPath));
            const dstPath = path.resolve(buildPath, relPath, path.basename(file));
            await fse.copy(srcPath, dstPath);
            console.log(`Copied ${srcPath} to ${dstPath}`);
        } catch (err) {
            throw err;
        }
    }));
}

async function run() {
    try {
        const packageData = await createPackageFile();
        
        await copySupportingFiles();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();