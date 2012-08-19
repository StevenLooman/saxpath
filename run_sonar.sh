#!/usr/bin/env bash

rm -rf coverage
rm -rf lib-cov

mkdir coverage

echo Running mocha
node-jscoverage lib lib-cov
mv lib lib-orig
mv lib-cov lib
mocha -R mocha-lcov-reporter > coverage/coverage.lcov
mocha -R xunit > coverage/TEST-all.xml
rm -rf lib
mv lib-orig lib

echo Running sonar-runner
sonar-runner
