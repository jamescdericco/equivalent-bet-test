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

    enum Step {
        START,
        BELIEF,
        STAKES,
        BET,
        RESULTS
    };

    const [step, setStep] = useState<Step>(Step.START);

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
            <h1>
                Equivalent Bet Test
            </h1>
            {step === Step.START && (
                <>
                    <p>
                        Quantify how confident you are in a belief by making some high stakes bets.
                    </p>

                    <button onClick={() => { setStep(Step.BELIEF); }} className="btn-next">
                        Start
                    </button>
                </>
            )}
            {step === Step.BELIEF && (
                <>
                    <h2>
                        Belief
                    </h2>
                    <textarea placeholder="Your belief here..." />
                    <button onClick={() => { setStep(Step.STAKES); }} className="btn-next">
                        Next
                    </button>
                </>
            )}
            {step === Step.STAKES && (
                <>
                    <h2>
                        Stakes
                    </h2>
                    <p>
                        Write some high stakes to put the pressure on. This helps you make a realistic assessment of your confidence.
                    </p>
                    <textarea placeholder="$10,000" />
                    <button onClick={() => { setStep(Step.BET); }} className="btn-next">
                        Next
                    </button>
                </>
            )}
            {step === Step.BET && (
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

                    {displayedLottery === LotteryDisplay.BALL && (
                        <>
                            <h3>
                                Ball Lottery
                            </h3>
                            <BallLottery odds={lotteryOdds()} />
                        </>
                    )}
                    {displayedLottery === LotteryDisplay.WHEEL && (
                        <>
                            <h3>
                                Wheel Lottery
                            </h3>
                            <DynamicWheelLottery odds={lotteryOdds()} />
                        </>
                    )}

                    <p>Is the belief or the lottery more likely?</p>
                    <button onClick={handleBelief}>Belief</button>
                    <button onClick={handleLottery}>Lottery</button>
                    <button onClick={handleIndifferent}>Indifferent</button>
                    <button onClick={handleRestart}>Restart</button>
                </>
            )}
            {step === Step.RESULTS && (
                <>
                    <p>Your estimate of the probability that this belief is true is:</p>
                    <p><strong>{multiply(lotteryProbability(), 100).toString()}% or {formatOdds(lotteryOdds())} odds</strong></p>
                    <p>which is equal to the probability of winning these lotteries:</p>
                    <h3>
                        Ball Lottery
                    </h3>
                    <BallLottery odds={lotteryOdds()} />

                    <h3>
                        Wheel Lottery
                    </h3>
                    <DynamicWheelLottery odds={lotteryOdds()} />
                    <button onClick={handleRestart} className="btn-next">Restart</button>
                </>
            )}
        </div>
    )
}