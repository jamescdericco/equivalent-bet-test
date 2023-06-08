'use client';

import { useState } from "react";
import Lottery from "./lottery";
import { Odds } from "./odds";

export default function EquivalentBetTest() {
    const [currentOdds, setOdds] = useState({ antecedent: 1, consequent: 2 });
    const NO_FINAL_ANSWER: Odds | null = null;
    const [finalAnswer, setFinalAnswer] = useState(NO_FINAL_ANSWER);

    function increaseAntecedentOdds(odds: Odds): Odds {
        return { antecedent: 3, consequent: 4 };
    }

    function increaseConsequentOdds(odds: Odds) {
        return { antecedent: 1, consequent: 4 };
    }

    function handleIndifferent() {
        setFinalAnswer(currentOdds);
    }

    return (
        <div>
            <label>Proposition:
                <input name="proposition" type="text" />
            </label>
            
            {
                finalAnswer ? (
                    <p>Therefore you estimated that the odds of the proposition being true is {finalAnswer.antecedent} : {finalAnswer.consequent}</p>
                ) : (
                    <>
                        <Lottery odds={currentOdds} />
                        <p>Is the proposition or the lottery more likely?</p>
                        <button onClick={() => setOdds(increaseAntecedentOdds(currentOdds))}>Proposition</button>
                        <button onClick={() => setOdds(increaseConsequentOdds(currentOdds))}>Lottery</button>
                        <button onClick={handleIndifferent}>Indifferent</button>
                    </>
                )
            }

        </div>
    )
}