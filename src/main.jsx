import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import About from "./components/About";
import PageLoader from "./components/PageLoader";
import SelectedWork from "./components/SelectedWork";
import WhatIDo from "./components/WhatIDo";
import CaseStudy from "./components/CaseStudy";
import FooterCTA from "./components/FooterCTA";
import TestimonialsTemplate from "./components/TestimonialsTemplate";
import AmbientBackground from "./components/AmbientBackground";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AmbientBackground />
    <div className="bg-noise"></div>
    <>
      <PageLoader />
      {/* 1. The Hook: High impact intro */}
      <Header />
      
      {/* 2. The Proof: Let the work speak for itself early */}
      <SelectedWork />
      
      {/* 3. Value, Scale & Partners: Premium Cards */}
      <WhatIDo />
      
      {/* 4. The ROI: Deep dive on specific results */}
      <CaseStudy />
      
      {/* 5. The Person: Who are they hiring? */}
      <About />
      
      {/* 6. Social Proof: What others say */}
      <TestimonialsTemplate />
      
      {/* 7. The Close: Call to action */}
      <FooterCTA />
    </>
  </React.StrictMode>
);
