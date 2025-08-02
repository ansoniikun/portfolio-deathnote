"use client";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import projects from "../projects";

const about = `I’m a developer that's passionate about crafting accessible, pixel‑perfect user interfaces that blend thoughtful design with robust engineering. My favorite work lies at the intersection of design and development, creating experiences that not only look great but are meticulously built for performance and usability.`;

const experience = [
  {
    role: "Freelance Full-stack Engineer",
    period: "2022 – Present",
    description:
      "Delivered custom software solutions for clients, managing end‑to‑end development — gathering requirements, coding, testing, and deploying apps. Strengthened skills in client communication, project management, and delivering results under deadlines.",
  },
  {
    role: "Open Source Full Stack Engineer",
    period: "2019 – Present",
    description:
      "Contributed to collaborative projects, enhancing software functionality and fixing bugs while working with developers worldwide. Honed version control, teamwork, problem‑solving and adapting to diverse codebases.",
  },
];

function MyBook({ triggerOpen, onBookRefReady }) {
  const bookRef = useRef();
  const isOpenRef = useRef(false);
  const [bookSize, setBookSize] = useState({ width: 600, height: 1000 });
  const [key, setKey] = useState(0); // Add key to force re-render
  const [isPortrait, setIsPortrait] = useState("");

  // Update book size based on screen size
  useEffect(() => {
    const updateBookSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      setIsPortrait(window.innerWidth < 1024);

      let width, height;

      if (screenWidth < 640) {
        // sm screens
        width = Math.min(screenWidth * 0.9, 350);
        height = width * 1.5; // Maintain aspect ratio
      } else if (screenWidth < 768) {
        // md screens
        width = Math.min(screenWidth * 0.8, 450);
        height = width * 1.4;
      } else if (screenWidth < 1024) {
        // lg screens
        width = 500;
        height = 700;
      } else {
        // xl screens and up
        width = 600;
        height = 700;
      }

      setBookSize({ width, height });
      setKey((prev) => prev + 1); // Force re-render of HTMLFlipBook
    };

    updateBookSize();

    // Add debounce to prevent excessive re-renders
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBookSize, 300);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Notify parent when book ref is ready
  useEffect(() => {
    if (bookRef.current && onBookRefReady) {
      onBookRefReady({
        goToPage: (pageNumber) => {
          if (bookRef.current) {
            // Check if we're in portrait mode
            const isPortrait = window.innerWidth < 1024;

            if (isPortrait) {
              // In portrait mode, use turnToPage for individual pages
              bookRef.current.pageFlip().turnToPage(pageNumber);
            } else {
              // In landscape mode, adjust for two-page spreads
              // Pages are arranged as: [Cover], [Rules+About], [Experience+Projects], [Thank you]
              let targetPage;
              switch (pageNumber) {
                case 1: // About
                  targetPage = 1; // Second spread (Rules + About)
                  break;
                case 2: // Experience
                  targetPage = 1; // Still second spread, but will show Experience
                  break;
                case 3: // Projects
                  targetPage = 2; // Third spread (Experience + Projects)
                  break;
                case 4: // Socials
                  targetPage = 2; // Still third spread, but will show Projects + Thank you
                  break;
                default:
                  targetPage = pageNumber;
              }
              bookRef.current.pageFlip().turnToPage(targetPage);
            }
            isOpenRef.current = pageNumber > 0;
          }
        },
        openBook: () => {
          if (bookRef.current && !isOpenRef.current) {
            bookRef.current.pageFlip().flipNext();
            isOpenRef.current = true;
          }
        },
      });
    }
  }, [onBookRefReady, key]); // Add key as dependency

  useEffect(() => {
    if (!bookRef.current) return;

    if (triggerOpen && !isOpenRef.current) {
      // Open the book
      setTimeout(() => {
        if (bookRef.current) {
          bookRef.current.pageFlip().flipNext();
          isOpenRef.current = true;
        }
      }, 800);
    } else if (!triggerOpen && isOpenRef.current) {
      // Close the book by going back to cover
      setTimeout(() => {
        if (bookRef.current) {
          // Go to first page (cover)
          bookRef.current.pageFlip().flip(0);
          isOpenRef.current = false;
        }
      }, 200);
    }
  }, [triggerOpen]);

  return (
    <div className="relative px-4 pt-10 sm:px-0">
      <HTMLFlipBook
        key={key} // Force re-render on resize
        ref={bookRef}
        width={bookSize.width}
        height={bookSize.height}
        maxShadowOpacity={0.5}
        drawShadow={true}
        showCover={true}
        size="fixed"
        className="m-auto drop-shadow-2xl"
        autoSize={false}
        flippingTime={1000}
        usePortrait={isPortrait} // Single page mode for screens < 1024px
        startZIndex={0}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {/* Page 0: Cover */}
        <div className="page bg-black relative w-full h-full overflow-hidden text-center flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold">
            DEATH NOTE
          </h1>
        </div>

        {/* Page 1: Rules */}
        <div className="page text-white bg-custom-gray font-deathnote relative">
          <div className=" inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
            <div className="text-center max-w-xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-2 sm:pb-4 font-bold">
                DEATH NOTE
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl pb-4 sm:pb-6 text-gray-300">
                How to use it
              </h2>

              <div className="text-left space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg leading-relaxed">
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

        {/* Pages */}
        {[
          {
            title: "About Me",
            content: <p>{about}</p>,
          },
          {
            title: "Experience",
            content: experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-bold">{exp.role}</h3>
                <p className="text-sm text-gray-600">{exp.period}</p>
                <p>{exp.description}</p>
              </div>
            )),
          },
          {
            title: "Projects",
            content: (
              <>
                {projects.slice(0, 3).map((proj, idx) => (
                  <div key={idx} className="mb-6 flex items-start gap-3">
                    <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={proj.img}
                        alt={proj.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <Link
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-lg text- hover:underline"
                      >
                        {proj.name}
                      </Link>
                      <p className="text-sm mt-1">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.tech.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs border rounded-full px-2 py-1 text-gray-600 border-gray-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-left">
                  <Link
                    href="/project-archive"
                    className="text-custom-gray hover:underline text-lg"
                  >
                    View all projects {"->"}
                  </Link>
                </div>
              </>
            ),
          },
        ].map((page, index) => (
          <div key={index} className="page text-black relative overflow-hidden">
            <Image
              src="/paper.jpg"
              alt="Paper background"
              fill
              className="object-cover z-0"
            />
            <div className="absolute inset-0 p-10 lg:p-15 md:p-8 flex flex-col z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800  pb-2">
                {page.title}
              </h2>
              <div className="flex-1 overflow-y-auto text-sm sm:text-base text-gray-700 leading-relaxed">
                {page.content}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-custom-gray text-center py-10">
          <h1 className="text-5xl mb-2">Thank you</h1>
          <h2 className="mb-6 text-lg text-gray-300">(ありがとうございます)</h2>
          <div className="flex justify-center gap-6 text-white text-3xl">
            <Link
              href="https://github.com/ansoniikun"
              target="_blank"
              aria-label="GitHub"
            >
              <FaGithub className="hover:text-gray-400 transition-colors duration-300" />
            </Link>
            <Link
              href="https://linkedin.com/in/hlompho-maleke-a3833b262"
              target="_blank"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="hover:text-blue-400 transition-colors duration-300" />
            </Link>
            <Link
              href="https://leetcode.com/ansoniikun"
              target="_blank"
              aria-label="LeetCode"
            >
              <SiLeetcode className="hover:text-yellow-400 transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );
}

export default MyBook;
