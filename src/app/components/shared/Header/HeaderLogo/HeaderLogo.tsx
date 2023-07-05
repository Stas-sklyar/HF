import { NavLink } from 'react-router-dom'
import s from '../Header.module.scss'
import Logo from '../../../../../images/main-logo.png'

export default function HeaderLogo() {
    return (
        <a href="https://hopefunding.com/" target="_blank">
            <img className={s['Header-Logo']} src={Logo} alt="logo" />
        </a>
    )
}