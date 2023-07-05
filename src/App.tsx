import { Route, Switch } from "react-router-dom"
import { Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import CreateContractAttorney from "./app/components/CreateContractAttorney/CreateContractAttorney"
import EditUser from "./app/components/EditUser/EditUser"
import Login from "./app/components/Login/Login"
import Registration from "./app/components/Registration/Registration"
import Header from "./app/components/shared/Header/Header"
import ContractPage from "./app/components/ContractPage/ContractPage"
import UserProfile from "./app/components/UserProfile/UserProfile"
import ContractHistory from "./app/components/ContractHistory/ContractHistory"
import FindUser from "./app/components/FindUser/FindUser"
import ResetPassword from "./app/components/ResetPassword/ResetPassword"
import ResetPasswordSuccess from "./app/components/ResetPasswordSuccess/ResetPasswordSuccess"
import Footer from "./app/components/shared/Footer/Footer"
import Error404Page from "./app/components/Error404Page/Error404Page"
import Reports from "./app/components/Reports/Reports"
import InformationPage from "./app/components/shared/InformationPage/InformationPage"
import UsersAdminPage from "./app/components/UsersAdminPage/UsersAdminPage"
import EditContract from "./app/components/EditContract/EditContract"
import CreateUser from "./app/components/CreateUser/CreateUser"
import AdminPage from "./app/components/AdminPage/AdminPage"
import PaymentCalc from "./app/components/PaymentCalc/PaymentCalc"
import InterestRatesList from "./app/components/InterestRatesList/InterestRatesList"
import CreateNewInterestRate from "./app/components/CreateNewInterestRate/CreateNewInterestRate"
import { useEffect, useState } from "react"
import PrivateRoute from "./app/components/shared/PrivateRoute/PrivateRoute"
import AllContracts from "./app/components/AllContracts/AllContracts"
import UpdateInterestRate from "./app/components/UpdateInterestRate/UpdateInterestRate"
import getStates from "./app/customHooks/getStates"
import { useDispatch } from "react-redux"
import { setAllStatesToStore } from "./app/actions/actions"
import GeneralNotification from "./app/components/shared/GeneralNotification/GeneralNotification"
import SecurityConfirm from "./app/components/SecurityConfirm/SecurityConfirm"
import RatingController from "./app/components/RatingController/RatingController"
import PrivacyPolicy from "./app/components/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./app/components/TermsAndConditions/TermsAndConditions";
import Home from "./app/components/Home/Home";
import MyLawFirmsContracts from "./app/components/MyLawFirmsContracts/MyLawFirmsContracts";

export const history = createHistory();

export default function App() {
    const dispatch = useDispatch()
    const [userIsLogined, setUserIsLogined] = useState(false)
    const [userIsLogout, setUserIsLogout] = useState<boolean>(false)

    const setStatesToStore = async () => {
        let states = await getStates()
        dispatch(setAllStatesToStore(states))
    }
    useEffect(() => {
        setStatesToStore()
    }, [])

    return (
        <Router history={history} >
            <div>

                <Header userIsLogined={userIsLogined} userIsLogout={userIsLogout} setUserIsLogout={setUserIsLogout} />
                <GeneralNotification />

                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/registration">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login setUserIsLogined={setUserIsLogined} userIsLogined={userIsLogined} userIsLogout={userIsLogout} setUserIsLogout={setUserIsLogout} />
                    </Route>
                    <PrivateRoute path="/edit-user" userIsLogined={userIsLogined}>
                        <EditUser />
                    </PrivateRoute>
                    <PrivateRoute path="/create-user" userIsLogined={userIsLogined}>
                        <CreateUser />
                    </PrivateRoute>
                    <Route path={["/create-contract-attorney", "/request-funds"]}>
                        <CreateContractAttorney />
                    </Route>
                    <Route path="/contract-page">
                        <ContractPage />
                    </Route>
                    <Route path="/user-profile">
                        <UserProfile />
                    </Route>
                    <Route path="/contract-history">
                        <ContractHistory />
                    </Route>
                    <PrivateRoute path="/find-user" userIsLogined={userIsLogined}>
                        <FindUser />
                    </PrivateRoute>
                    <Route path="/reset-password">
                        <ResetPassword />
                    </Route>
                    <Route path="/reset-password-success">
                        <ResetPasswordSuccess />
                    </Route>
                    <PrivateRoute path="/create-reports" userIsLogined={userIsLogined}>
                        <Reports />
                    </PrivateRoute>
                    <PrivateRoute path="/edit-contract" userIsLogined={userIsLogined}>
                        <EditContract />
                    </PrivateRoute>
                    <Route path="/information-page">
                        <InformationPage />
                    </Route>
                    <PrivateRoute path="/users-admin-page" userIsLogined={userIsLogined}>
                        <UsersAdminPage />
                    </PrivateRoute>
                    <PrivateRoute path="/admin" userIsLogined={userIsLogined}>
                        <AdminPage />
                    </PrivateRoute>
                    <PrivateRoute path="/interest-rates-list" userIsLogined={userIsLogined}>
                        <InterestRatesList />
                    </PrivateRoute>
                    <Route path="/payment-calculator">
                        <PaymentCalc />
                    </Route>
                    <PrivateRoute path="/create-new-interest-rate" userIsLogined={userIsLogined}>
                        <CreateNewInterestRate />
                    </PrivateRoute>
                    <PrivateRoute path="/update-interest-rate" userIsLogined={userIsLogined}>
                        <UpdateInterestRate />
                    </PrivateRoute>
                    <PrivateRoute path="/all-contracts" userIsLogined={userIsLogined}>
                        <AllContracts />
                    </PrivateRoute>
                    <Route path="/my-law-firms-contracts">
                        <MyLawFirmsContracts />
                    </Route>
                    <PrivateRoute path="/rating-controller" userIsLogined={userIsLogined}>
                        <RatingController />
                    </PrivateRoute>
                    <Route path="/confirm-email">
                        <SecurityConfirm />
                    </Route>
                    <Route path="/privacy-policy">
                        <PrivacyPolicy />
                    </Route>
                    <Route path="/terms-and-conditions">
                        <TermsAndConditions />
                    </Route>
                    <Route path="*">
                        <Error404Page />
                    </Route>
                </Switch>

                <Footer />

            </div>
        </Router>
    );
}
