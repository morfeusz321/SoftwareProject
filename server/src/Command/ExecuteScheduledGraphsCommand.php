<?php

namespace App\Command;

use App\Entity\Task;
use App\Service\GraphExecutionService;
use App\Service\ScheduledGraphExecutionService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'executeScheduledGraphs',
    description: 'Executes all scheduled graphs according to their cron expression',
)]
class ExecuteScheduledGraphsCommand extends Command
{
    public function __construct(
        private ScheduledGraphExecutionService $executionService,
        private GraphExecutionService $graphExecutionService
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    /**
     * function that executes all the scheduled graphs.
     * @param InputInterface $input - the input interface
     * @param OutputInterface $output - the output interface
     * @return int - the exit code
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $tasks = $this->executionService->getTasksThatHaveToBeExecuted();
        $output->writeln("Found " . count($tasks) . " that have to be executed.");
        foreach ($tasks as $task) {
            /** @var Task $task * */
            $output->writeln("About to execute graph " . $task->getGraph()->getId());
            $this->graphExecutionService->executeGraphFlow($task->getGraph());
            $output->writeln("Successfully executed graph " . $task->getGraph()->getId());
        }
        $io->success("Scheduled graphs have been successfully executed");

        return Command::SUCCESS;
    }
}
