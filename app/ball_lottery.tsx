import { MathType, format } from "mathjs"

interface Props {
    odds: MathType
}

export default function BallLottery({ odds }: Props) {
    return (
        <div>
            <label>Lottery Odds:
                <span>{format(odds)}</span>
            </label>
        </div>
    )
}