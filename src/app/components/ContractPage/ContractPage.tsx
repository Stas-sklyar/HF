import PreSettlement from "./PreSettlement/PreSettlement"
import ContractInfo from "./ContractInfo/ContractInfo"
import StatisticsInfo from "./StatisticsInfo/StatisticsInfo"
import GeneralInfo from "./GeneralInfo/GeneralInfo"
import { useDispatch } from "react-redux"
import { Container, Divider } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import GetAppIcon from '@material-ui/icons/GetApp'
import s from "./ContractPage.module.scss"
import getCookie from "../../scripts/getCookie"
import { URL_FOR_API } from "../../constants/constants"
import actionsWithApi from "../../customHooks/actionsWithApi"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { NavLink } from "react-router-dom"
import { toggleNotification, setNotificationInfo } from "../../actions/actions"
import Ratings from "./Ratings/Ratings"
import Preloader from "../shared/Preloader/Preloader"
import ResponsibleUsers from "./ResponsibleUsers/ResponsibleUsers"
import ContractComments from "./ContractComments/ContractComments"
import { downloadBase64File } from "../../scripts/downloadBase64File"

export default function ContractPage() {
	const dispatch = useDispatch()
	const userRole = getCookie("currentUserRole")
	const currentUserRole = getCookie("currentUserRole")
	const currentUserStatus = getCookie("currentUserStatus")
	const location = useLocation()
	const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
	const [additionalFundingHasBeenAdded, setAdditionalFundingHasBeenAdded] = useState<boolean>(false)
	const [preloaderForUploadPayoffStatementIsActive, setPreloaderForUploadPayoffStatementIsActive] = useState<boolean>(false)
	const [contractData, setContractData] = useState<any>()
	const getContractData = async () => {
		try {
			let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Contract/${contractId}`, null)
			setContractData(response.data)
		}
		catch (error) {
			console.log(error.message)
		}
	}
	useEffect(() => {
		getContractData()
	}, [additionalFundingHasBeenAdded])

	const downloadPayoffStatement = async (contractId: number) => {
		if(preloaderForUploadPayoffStatementIsActive) {
			return
		}

		try {
			setPreloaderForUploadPayoffStatementIsActive(true)
			let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Contract/${contractId}/payoffStatement`)
			downloadBase64File(response.data.mimeType, response.data.base64Content, response.data.fileName)
		}
		catch (error) {
			console.log(error.message)
			dispatch(toggleNotification(true))
			dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
		} finally {
			setPreloaderForUploadPayoffStatementIsActive(false);
		}
	}

	if (!contractData) {
		return (
			<Preloader size="100" position="center" />
		)
	}
	else {
		return (
			<Container maxWidth="lg" className={s["ContractPage"]}>

				<div className={s["ContractPage-Icons"]}>
					{currentUserRole === "Administrator" && currentUserStatus === "Approved" &&
						<NavLink to={`edit-contract?${contractId}`} className={s["ContractPage-EditBox"]} >
							<span>Edit</span>
							<EditIcon className="PrimaryIcon" />
						</NavLink>
					}

					<div
						className={ s["ContractPage-DownloadBox"] + " " + (preloaderForUploadPayoffStatementIsActive ? s["ContractPage-DownloadBox--Disabled"] : "") }
						onClick={() => downloadPayoffStatement(contractData.id)}
					>
						<span>Payoff Statement</span>
						<GetAppIcon className="PrimaryIcon" />
						{preloaderForUploadPayoffStatementIsActive && <Preloader size="35" position="center" />}
					</div>
				</div>

				<PreSettlement
					data={contractData}
					additionalFundingHasBeenAdded={additionalFundingHasBeenAdded}
					setAdditionalFundingHasBeenAdded={setAdditionalFundingHasBeenAdded}
				/>
				<Divider />
				<ContractInfo data={contractData} />
				<Divider />
				<ResponsibleUsers contractData={contractData} />
				<Divider />

				{userRole === "Administrator" &&
					<div>
						<Ratings contractData={contractData} />
						<Divider />
					</div>
				}

				{userRole === "Administrator" &&
					<div>
						<StatisticsInfo contractData={contractData} />
						<Divider />
					</div>
				}

				<GeneralInfo data={contractData} />
				<Divider className={s["ContractPage-Divider"]} />

				<ContractComments comments={contractData.contractComments} />

			</Container >
		)
	}
}