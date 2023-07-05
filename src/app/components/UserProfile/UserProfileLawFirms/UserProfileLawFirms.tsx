import dateFormatting from '../../../scripts/dateFormatting'
import s from '../UserProfile.module.scss'
import InfoIcon from '@material-ui/icons/Info'
import { CustomTooltip } from '../../shared/CustomTooltip/CustomTooltip'

type UserProfileLawFirmsPropsType = {
    lawFirms: Array<any>
}

export default function UserProfileLawFirms(props: UserProfileLawFirmsPropsType) {

    let lawFirmsArr = props.lawFirms.map((_) => { return _; })

    let sortedLawFirmArr = lawFirmsArr.sort((item1: any, item2: any) => {
        let startDate1: any = new Date(item1.startDate)
        let startDate2: any = new Date(item2.startDate)
        return startDate2 - startDate1;
    })

    return (
        <>
            <h1 className={s["UserProfile-Title"]}>Law Firms</h1>
            {sortedLawFirmArr.length > 0 &&
                <ul className={s["UserProfile-List"]}>
                    {
                        sortedLawFirmArr.map((lawFirm: any) => {
                            return (
                                <li className={s["UserProfile-Item"]} key={lawFirm.lawFirmUserId}>
                                    <div>
                                        <div><b>{lawFirm.firstName + ""}</b></div>
                                        <div>{dateFormatting(lawFirm.startDate) + " - " + (lawFirm.present ? "Present" : dateFormatting(lawFirm.endDate))}</div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            }
            {sortedLawFirmArr.length === 0 &&
                <div className={s["UserProfile-Item"]}>Law Firms not found</div>
            }
        </>
    )
}