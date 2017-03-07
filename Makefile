BIN         = ./node_modules/.bin
MOCHA       = $(BIN)/mocha
ESLINT      = $(BIN)/eslint
JSPM        = $(BIN)/jspm
NODE        = node
MOCHA_OPTS  = --timeout 2000 --recursive -b
REPORTER    = spec
TEST_FILES  = test

lint:
	$(ESLINT) lib/* public/app/*

start-dev:
	$(NODE) bin/server.js --dev

start:
	$(NODE) bin/server.js

bundle:
	$(BIN)/webpack -d