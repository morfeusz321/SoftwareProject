#!/bin/bash

# We need to install dependencies only for Docker
[[ ! -e /.dockerenv ]] && exit 0

apt-get update \
&& apt-get install -y \
&& apt-get autoremove -y \
&& docker-php-ext-install mysqli pdo pdo_mysql \
&& apt-get install curl -y \
&& apt-get install git -y\
&& apt-get install zip -y\
&& curl -sL https://getcomposer.org/installer | php -- --install-dir /usr/bin --filename composer