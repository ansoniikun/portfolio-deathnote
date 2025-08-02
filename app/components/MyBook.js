"use client";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { useEffect, useRef } from "react";

const about = "";
const experience = [];
const projects = [];

function MyBook({ triggerOpen }) {
  const bookRef = useRef();

  useEffect(() => {
    if (triggerOpen && bookRef.current) {
      // Auto-open the book after it appears
      setTimeout(() => {
        bookRef.current.pageFlip().flipNext();
      }, 800);
    }
  }, [triggerOpen]);

  return (
    <div className="relative">
      <HTMLFlipBook
        ref={bookRef}
        width={600}
        height={700}
        maxShadowOpacity={0.5}
        drawShadow={true}
        showCover={true}
        size="fixed"
        className="m-auto drop-shadow-2xl"
        autoSize={false}
        flippingTime={1000}
        usePortrait={false}
        startZIndex={0}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        <div className="page bg-black relative w-full h-full overflow-hidden text-center">
          <h1 className="text-7xl pt-8">DEATH NOTE</h1>
        </div>

        <div className="page text-white bg-custom-gray font-deathnote relative">
          <div className="absolute inset-0 p-8 flex flex-col justify-center">
            <div className="text-center max-w-xl mx-auto">
              <h1 className="text-6xl pb-4 font-bold">DEATH NOTE</h1>
              <h2 className="text-3xl pb-6 text-gray-300">How to use it</h2>

              <div className="text-left space-y-4 text-lg leading-relaxed">
                <p>
                  1. The developer whose name is written in this Death Note will
                  get employed.(Even if they only know HTML and how to center a
                  div... somehow.)
                </p>

                <p>
                  2. This note will not take effect unless the writer has the
                  dev's LinkedIn profile or resume open in another tab.
                  Therefore, developers with the same name but no online
                  presence will be unaffected.
                </p>

                <p>
                  3. If the job title is written within the next 40 seconds of
                  writing the developer's name, it will happen.(Examples:
                  "Senior React Wizard," "CSS Sorcerer," "Backend Overlord.")
                </p>

                <p>
                  4. If the job title is not specified, the developer will
                  default to "Full-Stack Confused."
                </p>

                <p>
                  5. After writing the job title, onboarding details (e.g., Mac
                  or PC, Slack channels, coffee policy) must be written in the
                  next 6 minutes and 40 seconds.
                </p>

                <p className="text-red-300 font-semibold">
                  Otherwise, the developer will be stuck in unpaid training
                  forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="page text-black bg-white relative" id="about">
          <div className="absolute inset-0 p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Hlompho Maleke
            </h1>
            <h2 className="text-2xl mb-6 text-gray-600 border-b pb-2">
              About me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {about ||
                "Full-stack developer with a passion for creating engaging digital experiences."}
            </p>
          </div>
        </div>

        <div className="page text-black bg-white relative">
          <div className="absolute inset-0 p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
              Experience
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {about || "Professional experience in modern web technologies."}
            </p>
          </div>
        </div>

        <div className="page text-black bg-white relative">
          <div className="absolute inset-0 p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
              Projects
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {about ||
                "Featured projects showcasing technical skills and creativity."}
            </p>
          </div>
        </div>

        <div className="page text-white bg-custom-gray relative">
          <div className="absolute inset-0 p-8 flex flex-col justify-center items-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Hlompho Maleke</h1>
              <h2 className="text-2xl mb-6 text-gray-300">
                Thank you for reading
              </h2>
              <p className="text-gray-400">
                {about || "Get in touch to discuss opportunities."}
              </p>
            </div>
          </div>
        </div>
      </HTMLFlipBook>

      {/* Navigation hint */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 pointer-events-none">
        Click or drag to flip pages
      </div> */}
    </div>
  );
}

export default MyBook;
