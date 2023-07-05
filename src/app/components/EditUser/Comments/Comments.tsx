import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import AddBtn from '../../shared/AddBtn/AddBtn'
import s from './Comments.module.scss'
import { useEffect, useState } from 'react'
import Preloader from '../../shared/Preloader/Preloader'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 200,
            marginBottom: 20,
            marginRight: 30
        },
        input: {
            width: 100 + "%",
            marginBottom: 20,
        },
        dateInput: {
            width: 170,
            marginBottom: 10
        }
    }),
);

export default function Comments(props: any) {
    const classes = useStyles()
    const [addCommentSection, setAddCommnetSection] = useState(false)

    const [currentDate, setCurrentDate] = useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    )

    const handleDateChange = (date: Date | null) => {
        setCurrentDate(date)
    }

    const [userData, setUserData] = useState(props.data)
    useEffect(() => {
        setUserData(props.data)
    }, [props])

    if (!props) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else {
        return (
            <section className={s["Comments"]}>
                <h1>Comments</h1>
                {!(userData?.userNames) &&
                    <h2 style={{ padding: "15px 0" }}>Comments not found</h2>
                }

                <div onClick={() => setAddCommnetSection(!addCommentSection)}>
                    <AddBtn text="New Comment" />
                </div>

                {addCommentSection &&
                    <div className={s["Comments-AddCommentSection"]}>
                        <div className={s["Comments-CommentInfo"]}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="user-creating-comment-label">Comment Creator</InputLabel>
                                <Select labelId="user-creating-comment-label" >
                                    <MenuItem value="Admin 1">Admin 1</MenuItem>
                                    <MenuItem value="Admin 2">Admin 2</MenuItem>
                                </Select>
                            </FormControl>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={classes.dateInput} value={currentDate} disableToolbar variant="inline" format="MM/dd/yyyy" label="Comment Date"
                                    onChange={(data) => handleDateChange(data)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>

                        <TextField label="Comment" variant="outlined" className={classes.input} size="small" />

                    </div>
                }
            </section>
        )
    }
}
