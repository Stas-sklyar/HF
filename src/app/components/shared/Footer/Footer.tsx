
import { Container } from '@material-ui/core'
import { SUPPORT_EMAIL } from '../../../constants/constants'

import s from './Footer.module.scss'
import { NavLink } from 'react-router-dom'


export default function Footer() {
    const scrollToTop = (): void => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className={s["Footer"]}>
            <Container maxWidth="lg" className={s["Footer-Body"]} >
                <ul className={s["Footer-List"]}>
                    <li className={s["Footer-Item"]}>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className={s['Footer-Link']}>Contact Us</a>
                    </li>
                    <li className={s["Footer-Item"]} onClick={() => scrollToTop()}>
                        <NavLink to="/terms-and-conditions" className={s['Footer-Link']}>
                            Terms & Conditions
                        </NavLink>
                    </li>
                    <li className={s["Footer-Item"]} onClick={() => scrollToTop()}>
                        <NavLink to="/privacy-policy" className={s['Footer-Link']}>
                            Privacy Policy
                        </NavLink>
                    </li>
                </ul>
            </Container>
        </div>
    );
}