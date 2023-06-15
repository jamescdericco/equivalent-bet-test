'use client';

import { useState } from "react";
import BallLottery from "./ball_lottery";
import { add, subtract, multiply, divide, fraction, MathType, Fraction } from 'mathjs';
import { formatOdds } from "./probability";
import dynamic from "next/dynamic";

export default function EquivalentBetTest() {
    function midpoint(a: MathType, b: MathType): MathType {
        return divide(add(a, b), fraction('2'));
    }

    function oddsFromProbability(p: MathType): Fraction {
        const odds = divide(p, subtract(fraction('1'), p))
        return odds as Fraction;
    }

    const [minP, setMinP] = useState<MathType>(fraction('0'));
    const [maxP, setMaxP] = useState<MathType>(fraction('1'));

    const lotteryP: MathType = midpoint(minP, maxP);
    const [lotteryOdds, setLotteryOdds] = useState<Fraction>(oddsFromProbability(lotteryP));
    const [finalAnswer, setFinalAnswer] = useState<MathType | null>(null);

    function handleLottery() {
        setMaxP(lotteryP);
        const newLotteryOdds = oddsFromProbability(midpoint(minP, lotteryP));
        setLotteryOdds(newLotteryOdds);
    }

    function handleProposition() {
        setMinP(lotteryP);
        const newLotteryOdds = oddsFromProbability(midpoint(lotteryP, maxP));
        setLotteryOdds(newLotteryOdds);
    }

    function handleIndifferent() {
        setFinalAnswer(lotteryP);
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

            {
                finalAnswer ? (
                    <p>Your estimate of the probability of this proposition is: {multiply(lotteryP, 100).toString()}% or {formatOdds(lotteryOdds)} odds.</p>
                ) : (
                    <>
                        <h2>
                            Ball Lottery
                        </h2>
                        <BallLottery odds={lotteryOdds} />

                        <h2>
                            Wheel Lottery
                        </h2>
                        <DynamicWheelLottery odds={lotteryOdds} />

                        <p>Is the proposition or the lottery more likely?</p>
                        <button onClick={handleProposition}>Proposition</button>
                        <button onClick={handleLottery}>Lottery</button>
                        <button onClick={handleIndifferent}>Indifferent</button>
                    </>
                )
            }
        </div>
    )
}