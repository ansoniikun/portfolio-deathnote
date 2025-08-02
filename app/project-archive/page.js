"use client";
import projects from "../projects";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  return (
    <div className="bg-custom-gray min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">All Projects</h1>
      <div className="overflow-x-auto rounded shadow-md">
        <table className="min-w-full table-auto text-sm text-white bg-custom-gray border border-gray-700">
          <thead className="bg-custom-gray border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Image</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-left px-4 py-2">Technologies</th>
              <th className="text-left px-4 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-3">
                  <div className="relative w-14 h-14">
                    <Image
                      src={proj.img}
                      alt={proj.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{proj.name}</td>
                <td className="px-4 py-3">{proj.description}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {proj.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-700 text-white rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={proj.link}
                    target="_blank"
                    className="text-white hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
