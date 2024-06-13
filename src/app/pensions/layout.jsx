"use client";
import Navbar from "@/components/pensionsComponents/navbar/Navbar";
import Sidebar from "@/components/pensionsComponents/sidebar/Sidebar";
import React, { Suspense, useState } from "react";
import styles from "./layout.module.css";
import { Alert, Grid } from "@mui/material";
import { useIsLoading } from "@/context/LoadingContext";
import Spinner from "@/components/spinner/Spinner";
import { useAlert } from "@/context/AlertContext";
import AlertComponent from "@/components/alerts/AlertComponent";

function Layout({ children }) {
  const { alert, setAlert } = useAlert();

  const { isLoading } = useIsLoading();

  return (
    <>
      <Grid container sx={{ height: "95vh" }}>
        {alert.open && <AlertComponent alert={alert} setAlert={setAlert} />}
        {/* Sidebar */}
        <Grid item xs={2}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
        </Grid>
        {/* Main Content */}
        <>
          <Grid item xs={10}>
            <Navbar />
            <div
              className={styles.main}
              style={{ height: "calc(100vh - 67px)" }}
            >
              <Suspense fallback={<Spinner />}>
                {isLoading ? <Spinner /> : children}
              </Suspense>
            </div>
          </Grid>
        </>
      </Grid>
    </>
  );
}

export default Layout;
