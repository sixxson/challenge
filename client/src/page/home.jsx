import React from "react";
import VerifyOtp from "../components/verify-otp";
import GitHubUserSearch from "../components/GitHubUserSearch";

export default function Home() {
  return (
    <>
      <VerifyOtp />
      <GitHubUserSearch />
    </>
  );
}
