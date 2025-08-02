"use client";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";

const about = "";
const experience = [];
const projects = [];

function Book(props) {
  return (
    <HTMLFlipBook
      width={600}
      height={700}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size="fixed"
      className="m-auto"
    >
      <div className="page bg-transparent" numnber="1">
        <div className="cover ">
          <Image
            src="/cover_page.jpg"
            fill
            alt="cover page"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div>
        <h1>DEATH NOTE</h1>
      </div>
      <div className="page text-white bg-black">
        <h1>Hlompho Maleke</h1>
        <h2>About me</h2>
        <p>{about}</p>
      </div>
    </HTMLFlipBook>
  );
}

export default Book;
