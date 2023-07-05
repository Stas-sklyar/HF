import { Button, Container, TextField } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { SUPPORT_EMAIL } from '../../../constants/constants'
import { RootState } from '../../../reducers/rootReducers'

import s from './InformationPage.module.scss'

export default function InformationPage() {
    const { title, textDescription, hasInput, inputPlaceholder, inputLabel, additionalBtn, buttonText, btnLink, contractSupportBtn } =
        useSelector((state: RootState) => state.infoPage)

    return (
        <div className={s["InformationPage"]}>
            <Container maxWidth="lg" className={s["InformationPage-Body"]}>
                <h1 className={s["InformationPage-Title"]}>{title}</h1>
                <p className={s["InformationPage-Description"]}>{textDescription}</p>

                {hasInput && inputPlaceholder &&
                    <TextField
                        className={s["InformationPage-Input"]}
                        type="text" variant="outlined"
                        size="small"
                        placeholder={inputPlaceholder}
                        label={inputLabel}
                    />
                }
                
                {additionalBtn && btnLink && buttonText &&
                    <NavLink className={s["InformationPage-Link"]} to={btnLink}>
                        <Button
                            className={s["InformationPage-Btn"]}
                            variant="contained" color="primary"
                        >
                            {buttonText}
                        </Button>
                    </NavLink>
                }

                {contractSupportBtn &&
                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className={s["InformationPage-ContractSupportLink"]}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            Contact Support
                        </Button>
                    </a>
                }
            </Container>
        </div>
    )
}