import { Button, Container } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import WarningIcon from '@material-ui/icons/Warning'
import StarOutlineIcon from '@material-ui/icons/StarOutline'
import { useDispatch } from 'react-redux'
import CasesTable from '../shared/CasesTable/CasesTable'
import Statistics from '../shared/Statistics/Statistics'
import RatingTable from '../shared/RatingTable/RatingTable'
import GetAppIcon from '@material-ui/icons/GetApp'
import { useEffect, useState } from 'react'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { URL_FOR_API } from '../../constants/constants'
import { Link, useLocation } from 'react-router-dom'
import getCookie from '../../scripts/getCookie'
import UserProfileLawFirms from './UserProfileLawFirms/UserProfileLawFirms'
import dateFormatting from '../../scripts/dateFormatting'
import Preloader from '../shared/Preloader/Preloader'
import s from './UserProfile.module.scss'
import { convertFileToBase64 } from '../../scripts/toBase64'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import DeleteIcon from '@material-ui/icons/Delete'
import Skeleton from '@material-ui/lab/Skeleton/Skeleton'
import UserContracts from "./UserContracts/UserContracts";

export default function UserProfile() {
    const dispatch = useDispatch()
    let location = useLocation()
    const token = getCookie("token")
    const currentUserRole = getCookie("currentUserRole")
    const currentUserStatus = getCookie("currentUserStatus")
    const currentUserId = parseInt(getCookie("currentUserId") + "")
    let userId = parseInt(location.search.split("").slice(1, location.search.split("").length).join("") + "")

    const [userRatingIsVisible, setUserRatingIsVisible] = useState<boolean>(false)
    const [userStatisticIsVisible, setUserStatisticIsVisible] = useState<boolean>(false)

    const [userData, setUserData] = useState<any>()
    const [lettersForProfilePicture, setLettersForProfilePicture] = useState<string>("")
    const getUserData = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User/${userId}`, null)
            setUserData(response.data)
            setLettersForProfilePicture(
                (response.data.firstName ? response.data.firstName[0] : "") + " " +
                (response.data.lastName ? response.data.lastName[0] : "")
            )
            return response.data
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const [userContracts, setUserContracts] = useState<any>([])
    const getUserContracts = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Contract/all/${userId}`, null)
            setUserContracts(response.data)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const [userAvgRating, setUserAvgRating] = useState<number | null>()
    const getUserAvgRating = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Statistics/${userId}/getAvgRating`)
            setUserAvgRating(response.data)
        }
        catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getUserData()
            .then((userData) => {
                currentUserRole === "Administrator"
                    && (userData.userType === "Attorney" || userData.userType === "LawFirm")
                    && getUserAvgRating()
            })
        getUserContracts()

    }, [userId])

    const [userIsActive, setUserIsActive] = useState<boolean>(false)
    const [dateOfFirstContract, setDateOfFirstContract] = useState<string>("")
    const calcUserActiveProp = (userContracts: any) => {
        let currentDate: any = new Date()
        let oneDay = 1000 * 60 * 60 * 24 //Get 1 day in milliseconds

        // iterate over all contracts in a loop
        for (let i = 0; i < userContracts.length; i++) {

            // iterate over the contractStatus array in a loop
            for (let j = 0; j < userContracts[i].contractStatus.length; j++) {

                // if you have encountered the CheckSent status
                if (userContracts[i].contractStatus[j].contractsStatus === "CheckSent") {

                    // from today's date we subtract the date when the status was changed to CheckSent
                    let dateOfChangeToCheckSentStatus: any = new Date(userContracts[i].contractStatus[j].dateChange)
                    let amountDaysWhenStatusChange = Math.ceil((currentDate - dateOfChangeToCheckSentStatus) / oneDay)
                    setDateOfFirstContract(dateFormatting(dateOfChangeToCheckSentStatus.toISOString()))

                    // we get the number of days and if the number is less than 180, then our user will have the active status
                    if (amountDaysWhenStatusChange <= 180) {
                        setUserIsActive(true)
                        return;
                    }
                }
            }
        }
    }
    useEffect(() => {
        calcUserActiveProp(userContracts)
    }, [userContracts])

    const [uploadedAvatar, setUploadedAvatar] = useState<string>("")
    const [avatarIsLoading, setAvatarIsLoading] = useState<boolean>(false)
    const uploadAvatar = (files: FileList | null) => {
        if (files) {
            const file = files[0]

            if (file.type === "image/png" || file.type === "image/jpeg") {
                convertFileToBase64(file).then(async (fileInBase64: any) => {
                    setAvatarIsLoading(true)
                    let uploadAvatarData = {
                        mimeType: file.type,
                        documentBase64String: fileInBase64
                    }

                    try {
                        let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/User/${currentUserId}/uploadAvatar`, uploadAvatarData)
                        setUploadedAvatar(response.data.documentBase64String)
                        setAvatarHasBeenDeleted(false)
                        dispatch(setNotificationInfo({ message: "Avatar uploaded successfully", severity: "success" }))
                        dispatch(toggleNotification(true))
                    }
                    catch (error) {
                        dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                        dispatch(toggleNotification(true))
                    }
                    finally {
                        setAvatarIsLoading(false)
                    }
                })
            }

            else {
                dispatch(setNotificationInfo({ message: "Available formats: png, jpg", severity: "error" }))
                dispatch(toggleNotification(true))
            }

        }
    }

    const [avatarHasBeenDeleted, setAvatarHasBeenDeleted] = useState<boolean>(false)
    const deleteAvatar = async () => {
        try {
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/User/${currentUserId}/removeAvatar`)
            dispatch(setNotificationInfo({ message: "Avatar deleted successfully", severity: "success" }))
            dispatch(toggleNotification(true))
            setAvatarHasBeenDeleted(true)
            setUploadedAvatar("")
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }

    if (!token) {
        return (
            <h1 className={s["UserProfile--Login"]}>Please, Login!</h1>
        )
    }
    else if (userData) {
        return (
            <Container maxWidth="lg" className={s["UserProfile"]} >
                {userData &&
                    <div className={s["UserProfile-Body"]}>
                        {currentUserRole === "Administrator" && currentUserStatus === "Approved" &&
                            <Link className={s["UserProfile-EditIcon"]}
                                to={{
                                    pathname: "/edit-user",
                                    search: `?${userData.id}`,
                                }}>
                                <span>Edit</span>
                                <EditIcon className="PrimaryIcon" />
                            </Link>
                        }
                        <div className={s["UserProfile-Col"]}>
                            <div className={s["UserProfile-AvatarBox"]}>
                                {(userData.avatar || uploadedAvatar) && !avatarHasBeenDeleted && !avatarIsLoading &&
                                    <div className={s["UserProfile-AvatarImgWrapp"]}>
                                        <img src={`data:image;base64, ${uploadedAvatar ? uploadedAvatar : userData.avatar}`} className={s["UserProfile-AvatarImg"]} />
                                        <div className={s["UserProfile-AvatarNav"]}>
                                            <DeleteIcon
                                                onClick={() => deleteAvatar()}
                                                className="PrimaryIcon"
                                            />
                                            <label className={s["UserProfile-EditAvatarLabel"]}>
                                                <input type="file" className={s["UserProfile-AvatarInput"]} onChange={(e) => uploadAvatar(e.target.files)} />
                                                <EditIcon className="PrimaryIcon" />
                                            </label>
                                        </div>
                                    </div>
                                }
                                {((!userData.avatar && !uploadedAvatar) || avatarHasBeenDeleted) && !avatarIsLoading &&
                                    <label className={s["UserProfile-AvatarLabel"]}>
                                        {currentUserId === userData.id &&
                                            <input type="file" className={s["UserProfile-AvatarInput"]} onChange={(e) => uploadAvatar(e.target.files)} />
                                        }
                                        <div className={s["UserProfile-Avatar"]}>
                                            {
                                                currentUserId === userData.id ? <GetAppIcon className="PrimaryIcon" /> : lettersForProfilePicture
                                            }
                                        </div>
                                    </label>
                                }
                                {avatarIsLoading &&
                                    <Skeleton variant="rect" animation="wave" width={270} height={270} />
                                }
                                {currentUserRole === "Administrator" && currentUserStatus === "Approved" && userData.banned &&
                                    <span title="User is banned from receiving credit">
                                        <WarningIcon style={{ cursor: 'pointer', fill: "#EF574E" }} />
                                    </span>
                                }
                            </div>
                            <h1 className={s["UserProfile-Title"]}>{userData.firstName + " " + (userData.lastName ? userData.lastName : "")}</h1>
                            {currentUserRole === "Administrator" && (userData.userType === "LawFirm" || userData.userType === "Attorney") &&
                                <div className={s["UserProfile-Ratings"]}>
                                    <StarOutlineIcon /> Avg Rating: <b>{userAvgRating?.toFixed(2)}</b>
                                </div>
                            }

                            <ul className={s["UserProfile-List"]}>
                                <li className={s["UserProfile-Item"]}>{userData.userType}</li>
                                <li className={s["UserProfile-Item"]}>{userData.streetAddress}</li>
                                <li className={s["UserProfile-Item"]}>{userData.city ? userData.city + "," : ""} {userData.state ? userData.state.name + "," : ""} {userData.zipCode}</li>
                                <li className={s["UserProfile-Item"]}>{userData.phoneNumber}</li>
                                <li className={s["UserProfile-Item"]}><a href={userData.webSite}>{userData.website}</a></li>
                            </ul>

                            <ul className={s["UserProfile-List"]}>
                                <li className={s["UserProfile-Item"]}>
                                    <span>Date of first Contract: </span>
                                    <span>{dateOfFirstContract.length > 0 ? dateOfFirstContract : "No Contracts"}</span>
                                </li>
                                <li className={s["UserProfile-Item"]}>
                                    <span>Status: </span>
                                    <span>{userIsActive ? "Active" : "Inactive"}</span>
                                </li>
                            </ul>
                            {userData.userType === "Attorney" &&
                                <UserProfileLawFirms lawFirms={userData.lawFirms} />
                            }
                        </div>
                        <div className={s["UserProfile-Col"]}>
                            {
                                currentUserRole === "Administrator" &&
                                currentUserStatus === "Approved" &&
                                (userData.userType === "Attorney" || userData.userType === "LawFirm") &&
                                <div>
                                    {!userRatingIsVisible &&
                                        <div className={s['UserProfile-CalculateBtnWrapp']}>
                                            <Button className={s['UserProfile-CalculateBtn']} variant="contained" color="primary"
                                                onClick={() => setUserRatingIsVisible(true)}
                                            >
                                                Calculate Rating
                                            </Button>
                                        </div>
                                    }
                                    {userRatingIsVisible &&
                                        <div className={s["UserProfile-RatingTable"]}>
                                            <RatingTable userId={userData.id} />
                                        </div>
                                    }
                                </div>
                            }
                            {currentUserRole === "Administrator" && currentUserStatus === "Approved" &&
                                <div>
                                    {!userStatisticIsVisible &&
                                        <div className={s['UserProfile-CalculateBtnWrapp']}>
                                            <Button className={s['UserProfile-CalculateBtn']} variant="contained" color="primary"
                                                onClick={() => setUserStatisticIsVisible(true)}
                                            >
                                                Calculate Statistics
                                            </Button>
                                        </div>
                                    }
                                    {userStatisticIsVisible &&
                                        <Statistics userId={userId} />
                                    }
                                </div>
                            }
                        </div>
                    </div>
                }
                {
                    (
                        (currentUserRole === "Administrator" && currentUserStatus === "Approved") ||
                        currentUserId === userId
                    ) &&
                    <section className={s["UserProfile-CassesSection"]}>
                        <h1 className={s["UserProfile-CasesTitle"]}>Cases</h1>

                        <UserContracts contracts={userContracts}></UserContracts>
                    </section>
                }
            </Container>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}