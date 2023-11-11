<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230504074548 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE argument (id INT AUTO_INCREMENT NOT NULL, parent_node_id INT DEFAULT NULL, action_id INT DEFAULT NULL, alias VARCHAR(255) NOT NULL, filed JSON NOT NULL, INDEX IDX_D113B0A3445EB91 (parent_node_id), INDEX IDX_D113B0A9D32F035 (action_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE auth (id INT AUTO_INCREMENT NOT NULL, token VARCHAR(255) NOT NULL, auth_type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE graph (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, nodes JSON NOT NULL, INDEX IDX_94505DCA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE request (id INT AUTO_INCREMENT NOT NULL, auth_id INT DEFAULT NULL, body JSON DEFAULT NULL, url VARCHAR(255) NOT NULL, method VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_3B978F9F8082819C (auth_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE argument ADD CONSTRAINT FK_D113B0A3445EB91 FOREIGN KEY (parent_node_id) REFERENCES node (id)');
        $this->addSql('ALTER TABLE argument ADD CONSTRAINT FK_D113B0A9D32F035 FOREIGN KEY (action_id) REFERENCES node (id)');
        $this->addSql('ALTER TABLE graph ADD CONSTRAINT FK_94505DCA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE request ADD CONSTRAINT FK_3B978F9F8082819C FOREIGN KEY (auth_id) REFERENCES auth (id)');
        $this->addSql('ALTER TABLE node ADD user_id INT DEFAULT NULL, ADD request_id INT NOT NULL, ADD discr VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE node ADD CONSTRAINT FK_857FE845A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE node ADD CONSTRAINT FK_857FE845427EB8A5 FOREIGN KEY (request_id) REFERENCES request (id)');
        $this->addSql('CREATE INDEX IDX_857FE845A76ED395 ON node (user_id)');
        $this->addSql('CREATE INDEX IDX_857FE845427EB8A5 ON node (request_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE node DROP FOREIGN KEY FK_857FE845427EB8A5');
        $this->addSql('ALTER TABLE node DROP FOREIGN KEY FK_857FE845A76ED395');
        $this->addSql('ALTER TABLE argument DROP FOREIGN KEY FK_D113B0A3445EB91');
        $this->addSql('ALTER TABLE argument DROP FOREIGN KEY FK_D113B0A9D32F035');
        $this->addSql('ALTER TABLE graph DROP FOREIGN KEY FK_94505DCA76ED395');
        $this->addSql('ALTER TABLE request DROP FOREIGN KEY FK_3B978F9F8082819C');
        $this->addSql('DROP TABLE argument');
        $this->addSql('DROP TABLE auth');
        $this->addSql('DROP TABLE graph');
        $this->addSql('DROP TABLE request');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP INDEX IDX_857FE845A76ED395 ON node');
        $this->addSql('DROP INDEX IDX_857FE845427EB8A5 ON node');
        $this->addSql('ALTER TABLE node DROP user_id, DROP request_id, DROP discr');
    }
}
