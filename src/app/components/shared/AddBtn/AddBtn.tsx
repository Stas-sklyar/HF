import AddCircleIcon from '@material-ui/icons/AddCircle'

import s from './AddBtn.module.scss'

export type AddBtnType = {
    text: string
}

export default function AddBtn({text}: AddBtnType) {
    return (
        <div className={s["AddBtn"]}>
            <AddCircleIcon className="PrimaryIcon" />
            <button>{text}</button>
        </div>
    )
}