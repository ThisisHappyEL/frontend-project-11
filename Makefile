install:
	npm ci

publish:
	npm publish --dry-run

develop:
	npx webpack serve

build:
	npm run build

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix
