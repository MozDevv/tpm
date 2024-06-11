"use client";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import React, { Suspense } from "react";
import styles from "./layout.module.css";
import { Grid } from "@mui/material";
import { useIsLoading } from "@/context/LoadingContext";
import Spinner from "@/components/spinner/Spinner";

function Layout({ children }) {
  const { isLoading } = useIsLoading();

  return (
    <>
      <Grid container sx={{ height: "95vh" }}>
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
