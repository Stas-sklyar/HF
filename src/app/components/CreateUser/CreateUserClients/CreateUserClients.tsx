import AddBtn from '../../shared/AddBtn/AddBtn'
import s from '../CreateUser.module.scss'

export default function CreateUserClients() {

    return (
        <section className={s["CreateUserClients"]}>
            <h1 className={s["CreateUserClients-Title"]}>Associated Cases and Clients</h1>
            <AddBtn text="Add to Existing Case" />
        </section>
    )
}