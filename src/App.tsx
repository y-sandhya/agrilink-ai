import React, { useState } from "react";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

import FarmerLayout from "./components/FarmerLayout";
import BuyerLayout from "./components/BuyerLayout";

import FarmerDashboard from "./pages/farmer/Dashboard";
import MarketPrices from "./pages/farmer/MarketPrices";
import AIPredictions from "./pages/farmer/AIPredictions";
import BestMarket from "./pages/farmer/BestMarket";
import FindBuyers from "./pages/farmer/FindBuyers";
import MyCrops from "./pages/farmer/MyCrops";

import BuyerDashboard from "./pages/buyer/Dashboard";
import PostRequirement from "./pages/buyer/PostRequirement";
import FindFarmers from "./pages/buyer/FindFarmers";
import FindCrops from "./pages/buyer/FindCrops";

import {
  Orders,
  Payments,
  Messages,
  Notifications,
  HelpSupport,
  FarmerProfile,
  BuyerProfile,
} from "./pages/SharedPages";

import VoiceAccess from "./pages/VoiceAccess";
import ChatBot from "./components/ChatBot";

type Page =
  | "landing"

  // Authentication
  | "auth-farmer-signup"
  | "auth-farmer-login"
  | "auth-buyer-login"

  // Farmer
  | "farmer-dashboard"
  | "farmer-crops"
  | "farmer-market"
  | "farmer-ai"
  | "farmer-buyers"
  | "farmer-best-market"
  | "farmer-orders"
  | "farmer-payments"
  | "farmer-messages"
  | "farmer-notifications"
  | "farmer-profile"
  | "farmer-help"

  // Buyer
  | "buyer-dashboard"
  | "buyer-find-crops"
  | "buyer-post-req"
  | "buyer-find-farmers"
  | "buyer-orders"
  | "buyer-payments"
  | "buyer-messages"
  | "buyer-notifications"
  | "buyer-profile"
  | "buyer-help"
  | "buyer-market"

  // Voice
  | "voice";

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const navigate = (nextPage: string) => {
    setPage(nextPage as Page);
  };

  const isFarmerPage =
    page.startsWith("farmer-") || page === "voice";

  const isBuyerPage =
    page.startsWith("buyer-");

  const isAuthPage =
    page.startsWith("auth-");

  const showChatbot =
    isFarmerPage || isBuyerPage;

  // ─────────────────────────────────────────────
  // Landing Page
  // ─────────────────────────────────────────────

  if (page === "landing") {
    return (
      <LandingPage
        onNavigate={navigate}
      />
    );
  }

  // ─────────────────────────────────────────────
  // Authentication
  // ─────────────────────────────────────────────

  if (isAuthPage) {
    const mode = page.replace(
      "auth-",
      ""
    ) as
      | "farmer-signup"
      | "farmer-login"
      | "buyer-login";

    return (
      <AuthPage
        mode={mode}
        onNavigate={navigate}
      />
    );
  }

  // ─────────────────────────────────────────────
  // Farmer Pages
  // ─────────────────────────────────────────────

  if (isFarmerPage) {
    const renderFarmerPage = () => {
      switch (page) {
        case "farmer-dashboard":
          return (
            <FarmerDashboard
              onNavigate={navigate}
            />
          );

        case "farmer-crops":
          return (
            <MyCrops
              onNavigate={navigate}
            />
          );

        case "farmer-market":
          return <MarketPrices />;

        case "farmer-ai":
          return <AIPredictions />;

        case "farmer-buyers":
          return <FindBuyers />;

        case "farmer-best-market":
          return <BestMarket />;

        case "farmer-orders":
          return <Orders role="farmer" />;

        case "farmer-payments":
          return <Payments />;

        case "farmer-messages":
          return <Messages />;

        case "farmer-notifications":
          return <Notifications />;

        case "farmer-profile":
          return <FarmerProfile />;

        case "farmer-help":
          return <HelpSupport />;

        case "voice":
          return (
            <VoiceAccess
              onNavigate={navigate}
            />
          );

        default:
          return (
            <FarmerDashboard
              onNavigate={navigate}
            />
          );
      }
    };

    return (
      <>
        <FarmerLayout
          currentPage={page}
          onNavigate={navigate}
        >
          {renderFarmerPage()}
        </FarmerLayout>

        {showChatbot && <ChatBot />}
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Buyer Pages
  // ─────────────────────────────────────────────

  if (isBuyerPage) {
    const renderBuyerPage = () => {
      switch (page) {
        case "buyer-dashboard":
          return (
            <BuyerDashboard
              onNavigate={navigate}
            />
          );

        case "buyer-find-crops":
          return <FindCrops />;

        case "buyer-find-farmers":
          return <FindFarmers />;

        case "buyer-post-req":
          return (
            <PostRequirement
              onNavigate={navigate}
            />
          );

        case "buyer-orders":
          return <Orders role="buyer" />;

        case "buyer-payments":
          return <Payments />;

        case "buyer-messages":
          return <Messages />;

        case "buyer-notifications":
          return <Notifications />;

        case "buyer-profile":
          return <BuyerProfile />;

        case "buyer-help":
          return <HelpSupport />;

        case "buyer-market":
          return <MarketPrices />;

        default:
          return (
            <BuyerDashboard
              onNavigate={navigate}
            />
          );
      }
    };

    return (
      <>
        <BuyerLayout
          currentPage={page}
          onNavigate={navigate}
        >
          {renderBuyerPage()}
        </BuyerLayout>

        {showChatbot && <ChatBot />}
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Fallback
  // ─────────────────────────────────────────────

  return (
    <LandingPage
      onNavigate={navigate}
    />
  );
}