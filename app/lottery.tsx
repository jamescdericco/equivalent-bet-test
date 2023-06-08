import { Odds } from "./odds"

interface Props {
    odds: Odds
}

export default function Lottery({ odds }: Props) {
    return (
        <div>
            <label>Lottery Odds:
                <span>{odds.antecedent} : {odds.consequent}</span>
            </label>
        </div>
    )
}