import AddBtn from '../../shared/AddBtn/AddBtn'
import s from '../CreateUser.module.scss'

export default function CreateUserAddComment() {

    return (
        <section className={s["CreateUserAddComment"]}>
            <h1 className={s["CreateUserAddComment-Title"]}>Comments</h1>
            <AddBtn text="Add to Existing Case" />
        </section>
    )
}