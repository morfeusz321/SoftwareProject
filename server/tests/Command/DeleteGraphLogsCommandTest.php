<?php

namespace App\Tests\Command;

use App\Command\DeleteGraphLogsCommand;
use App\Entity\Graph;
use App\Repository\GraphRepository;
use App\Service\GraphService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;
use function PHPUnit\Framework\exactly;
use function PHPUnit\Framework\once;

class DeleteGraphLogsCommandTest extends TestCase
{
    public function testExecuteCommand()
    {
        // Mocking the GraphService and EntityManagerInterface
        $graph = $this->createMock(Graph::class);
        $graph->expects(once())->method('clearGraphsLogs');
        // Create a mock for the GraphService
        $graphServiceMock = $this->createMock(GraphService::class);
        $graphServiceMock->expects($this->once())
            ->method('getAllGraphs')
            ->willReturn([$graph]);
        $graphRepositoryMock = $this->createMock(GraphRepository::class);

        // Create a mock for the EntityManagerInterface
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);

        $graphRepositoryMock->expects($this->once())
            ->method('save');
        $entityManagerMock->expects($this->once())
            ->method('flush');

        // Creating an instance of the DeleteGraphLogsCommand and injecting the mock services
        $command = new DeleteGraphLogsCommand($graphServiceMock, $entityManagerMock, $graphRepositoryMock);

        // Creating a Symfony application and adding the command
        $application = new Application();
        $application->add($command);

        // Creating an instance of CommandTester
        $commandTester = new CommandTester($command);

        // Executing the command
        $commandTester->execute([
            'command' => $command->getName(),
        ]);

        // Asserting the output and exit code
        $this->assertStringContainsString('All graphs logs have been cleaned', $commandTester->getDisplay());
        $this->assertSame(0, $commandTester->getStatusCode());
    }

    public function testExecuteEmptyCommand()
    {
        // Mocking the GraphService and EntityManagerInterface

        // Create a mock for the GraphService
        $graphServiceMock = $this->createMock(GraphService::class);
        $graphServiceMock->expects($this->once())
            ->method('getAllGraphs')
            ->willReturn([]);

        // Create a mock for the EntityManagerInterface
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);

        $entityManagerMock->expects($this->once())
            ->method('flush');

        // Creating an instance of the DeleteGraphLogsCommand and injecting the mock services
        $command = new DeleteGraphLogsCommand($graphServiceMock, $entityManagerMock, $this->createMock(GraphRepository::class));

        // Creating a Symfony application and adding the command
        $application = new Application();
        $application->add($command);

        // Creating an instance of CommandTester
        $commandTester = new CommandTester($command);

        // Executing the command
        $commandTester->execute([
            'command' => $command->getName(),
        ]);

        // Asserting the output and exit code
        $this->assertStringContainsString('All graphs logs have been cleaned', $commandTester->getDisplay());
        $this->assertSame(0, $commandTester->getStatusCode());
    }

    public function testExecuteTwoCommand()
    {
        // Mocking the GraphService and EntityManagerInterface
        $graphs = [];
        for ($i = 0; $i < 2; $i++) {
            $graph = $this->createMock(Graph::class);
            $graphs[] = $graph;
            $graph->expects(once())->method('clearGraphsLogs');
        }
        // Create a mock for the GraphService
        $graphServiceMock = $this->createMock(GraphService::class);

        $graphServiceMock->expects($this->once())
            ->method('getAllGraphs')
            ->willReturn($graphs);
        $graphRepositoryMock = $this->createMock(GraphRepository::class);

        // Create a mock for the EntityManagerInterface
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);

        $graphRepositoryMock->expects(exactly(2))
            ->method('save');
        $entityManagerMock->expects($this->once())
            ->method('flush');

        // Creating an instance of the DeleteGraphLogsCommand and injecting the mock services
        $command = new DeleteGraphLogsCommand($graphServiceMock, $entityManagerMock, $graphRepositoryMock);

        // Creating a Symfony application and adding the command
        $application = new Application();
        $application->add($command);

        // Creating an instance of CommandTester
        $commandTester = new CommandTester($command);

        // Executing the command
        $commandTester->execute([
            'command' => $command->getName(),
        ]);

        // Asserting the output and exit code
        $this->assertStringContainsString('All graphs logs have been cleaned', $commandTester->getDisplay());
        $this->assertSame(0, $commandTester->getStatusCode());
    }
}
