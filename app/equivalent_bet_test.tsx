'use client';

import { useState } from "react";
import BallLottery from "./ball_lottery";
import { multiply, fraction, MathType, Fraction } from 'mathjs';
import { formatOdds, midpoint, oddsFromProbability } from "./probability";
import dynamic from "next/dynamic";

export default function EquivalentBetTest() {
    const INITIAL_MIN_P = fraction('0');
    const INITIAL_MAX_P = fraction('1');

    const [minP, setMinP] = useState<MathType>(INITIAL_MIN_P);
    const [maxP, setMaxP] = useState<MathType>(INITIAL_MAX_P);
    const [isFinalAnswer, setIsFinalAnswer] = useState<boolean>(false);

    enum LotteryDisplay { BALL, WHEEL };
    const [displayedLottery, setDisplayedLottery] = useState<LotteryDisplay>(LotteryDisplay.BALL);

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
        setIsFinalAnswer(true);
    }

    function handleRestart() {
        setMinP(INITIAL_MIN_P);
        setMaxP(INITIAL_MAX_P);
        setIsFinalAnswer(false);
    }

    const DynamicWheelLottery = dynamic(() => import('./wheel_lottery'), {
        ssr: false,
    });

    return (
        <div>
            <h1>
                Equivalent Bet Test
            </h1>
            <p>
                Use this test to quantify how confident you are in a belief by making some bets for high stakes.
            </p>
            <h2>
                Belief
            </h2>
            <textarea placeholder="Your belief here..." />

            <h2>
                Stakes
            </h2>
            <p>
                Write some high stakes to put the pressure on. This helps you make a realistic assessment of your confidence.
            </p>
            <textarea placeholder="$10,000" />

            {
                <>
                    {
                        isFinalAnswer ? (
                            <>
                                <p>Your estimate of the probability that this belief is true is:</p>
                                <p>{multiply(lotteryProbability(), 100).toString()}% or {formatOdds(lotteryOdds())} odds.</p>
                            </>
                        ) : (
                            <>
                                <h2>
                                    Bet
                                </h2>
                                <p>
                                    You are given the choice between two bets. One is your belief, the other is a lottery. Choose the one you think is most likely to win.
                                </p>

                                <button onClick={() => { setDisplayedLottery(LotteryDisplay.BALL); }}>
                                    Ball Lottery
                                </button>
                                <button onClick={() => { setDisplayedLottery(LotteryDisplay.WHEEL); }}>
                                    Wheel Lottery
                                </button>

                                {displayedLottery === LotteryDisplay.BALL
                                    ? (
                                        <>
                                            <h3>
                                                Ball Lottery
                                            </h3>
                                            <BallLottery odds={lotteryOdds()} />
                                        </>
                                    )
                                    : displayedLottery === LotteryDisplay.WHEEL
                                        ? (
                                            <>
                                                <h3>
                                                    Wheel Lottery
                                                </h3>
                                                <DynamicWheelLottery odds={lotteryOdds()} />
                                            </>
                                        )
                                        : null}

                                <p>Is the belief or the lottery more likely?</p>
                                <button onClick={handleBelief}>Belief</button>
                                <button onClick={handleLottery}>Lottery</button>
                                <button onClick={handleIndifferent}>Indifferent</button>

                            </>
                        )
                    }
                    <button onClick={handleRestart}>Restart</button>
                </>
            }
        </div>
    )
}