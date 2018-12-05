#!/bin/bash

cd test/resources/bruby-mruby/
rake clean
rake build
cd ../bruby-bridge/
rake clean
rake build
cd ../../../
rake clean
rake test