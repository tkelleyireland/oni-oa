#!/bin/sh
ipython notebook --profile=ia --port=8889 --ip=0.0.0.0 --no-browser > ipython.out 2>&1&
