VERSION=$(shell grep '"version"' package.json | sed 's/    "version": "\(.*\)",/\1/')

test: test-unit

test-unit: node_modules
	@./node_modules/.bin/mocha test --reporter dot

test-unit-cov: node_modules lib-cov
	@JS_COV=1 ./node_modules/.bin/mocha test --reporter html-cov > coverage_unit.html
	@open coverage_unit.html

lib-cov: node_modules
	@node_modules/jscover/bin/jscover lib lib-cov

node_modules:
	@npm install .

sonar: node_modules lib-cov
	@rm -rf coverage
	@mkdir coverage
	@JS_COV=1 ./node_modules/.bin/mocha -R mocha-lcov-reporter > coverage/coverage.lcov
	@./node_modules/.bin/mocha -R xunit > coverage/TEST-all.xml
	@sonar-runner -Dsonar.projectVersion=$(VERSION)

clean:
	@rm -rf coverage coverage_unit.html
