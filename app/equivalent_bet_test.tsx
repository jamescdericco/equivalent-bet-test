'use client';

import { useState } from "react";
import { Button, Heading, Text, Textarea } from '@chakra-ui/react'
import { multiply, fraction, MathType, Fraction } from 'mathjs';
import { formatOdds, midpoint, oddsFromProbability } from "./probability";
import { Lottery } from "./lottery";

export default function EquivalentBetTest() {
    const INITIAL_MIN_P = fraction('0');
    const INITIAL_MAX_P = fraction('1');

    const [minP, setMinP] = useState<MathType>(INITIAL_MIN_P);
    const [maxP, setMaxP] = useState<MathType>(INITIAL_MAX_P);

    const [belief, setBelief] = useState<string>('');
    const [stakes, setStakes] = useState<string>('');

    enum Step {
        START,
        BELIEF,
        STAKES,
        BET,
        RESULTS
    };

    const [step, setStep] = useState<Step>(Step.START);

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
        setStep(Step.RESULTS);
    }

    function handleRestart() {
        setMinP(INITIAL_MIN_P);
        setMaxP(INITIAL_MAX_P);
        setStep(Step.BELIEF);
    }

    return (
        <div>
            <Heading as="h1" size="2xl">
                Equivalent Bet Test
            </Heading>
            {step === Step.START && (
                <>
                    <Text>
                        Quantify how confident you are in a belief by making some high stakes bets.
                    </Text>

                    <Button onClick={() => { setStep(Step.BELIEF); }} className="btn-next">
                        Start
                    </Button>
                </>
            )}
            {step === Step.BELIEF && (
                <>
                    <Heading>
                        Belief
                    </Heading>
                    <Textarea placeholder="Your belief here..." value={belief}
                        onChange={({ target }) => { setBelief(target.value); }} />
                    <Button onClick={() => { setStep(Step.STAKES); }} className="btn-next">
                        Next
                    </Button>
                </>
            )}
            {step === Step.STAKES && (
                <>
                    <Heading>
                        Stakes
                    </Heading>
                    <Text>
                        Write some high stakes to put the pressure on. This helps you make a realistic assessment of your confidence.
                    </Text>
                    <Textarea placeholder="$10,000" value={stakes}
                        onChange={({ target }) => { setStakes(target.value); }} />
                    <Button onClick={() => { setStep(Step.BET); }} className="btn-next">
                        Next
                    </Button>
                </>
            )}
            {step === Step.BET && (
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
            {step === Step.RESULTS && (
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