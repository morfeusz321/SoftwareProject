<?php

namespace App\Command;

use App\Repository\GraphRepository;
use App\Service\GraphService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:delete-graph-logs',
    description: 'Deletes all saved logs from graph executions.',
)]
class DeleteGraphLogsCommand extends Command
{
    public function __construct(
        private GraphService $graphService,
        private EntityManagerInterface $entityManager,
        private GraphRepository $graphRepository
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    /**
     * function that deletes all the logs from the graphs.
     * @param InputInterface $input - the input interface
     * @param OutputInterface $output - the output interface
     * @return int - the exit code
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $graphs = $this->graphService->getAllGraphs();
        $output->writeln("Found " . count($graphs) . " graphs that have to have the logs cleaned.");
        $progress = new ProgressBar($output, count($graphs));
        foreach ($graphs as $graph) {
            $graph->clearGraphsLogs();
            $this->graphRepository->save($graph);
            $progress->advance();
        }
        $this->entityManager->flush();
        $io->success('All graphs logs have been cleaned');

        return Command::SUCCESS;
    }
}
