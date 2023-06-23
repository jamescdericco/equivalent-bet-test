'use client';

import { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, Heading } from '@chakra-ui/react'
import BallLottery from "./ball_lottery";
import { multiply, fraction, MathType, Fraction } from 'mathjs';
import { formatOdds, midpoint, oddsFromProbability } from "./probability";
import dynamic from "next/dynamic";

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

    const DynamicWheelLottery = dynamic(() => import('./wheel_lottery'), {
        ssr: false,
    });

    return (
        <div>
            <Heading as="h1" size="2xl">
                Equivalent Bet Test
            </Heading>
            {step === Step.START && (
                <>
                    <p>
                        Quantify how confident you are in a belief by making some high stakes bets.
                    </p>

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
                    <textarea placeholder="Your belief here..." value={belief}
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
                    <p>
                        Write some high stakes to put the pressure on. This helps you make a realistic assessment of your confidence.
                    </p>
                    <textarea placeholder="$10,000" value={stakes}
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
                    <p>
                        You are given the choice between two bets. One is your belief, the other is a lottery. Choose the one you think is most likely to win.
                    </p>

                    {belief && (
                        <div style={{ textAlign: "left" }}>
                            <label>
                                Belief:
                                <span> {belief}</span>
                            </label>
                        </div>
                    )}

                    {stakes && (
                        <div style={{ textAlign: "left" }}>
                            <label>
                                Stakes:
                                <span> {stakes}</span>
                            </label>
                        </div>
                    )}

                    <Tabs isFitted variant="enclosed">
                        <TabList>
                            <Tab>Ball Lottery</Tab>
                            <Tab>Wheel Lottery</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <BallLottery odds={lotteryOdds()} />
                            </TabPanel>
                            <TabPanel>
                                <DynamicWheelLottery odds={lotteryOdds()} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    <p>Is the belief or the lottery more likely?</p>
                    <Button onClick={handleBelief}>Belief</Button>
                    <Button onClick={handleLottery}>Lottery</Button>
                    <Button onClick={handleIndifferent}>Indifferent</Button>
                    <Button onClick={handleRestart}>Restart</Button>
                </>
            )}
            {step === Step.RESULTS && (
                <>
                    <p>Your estimate of the probability that this belief is true is:</p>
                    <p><strong>{multiply(lotteryProbability(), 100).toString()}% or {formatOdds(lotteryOdds())} odds</strong></p>
                    <p>which is equal to the probability of winning these lotteries:</p>
                    <Heading>
                        Ball Lottery
                    </Heading>
                    <BallLottery odds={lotteryOdds()} />

                    <Heading>
                        Wheel Lottery
                    </Heading>
                    <DynamicWheelLottery odds={lotteryOdds()} />
                    <Button onClick={handleRestart} className="btn-next">Restart</Button>
                </>
            )}
        </div>
    )
}