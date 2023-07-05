import { Button, createStyles, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {useRef, useState} from 'react'
import { useDispatch } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../../../actions/actions'
import { URL_FOR_API } from '../../../../constants/constants'
import actionsWithApi from '../../../../customHooks/actionsWithApi'
import s from '../AssociatedAttorneys.module.scss'

const useStyles = makeStyles(() =>
    createStyles({
        autocomplete: {
            width: 220,
            marginRight: 20
        },
        btn: {
            height: 40
        }
    }),
);

type AddAssociatedAttorneyPropsType = {
    addExistingAttorney(e: React.FormEvent<EventTarget>): void
    setSelectedAttorney(attorneyId: number | null): void
    addAttorneyToggle: boolean
}

export default function AddAssociatedAttorney(props: AddAssociatedAttorneyPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [attorneys, setAttorneys] = useState<any[]>([])

    const getAttorneys = async (searchValue: string = "") => {
        if (searchValue.length < 3) {
            return
        }

        try {
            setLoaderIsActive(true)
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Autocomplete/attorney?userName=${searchValue}`)
            setAttorneys(response.data)
            setLoaderIsActive(false)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
            setLoaderIsActive(false)
            setAttorneys([])
        }
    }

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            getAttorneys(value)
        }, 500)
    }

    return (
        <form onSubmit={(e) => props.addExistingAttorney(e)} className={s["AssociatedAttorneys-AddAttorneyPanel"]}>
            <Autocomplete
                options={attorneys || []}
                loading={loaderIsActive}
                getOptionLabel={(option: any) =>
                    (option.firstName ? (option.firstName.toString() + " ") : "") +
                    (option.lastName ? option.lastName.toString() + "" : "")
                }
                className={classes.autocomplete}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Attorneys"
                        variant="outlined"
                        fullWidth
                        required
                        onChange={e => handleAutocomplete(e.target.value || "")}
                    />
                )}
                onChange={(e, value) => props.setSelectedAttorney(value.id || null)}
            />

            <Button
                type="submit"
                variant="contained" color="primary"
                className={classes.btn}
            >
                Add Attorney
            </Button>
        </form>
    )
}