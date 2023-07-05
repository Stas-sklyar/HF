import { CircularProgress } from "@material-ui/core"

export type PreloaderPropsType = {
    size: string
    position: "left" | "right" | "center"
}

export default function Preloader(props: PreloaderPropsType) {
    return (
        <div style={{ textAlign: "center", padding: 15 }}>
            <CircularProgress size={props.size + "px"} />
        </div>
    )
}