import { withStyles } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"

const styles = {
    tooltip: {
        fontSize: 14
    }
}

export const CustomTooltip = withStyles(styles)(Tooltip);