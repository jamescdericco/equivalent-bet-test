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

    function handleProposition() {
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
            <h2>
                Proposition
            </h2>
            <textarea name="proposition" placeholder="Your proposition here..." />

            <h2>
                Stakes
            </h2>
            <textarea name="stakes" placeholder="$10,000" />

            {
                <>
                    {
                        isFinalAnswer ? (
                            <>
                                <p>Your estimate of the probability of this proposition is:</p>
                                <p>{multiply(lotteryProbability(), 100).toString()}% or {formatOdds(lotteryOdds())} odds.</p>
                            </>
                        ) : (
                            <>
                                <h2>
                                    Ball Lottery
                                </h2>
                                <BallLottery odds={lotteryOdds()} />

                                <h2>
                                    Wheel Lottery
                                </h2>
                                <DynamicWheelLottery odds={lotteryOdds()} />

                                <p>Is the proposition or the lottery more likely?</p>
                                <button onClick={handleProposition}>Proposition</button>
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