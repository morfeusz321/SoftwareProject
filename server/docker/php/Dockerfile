FROM php:8.2-fpm

WORKDIR /app

RUN apt-get update

RUN apt-get -y install git zip libpq-dev cron

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN curl -sL https://getcomposer.org/installer | php -- --install-dir /usr/bin --filename composer

RUN pecl install xdebug
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN touch /var/log/cron.log

ENTRYPOINT ["entrypoint.sh"]

