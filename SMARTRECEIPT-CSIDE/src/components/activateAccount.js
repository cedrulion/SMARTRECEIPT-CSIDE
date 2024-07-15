import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const ActivateAccount = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        id: "",
        email: "",
        password: "",
        username: "",
    });
    const [disableConfirm, setDisableConfirm] = useState(false);
    const [activateButton, setActivateButton] = useState(false);
    const [showConfirm, setShowConfirm] = useState(true);
    const [showEnterPassword, setShowEnterPassword] = useState(false);

    const checkEmail = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/user/checkemail", data, config)
            const evaluate = response.data
            if (evaluate.confirm === true) {
                setShowConfirm(false)
                setShowEnterPassword(true)
                setData({ ...data, id: response.data.user._id, username: response.data.user.username })
            }
            else if (evaluate.confirm === false && evaluate.message) {
                toast.warning('Already account activated', {
                    position: "top-left",
                    autoClose: 5000,
                });
            }
            else {
                toast.error('NO RECORD FOUND!', {
                    position: "top-left",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createPassword = async (e) => {
        e.preventDefault()
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/user/activatepassword", { id: data.id, password: data.password }, config);
            setData({
                id: "",
                email: "",
                password: "",
                username: "",
            })
            setActivateButton(false)
            setShowEnterPassword(false)
            toast.success('Created password', {
                position: "top-left",
                autoClose: 5000,
            });
            navigate("/login")
        } catch (error) {
            toast.error('Failure', {
                position: "top-left",
                autoClose: 10000,
            });
        }
    }


    useEffect(() => {
        if (data.email.trim() !== "") {
            setDisableConfirm(false)
        }
        else {
            setDisableConfirm(true)
        }
    }, [data.email])

    useEffect(() => {
        if (data.password.trim() !== "") {
            setActivateButton(false)
        }
        else {
            setActivateButton(true)
        }
    }, [data.password])

    const goBack = (e) => {
        e.preventDefault();
        setData({
            id: "",
            email: "",
            password: "",
            username: "",
        })
        setDisableConfirm(false)
        setActivateButton(false)
        setShowEnterPassword(false)
        setShowConfirm(true)
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 font-mono">
                <div className="bg-white shadow-md p-8 rounded-lg">
                    <div className="text-2xl text-blue-600 font-bold mb-6">Activate Account</div>
                    <div className="w-96">
                        <form className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                {showConfirm ? (
                                    <div>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            id="email"
                                            placeholder="Enter email"
                                            value={data.email}
                                            required
                                            onChange={(e) => setData({ ...data, email: e.target.value })}
                                        />
                                        <small id="emailHelp" className="text-gray-500 text-xs">Please enter the email you provided</small>
                                    </div>
                                ) : (
                                    <div className="flex items-center w-full">
                                        <label htmlFor="search" className="sr-only">Go back</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="search"
                                                defaultValue={data.email}
                                                disabled
                                                id="search"
                                                className="block w-full p-4 ps-10 pe-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Search"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="text-white absolute end-2.5 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                                                onClick={goBack}
                                            >
                                                Go back
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {showEnterPassword && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="pass" className="block text-gray-700 mb-2">Enter Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            id="pass"
                                            placeholder="Enter password"
                                            value={data.password}
                                            onChange={(e) => setData({ ...data, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className={`w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md ${activateButton ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                            disabled={activateButton}
                                            onClick={createPassword}
                                        >
                                            Activate
                                        </button>
                                    </div>
                                </>
                            )}
                            {showConfirm && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className={`w-full px-4 py-2 mt-2 text-blue-500 border border-blue-500 rounded-md ${disableConfirm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                                        disabled={disableConfirm}
                                        onClick={checkEmail}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            )}
                            <div className="mt-4 text-center">
                                <p className="text-sm">
                                    Account activated?
                                    <a href="/login" className="ml-1 text-blue-500 hover:underline">
                                        <strong>Login</strong>
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    )
}
export default ActivateAccount;
