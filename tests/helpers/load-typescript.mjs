import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
const root = path.resolve('src');
const target = path.resolve('.tmp/unit-modules');
const compiled = new Set();
function compile(filename) {
	if (!filename.startsWith(root + path.sep)) throw new Error('Test compiler only reads project source');
	const output = path.join(target, path.relative(root, filename)).replace(/\.ts$/, '.mjs').replace(/\.json$/, '.json.mjs');
	if (compiled.has(filename)) return output;
	compiled.add(filename);
	let source = fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, '');
	if (filename.endsWith('.json')) source = 'export default ' + source + ';';
	else {
		source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
		source = source.replace(/from\s+(['"])(\.[^'"]+)\1/g, (_, quote, ref) => {
			let dependency = path.resolve(path.dirname(filename), ref);
			if (!path.extname(dependency)) dependency += '.ts';
			const depOutput = compile(dependency);
			let relative = path.relative(path.dirname(output), depOutput).replaceAll('\\', '/');
			if (!relative.startsWith('.')) relative = './' + relative;
			return 'from ' + JSON.stringify(relative);
		});
	}
	fs.mkdirSync(path.dirname(output), { recursive: true });
	fs.writeFileSync(output, source);
	return output;
}
export const loadTypescript = (filename) => import(pathToFileURL(compile(path.resolve(filename))).href);
