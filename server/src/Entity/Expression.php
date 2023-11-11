<?php

namespace App\Entity;

use App\Repository\ExpressionRepository;
use DateInterval;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ExpressionRepository::class)]
class Expression
{
    public const LESS_THAN = 'LessThan';

    public const LESS_THAN_OR_EQUAL = 'LessThanOrEqual';

    public const EQUAL = 'Equal';

    public const NOT_EQUAL = 'NotEqual';

    public const GREATER_OR_EQUAL = 'GreaterOrEqual';

    public const GREATER = 'GreaterThan';

    public const NODE_VALUE = 'valueFromNode';

    public const USER_VALUE = 'valueFromUser';

    public const DATE_VALUE = "valueFromCalendar";

    public const EXPRESSION_TYPES = [
        Expression::LESS_THAN,
        Expression::LESS_THAN_OR_EQUAL,
        Expression::EQUAL,
        Expression::NOT_EQUAL,
        Expression::GREATER_OR_EQUAL,
        Expression::GREATER,
    ];

    public const COMPARE_TWO_VALUES = [
        Expression::NODE_VALUE,
        Expression::USER_VALUE,
        Expression::DATE_VALUE,
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $comparisonType = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $compareTo = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $firstFieldValue = null;

    #[ORM\Column(length: 255)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $firstFieldNodeId = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $secondFieldUserValue = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $secondFieldNodeValue = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $secondFieldNodeId = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $secondFieldTimeDate = null;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?int $secondFieldTimeDays = 0;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?int $secondFieldTimeMonths = 0;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['graph', "graphInfo"])]
    private ?string $secondFieldTimeExecutionTime = null;

    #[ORM\Column]
    #[Groups(['graph', "graphInfo"])]
    private ?int $secondFieldTimeYears = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->comparisonType;
    }

    public function setType(?string $type): void
    {
        if (! in_array($type, self::EXPRESSION_TYPES)) {
            throw new InvalidArgumentException("Invalid expression type");
        }
        $this->comparisonType = $type;
    }

    public function getCompareTo(): ?string
    {
        return $this->compareTo;
    }

    public function setCompareTo(?string $compareTo): void
    {
        if (! in_array($compareTo, self::COMPARE_TWO_VALUES)) {
            throw new InvalidArgumentException("Invalid expression type");
        }
        $this->compareTo = $compareTo;
    }

    public function getFirstFieldValue(): ?string
    {
        return $this->firstFieldValue;
    }

    public function setFirstFieldValue(?string $firstFieldValue): void
    {
        $this->firstFieldValue = $firstFieldValue;
    }

    public function getFirstFieldNodeId(): ?string
    {
        return $this->firstFieldNodeId;
    }

    public function setFirstFieldNodeId(?string $firstFieldNodeId): void
    {
        $this->firstFieldNodeId = $firstFieldNodeId;
    }

    public function getSecondFieldUserValue(): ?string
    {
        return $this->secondFieldUserValue;
    }

    public function setSecondFieldUserValue(?string $secondFieldUserValue): void
    {
        $this->secondFieldUserValue = $secondFieldUserValue;
    }

    public function getSecondFieldNodeValue(): ?string
    {
        return $this->secondFieldNodeValue;
    }

    public function setSecondFieldNodeValue(?string $secondFieldNodeValue): void
    {
        $this->secondFieldNodeValue = $secondFieldNodeValue;
    }

    public function getSecondFieldNodeId(): ?string
    {
        return $this->secondFieldNodeId;
    }

    public function setSecondFieldNodeId(?string $secondFieldNodeId): void
    {
        $this->secondFieldNodeId = $secondFieldNodeId;
    }

    public function getComparisonType(): ?string
    {
        return $this->comparisonType;
    }

    public function setComparisonType(?string $comparisonType): void
    {
        if (! in_array($comparisonType, self::EXPRESSION_TYPES)) {
            throw new InvalidArgumentException("Invalid expression type");
        }
        $this->comparisonType = $comparisonType;
    }

    public function evaluate($leftHandSide, $rightHandSide): bool
    {
        return match ($this->getType()) {
            Expression::LESS_THAN => $leftHandSide < $rightHandSide,
            Expression::LESS_THAN_OR_EQUAL => $leftHandSide <= $rightHandSide,
            Expression::EQUAL => $leftHandSide == $rightHandSide,
            Expression::NOT_EQUAL => $leftHandSide != $rightHandSide,
            Expression::GREATER_OR_EQUAL => $leftHandSide >= $rightHandSide,
            Expression::GREATER => $leftHandSide > $rightHandSide,
            default => false,
        };
    }


    public function getSecondFieldTimeDate(): ?string
    {
        return $this->secondFieldTimeDate;
    }


    public function setSecondFieldTimeDate(?string $secondFieldTimeDate): void
    {
        $this->secondFieldTimeDate = $secondFieldTimeDate;
    }


    public function getSecondFieldTimeDays(): ?int
    {
        return $this->secondFieldTimeDays;
    }


    public function setSecondFieldTimeDays(?int $secondFieldTimeDays): void
    {
        $this->secondFieldTimeDays = $secondFieldTimeDays;
    }


    public function getSecondFieldTimeExecutionTime(): ?string
    {
        return $this->secondFieldTimeExecutionTime;
    }


    public function setSecondFieldTimeExecutionTime(?string $secondFieldTimeExecutionTime): void
    {
        $this->secondFieldTimeExecutionTime = $secondFieldTimeExecutionTime;
    }


    public function getSecondFieldTimeMonths(): ?int
    {
        return $this->secondFieldTimeMonths;
    }


    public function setSecondFieldTimeMonths(?int $secondFieldTimeMonths): void
    {
        $this->secondFieldTimeMonths = $secondFieldTimeMonths;
    }

    public function evaluateDate($leftSide): bool
    {
        $currentDate = $this->getSecondFieldTimeDate() === "executionDate" ? new \DateTime() : new \DateTime($this->secondFieldTimeDate);
        $days = $this->getSecondFieldTimeDays(); // Assuming $entity is an instance of your entity class
        $months = $this->getSecondFieldTimeMonths();
        $years = $this->getSecondFieldTimeYears();

        $dateToCompareAgainst = new \DateTime($leftSide);
        // Create a DateInterval string representation using the extracted values
        $dateIntervalSpec = "P{$years}Y{$months}M{$days}D";

        $dateInterval = new DateInterval($dateIntervalSpec);
        if ($this->getSecondFieldTimeExecutionTime() === 'after') {
            $currentDate->add($dateInterval);
        } elseif ($this->getSecondFieldTimeExecutionTime() === 'before') {
            $currentDate->sub($dateInterval);
        }
        return $this->evaluate($dateToCompareAgainst->getTimestamp(), $currentDate->getTimestamp());
    }


    public function getSecondFieldTimeYears(): ?int
    {
        return $this->secondFieldTimeYears;
    }


    public function setSecondFieldTimeYears(?int $secondFieldTimeYears): void
    {
        $this->secondFieldTimeYears = $secondFieldTimeYears;
    }
}
