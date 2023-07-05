import { createStyles, makeStyles, TextField, Theme } from "@material-ui/core"
import { NavLink } from "react-router-dom";
import dateFormatting from "../../../scripts/dateFormatting";
import Preloader from "../../shared/Preloader/Preloader";
import s from "./GeneralInfo.module.scss"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            width: 280,
            marginBottom: 20,
            "&:last-child": {
                marginBottom: 0
            },
            [theme.breakpoints.down('sm')]: {
                width: "100%",
            }
        }
    }),
)

export default function GeneralInfo({ data }: any) {
    const classes = useStyles()

    if (data) {
        return (
            <div className={s["GeneralInfo"]}>
                <h1 className={s["GeneralInfo-Title"]}>General Information</h1>
                <div className={s["GeneralInfo-List"]}>
                    <div className={s["GeneralInfo-AttorneysList"]}>
                        {data?.contractAttorneyDTO.length > 0 && data?.contractAttorneyDTO
                            .map((attorney: any) => {
                                if (!attorney.responsible) {
                                    return (
                                        <div className={s["GeneralInfo-AttorneyItem"]} key={attorney.user.id}>
                                            <b>Previous Attorney: </b>
                                            <NavLink
                                                to={`user-profile?${attorney.user.id}`}
                                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                            >
                                                {attorney.user.firstName + " " + attorney.user.lastName}
                                            </NavLink>
                                        </div>
                                    )
                                }
                            }
                            )
                        }
                    </div>
                    <div className={s["GeneralInfo-LawFirmsList"]}>
                        {data?.contractLawFirmDTO.length > 0 && data?.contractLawFirmDTO
                            .map((lawFirm: any) => {
                                if (!lawFirm.responsible) {
                                    return (
                                        <div className={s["GeneralInfo-LawFirmItem"]} key={lawFirm.user.id}>
                                            <b>Previous Law Firm: </b>
                                            <NavLink to={`user-profile?${lawFirm.user.id}`}
                                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                            >
                                                {lawFirm.user.firstName}
                                            </NavLink>
                                        </div>
                                    )
                                }
                            }
                            )
                        }
                    </div>
                    <TextField className={classes.input} variant="outlined" size="small"
                        value={data.estimatedDuration ? dateFormatting(data.estimatedDuration) : ""}
                        label="Expected or Existing Settlement Date" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.recipientCheck} label="Check Recipient" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.opposingInsurance} label="Opposing Insurance" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.insuranceAdjuster} label="Insurance Adjuster" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.adjusterPhone} label="Insurance Adjuster Phone #" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.claimNumber} label="Insurance Claim #" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.liability ? "Yes" : "No"} label="Accepted Liability" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.propertyDamage} label="Property Damage" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.injuryLevel} label="Injury level" />
                    <TextField className={classes.input} variant="outlined" size="small" value={dateFormatting(data.dateAccident)} label="Date of accident or injury" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.caseManager} label="Case manager" />
                    <TextField className={classes.input} variant="outlined" size="small" value={data.accidentDescription} label="Injury/Accident Description" />
                </div>
            </div>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}