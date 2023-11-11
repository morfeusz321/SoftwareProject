php bin/console cache:clear --env=test
php bin/console doctrine:database:create --env=test
php bin/console doctrine:schema:update --force --env=test
php bin/console doctrine:fixtures:load --env=test --append
php bin/phpunit