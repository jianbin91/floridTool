#!/bin/bash


cd /www/h5/travel/

umi build

php  /www/h5/travel/sh/replace_cdn.php

scp /www/h5/travel/dist/* travel:/www/static/



