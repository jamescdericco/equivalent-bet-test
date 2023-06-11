'use client';

import { useState } from "react";
import BallLottery from "./ball_lottery";
import { divide, add, subtract, fraction, MathType } from 'mathjs';

export default function EquivalentBetTest() {
    function midpoint(a: MathType, b: MathType): MathType {
        return divide(add(a, b), fraction('2'));
    }

    const [minP, setMinP] = useState<MathType>(fraction('0'));
    const [maxP, setMaxP] = useState<MathType>(fraction('1'));
    const lotteryP: MathType = midpoint(minP, maxP);

    function oddsFromProbability(p: MathType): MathType {
        return divide(p, subtract(fraction('1'), p));
    }

    const [lotteryOdds, setLotteryOdds] = useState<MathType>(oddsFromProbability(lotteryP));

    console.log('lotteryP', lotteryP);
    console.log('lotteryOdds', lotteryOdds);

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

    return (
        <div>
            <label>Proposition:
                <input name="proposition" type="text" />
            </label>
            
            {
                finalAnswer ? (
                    <p>Therefore you estimated that the probability of the proposition being true is {lotteryP.toString()}</p>
                ) : (
                    <>
                        <BallLottery odds={lotteryOdds} />
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