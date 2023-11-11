loadFixtures:
	docker exec -it php php bin/console doctrine:fixtures:load --append
installComposer:
	docker exec -it php composer install -o
tests:
	docker exec -it php php bin/console cache:clear --env=test
	docker exec -it php php bin/console doctrine:database:drop --force --env=test
	docker exec -it php php bin/console doctrine:database:create --env=test
	docker exec -it php  php bin/console doctrine:schema:update --force --env=test
	docker-compose exec php bin/console doctrine:fixtures:load --append --env=test
	docker exec -it php php bin/phpunit
testCoverageText:
	docker exec -it php php bin/console cache:clear --env=test
	docker exec -it php php bin/console doctrine:database:drop --force --env=test
	docker exec -it php php bin/console doctrine:database:create --env=test
	docker exec -it php php bin/console doctrine:schema:update --force --env=test
	docker-compose exec php bin/console doctrine:fixtures:load --append --env=test
	docker exec -it php php bin/phpunit --coverage-text
testCoverageHtml:
	docker exec -it php php bin/console cache:clear --env=test
	docker exec -it php php bin/console doctrine:database:drop --force --env=test
	docker exec -it php php bin/console doctrine:database:create --env=test
	docker exec -it php php bin/console doctrine:schema:update --force --env=test
	docker-compose exec php bin/console doctrine:fixtures:load --append --env=test
	docker exec -it php php bin/phpunit --debug --coverage-html=coverage
mutation:
	docker exec -it php php bin/console cache:clear --env=test
	docker exec -it php php bin/console doctrine:database:drop --force --env=test
	docker exec -it php php bin/console doctrine:database:create --env=test
	docker exec -it php php bin/console doctrine:schema:update --force --env=test
	docker-compose exec php bin/console doctrine:fixtures:load --append --env=test
	docker exec -it php vendor/bin/infection --threads=10
clean-up:
	docker exec -it php vendor/bin/ecs --fix
analyze:
	docker exec -it php vendor/bin/phpmetrics --report-html=myreport.html ./src

