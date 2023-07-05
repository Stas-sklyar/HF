import GetAppIcon from '@material-ui/icons/GetApp';

import s from './DownloadBtn.module.scss'

type DownloadBtnType = {
    text: string
}

export default function DownloadBtn(props: DownloadBtnType) {
    return (
        <div className={s["DownloadBtn"]}>
            <div>{props.text}</div>
            <GetAppIcon />
        </div>
    )
}