<?php

namespace App\Tests\Command;

use App\Command\ExecuteScheduledGraphsCommand;
use App\Entity\Graph;
use App\Entity\Task;
use App\Service\GraphExecutionService;
use App\Service\ScheduledGraphExecutionService;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;

use Symfony\Component\Console\Tester\CommandTester;

class ExecuteScheduledGraphsCommandTest extends KernelTestCase
{
    public function testExecuteCommand()
    {
        $graphMock = $this->createMock(Graph::class);
        $graphMock->expects($this->exactly(2))->method('getId')->willReturn(1);
        $taskMock = $this->createMock(Task::class);
        $taskMock->expects($this->exactly(3))->method('getGraph')->willReturn($graphMock);
        // Create a mock for the ScheduledGraphExecutionService
        $executionServiceMock = $this->createMock(ScheduledGraphExecutionService::class);
        $executionServiceMock->expects($this->once())
            ->method('getTasksThatHaveToBeExecuted')
            ->willReturn([$taskMock]);

        // Create a mock for the GraphExecutionService
        $graphExecutionServiceMock = $this->createMock(GraphExecutionService::class);
        $graphExecutionServiceMock->expects($this->once())
            ->method('executeGraphFlow')->with($graphMock);

        // Create an instance of the command and inject the mock services
        $command = new ExecuteScheduledGraphsCommand($executionServiceMock, $graphExecutionServiceMock);

        // Create a Symfony application and add the command
        $kernel = self::bootKernel();
        $application = new Application($kernel);
        $application->add($command);

        // Create an instance of CommandTester
        $commandTester = new CommandTester($command);

        // Execute the command
        $commandTester->execute([
            'command' => $command->getName(),
        ]);

        // Assert the output and exit code
        $this->assertStringContainsString('Scheduled graphs have been successfully executed', $commandTester->getDisplay());
        $this->assertStringContainsString("Found 1 that have to be executed.", $commandTester->getDisplay());
        $this->assertStringContainsString('About to execute graph 1', $commandTester->getDisplay());
        $this->assertStringContainsString('Successfully executed graph 1', $commandTester->getDisplay());
        $this->assertSame(Command::SUCCESS, $commandTester->getStatusCode());
    }
}
