VERSION=$(shell grep '"version"' package.json | sed 's/    "version": "\(.*\)",/\1/')

test: test-unit

test-unit: node_modules lib/xpath_parser.js
	@./node_modules/.bin/mocha test --reporter dot --check-leaks

test-unit-cov: node_modules lib/xpath_parser.js lib-cov
	@JS_COV=1 ./node_modules/.bin/mocha test --reporter html-cov > coverage_unit.html
	@open coverage_unit.html

.PHONY: lib-cov
lib-cov: node_modules
	@node_modules/jscover/bin/jscover lib lib-cov

node_modules:
	@npm install .

sonar: node_modules lib-cov
	@rm -rf coverage
	@mkdir coverage
	@JS_COV=1 ./node_modules/.bin/mocha -R mocha-lcov-reporter > coverage/coverage_temp.lcov
	@sed 's,SF:,SF:lib/,' coverage/coverage_temp.lcov > coverage/coverage.lcov
	@./node_modules/.bin/mocha -R xunit > coverage/TEST-all.xml
	@sonar-runner -Dsonar.projectVersion=$(VERSION)

clean:
	@rm -rf node_modules lib-cov coverage coverage_unit.html

lib/xpath_parser.js: lib/xpath_parser.pegjs
	@./node_modules/.bin/pegjs lib/xpath_parser.pegjs lib/xpath_parser.js

jshint:
	@node_modules/.bin/jshint lib/child_state.js lib/saxpath.js lib/self_or_descendant_state.js lib/start_state.js lib/state.js lib/xml_recorder.js
