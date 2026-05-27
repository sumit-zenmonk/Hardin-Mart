"use client"

import { useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { enqueueSnackbar } from "notistack"

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.authReducer)

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/")
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                {/* <p onClick={() => {
                    router.push("/")
                }}>Ecommerce Microservice</p> */}
                <Box className={styles.logoContainer}
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    <Box className={styles.logoIcon}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            // strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </Box>

                    <span className={styles.logoText}>Ecommerce</span>
                </Box>
            </Box>

            <Box className={styles.rightContainer}>
                <Button
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    Home
                </Button>
                {user ? (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/cart")
                            }}
                        >
                            Cart
                        </Button>

                        <Button
                            className={styles.logoutbtn}
                            onClick={async () => { await handleLogOut() }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}