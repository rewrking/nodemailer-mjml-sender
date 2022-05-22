#!/bin/bash

yarn version --patch && git push --tags && git push
