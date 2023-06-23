import { Box, Button, Heading, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Text, Textarea, useSteps } from '@chakra-ui/react';
import { Fraction, MathType, fraction, multiply } from 'mathjs';
import { useState } from "react";

import { Lottery } from "./lottery";
import { formatOdds, midpoint, oddsFromProbability } from "./probability";

export default function EquivalentBetTest() {
    const INITIAL_MIN_P = fraction('0');
    const INITIAL_MAX_P = fraction('1');

    const [minP, setMinP] = useState<MathType>(INITIAL_MIN_P);
    const [maxP, setMaxP] = useState<MathType>(INITIAL_MAX_P);

    const [belief, setBelief] = useState<string>('');
    const [stakes, setStakes] = useState<string>('');

    /**
     * Each step of the equivalent bets test.
     * 
     * Each member has the value of the step's index in the `steps` array.
     */
    enum TestStep {
        START = 0,
        BELIEF,
        STAKES,
        BET,
        RESULTS
    }

    /**
     * All the steps in the equivalent bets test.
     * 
     * The enum `TestStep` is used to index into this array.
     */
    const steps = [
        { title: 'Start', description: 'Introduction' },
        { title: 'Belief', description: 'Choose a belief' },
        { title: 'Stakes', description: 'Set betting stakes' },
        { title: 'Bet', description: 'Place your bets' },
        { title: 'Results', description: 'See your results' }
    ];

    const { activeStep, setActiveStep }
        : {
            activeStep: TestStep,
            setActiveStep: React.Dispatch<React.SetStateAction<TestStep>>
        } = useSteps({
            index: TestStep.START,
            count: steps.length,
        });

    /**
     * @returns Return the probability of the current lottery.
     */
    function lotteryProbability(): MathType {
        return midpoint(minP, maxP);
    }

    /**
     * @returns Return the odds of the current lottery.
     */
    function lotteryOdds(): Fraction {
        return oddsFromProbability(lotteryProbability());
    }

    function handleLottery() {
        setMaxP(lotteryProbability());
    }

    function handleBelief() {
        setMinP(lotteryProbability());
    }

    function handleIndifferent() {
        setActiveStep(TestStep.RESULTS);
    }

    function handleRestart() {
        setMinP(INITIAL_MIN_P);
        setMaxP(INITIAL_MAX_P);
        setActiveStep(TestStep.BELIEF);
    }

    return (
        <div>
            <Heading as="h1" size="2xl">
                Equivalent Bet Test
            </Heading>

            {activeStep !== TestStep.START && (
                <Stepper index={activeStep} py={4}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>
                            <Box flexShrink='0'>
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            )}

            {activeStep === TestStep.START && (
                <>
                    <Text>
                        Quantify how confident you are in a belief by making some high stakes bets.
                    </Text>

                    <Button onClick={() => { setActiveStep(TestStep.BELIEF); }} className="btn-next">
                        Start
                    </Button>
                </>
            )}
            {activeStep === TestStep.BELIEF && (
                <>
                    <Heading>
                        Belief
                    </Heading>
                    <Textarea placeholder="Your belief here..." value={belief}
                        onChange={({ target }) => { setBelief(target.value); }} />
                    <Button onClick={() => { setActiveStep(TestStep.STAKES); }} className="btn-next">
                        Next
                    </Button>
                </>
            )}
            {activeStep === TestStep.STAKES && (
                <>
                    <Heading>
                        Stakes
                    </Heading>
                    <Text>
                        Write some high stakes to put the pressure on. This helps you make a realistic assessment of your confidence.
                    </Text>
                    <Textarea placeholder="$10,000" value={stakes}
                        onChange={({ target }) => { setStakes(target.value); }} />
                    <Button onClick={() => { setActiveStep(TestStep.BET); }} className="btn-next">
                        Next
                    </Button>
                </>
            )}
            {activeStep === TestStep.BET && (
                <>
                    <Heading>
                        Bet
                    </Heading>
                    <Text>
                        You are given the choice between two bets. One is your belief, the other is a lottery. Choose the one you think is most likely to win.
                    </Text>

                    {belief && (
                        <Text align="left">Belief: {belief}</Text>
                    )}

                    {stakes && (
                        <Text align="left">Stakes: {stakes}</Text>
                    )}

                    <Lottery odds={lotteryOdds()} />

                    <Text>Is the belief or the lottery more likely?</Text>
                    <Button onClick={handleBelief}>Belief</Button>
                    <Button onClick={handleLottery}>Lottery</Button>
                    <Button onClick={handleIndifferent}>Indifferent</Button>
                    <Button onClick={handleRestart}>Restart</Button>
                </>
            )}
            {activeStep === TestStep.RESULTS && (
                <>
                    <Text>Your estimate of the probability that this belief is true is:</Text>
                    <Text fontSize="3xl">{multiply(lotteryProbability(), 100).toString()}% or {formatOdds(lotteryOdds())} odds</Text>
                    <Text>which is equal to the probability of winning these lotteries:</Text>
                    <Lottery odds={lotteryOdds()} />

                    <Button onClick={handleRestart} className="btn-next">Restart</Button>
                </>
            )}
        </div>
    )
}