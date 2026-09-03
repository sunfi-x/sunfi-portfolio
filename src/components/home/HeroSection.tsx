"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, GraduationCap } from "lucide-react";
import Image from "next/image";
import type { Profile } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";
// Space Grotesk font will be imported via CSS @import
// GeistSans import retained for other components if needed
import { GeistSans } from "geist/font/sans";

import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";

// CSS import for Space Grotesk is handled in JSX style block



const floatingIcons = [
  {
    name: "Python",
    svg: (
      <svg viewBox="0 0 110 110" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.766 8.36c-25.074 0-23.491 10.875-23.491 10.875l.033 11.23h24.116v3.428H21.571s-10.741-1.31-10.741 23.36c0 24.67 9.213 23.09 9.213 23.09h7.404v-10.53s-.164-12.01 12.044-12.01h24.38c11.846 0 11.846-11.846 11.846-11.846v-25.56s1.645-12.044-12.011-12.044H53.766ZM39.617 14.81c1.843 0 3.323 1.481 3.323 3.323s-1.48 3.324-3.323 3.324-3.323-1.481-3.323-3.324 1.48-3.323 3.323-3.323Z" fill="#387EB8" />
        <path d="M54.524 100.864c25.074 0 23.491-10.876 23.491-10.876l-.033-11.23H53.866v-3.428h32.853s10.741 1.31 10.741-23.36c0-24.67-9.213-23.09-9.213-23.09h-7.404v10.53s.164 12.01-12.044 12.01H44.419c-11.846 0-11.846 11.845-11.846 11.845v25.56s-1.645 12.045 12.011 12.045h9.94Zm14.15-6.45c-1.844 0-3.324-1.48-3.324-3.323s1.48-3.323 3.324-3.323 3.323 1.48 3.323 3.323-1.48 3.323-3.323 3.323Z" fill="#FFE052" />
      </svg>
    ),
  },
  {
    name: "SQL",
    svg: (
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <path fill="#336791" d="M93.809 92.112c.785-6.533.55-7.492 5.416-6.433l1.235.108c3.742.17 8.637-.602 11.513-1.938 6.191-2.873 9.861-7.668 3.758-6.409-13.924 2.873-14.881-1.842-14.881-1.842 14.703-21.815 20.849-49.508 15.543-56.287-14.47-18.489-39.517-9.746-39.936-9.52l-.134.025c-2.751-.571-5.83-.912-9.289-.968-6.301-.104-11.082 1.652-14.709 4.402 0 0-44.683-18.409-42.604 23.151.442 8.841 12.672 66.898 27.26 49.362 5.332-6.412 10.484-11.834 10.484-11.834 2.558 1.699 5.622 2.567 8.834 2.255l.249-.212c-.078.796-.044 1.575.099 2.497-3.757 4.199-2.653 4.936-10.166 6.482-7.602 1.566-3.136 4.355-.221 5.084 3.535.884 11.712 2.136 17.238-5.598l-.22.882c1.474 1.18 1.375 8.477 1.583 13.69.209 5.214.558 10.079 1.621 12.948 1.063 2.868 2.317 10.256 12.191 8.14 8.252-1.764 14.561-4.309 15.136-27.985" />
        <path fill="#336791" d="M75.458 125.256c-4.367 0-7.211-1.689-8.938-3.32-2.607-2.46-3.641-5.629-4.259-7.522l-.267-.79c-1.244-3.358-1.666-8.193-1.916-14.419-.038-.935-.064-1.898-.093-2.919-.021-.747-.047-1.684-.085-2.664a18.8 18.8 0 01-4.962 1.568c-3.079.526-6.389.356-9.84-.507-2.435-.609-4.965-1.871-6.407-3.82-4.203 3.681-8.212 3.182-10.396 2.453-3.853-1.285-7.301-4.896-10.542-11.037-2.309-4.375-4.542-10.075-6.638-16.943-3.65-11.96-5.969-24.557-6.175-28.693C4.292 23.698 7.777 14.44 15.296 9.129 27.157.751 45.128 5.678 51.68 7.915c4.402-2.653 9.581-3.944 15.433-3.851 3.143.051 6.136.327 8.916.823 2.9-.912 8.628-2.221 15.185-2.139 12.081.144 22.092 4.852 28.949 13.615 4.894 6.252 2.474 19.381.597 26.651-2.642 10.226-7.271 21.102-12.957 30.57 1.544.011 3.781-.174 6.961-.831 6.274-1.295 8.109 2.069 8.607 3.575 1.995 6.042-6.677 10.608-9.382 11.864-3.466 1.609-9.117 2.589-13.745 2.377l-.202-.013-1.216-.107-.12 1.014-.116.991c-.311 11.999-2.025 19.598-5.552 24.619-3.697 5.264-8.835 6.739-13.361 7.709-1.544.33-2.947.474-4.219.474zm-9.19-43.671c2.819 2.256 3.066 6.501 3.287 14.434.028.99.054 1.927.089 2.802.106 2.65.355 8.855 1.327 11.477.137.371.26.747.39 1.146 1.083 3.316 1.626 4.979 6.309 3.978 3.931-.843 5.952-1.599 7.534-3.851 2.299-3.274 3.585-9.86 3.821-19.575l4.783.116-4.75-.57.14-1.186c.455-3.91.783-6.734 3.396-8.602 2.097-1.498 4.486-1.353 6.389-1.01-2.091-1.58-2.669-3.433-2.823-4.193l-.399-1.965 1.121-1.663c6.457-9.58 11.781-21.354 14.609-32.304 2.906-11.251 2.02-17.226 1.134-18.356-11.729-14.987-32.068-8.799-34.192-8.097l-.359.194-1.8.335-.922-.191c-2.542-.528-5.366-.82-8.393-.869-4.756-.08-8.593 1.044-11.739 3.431l-2.183 1.655-2.533-1.043c-5.412-2.213-21.308-6.662-29.696-.721-4.656 3.298-6.777 9.76-6.305 19.207.156 3.119 2.275 14.926 5.771 26.377 4.831 15.825 9.221 21.082 11.054 21.693.32.108 1.15-.537 1.976-1.529a270.708 270.708 0 0110.694-12.07l2.77-2.915 3.349 2.225c1.35.897 2.839 1.406 4.368 1.502l7.987-6.812-1.157 11.808c-.026.265-.039.626.065 1.296l.348 2.238-1.51 1.688-.174.196 4.388 2.025 1.836-2.301z" />
        <path fill="#336791" d="M115.731 77.44c-13.925 2.873-14.882-1.842-14.882-1.842 14.703-21.816 20.849-49.51 15.545-56.287C101.924.823 76.875 9.566 76.457 9.793l-.135.024c-2.751-.571-5.83-.911-9.291-.967-6.301-.103-11.08 1.652-14.707 4.402 0 0-44.684-18.408-42.606 23.151.442 8.842 12.672 66.899 27.26 49.363 5.332-6.412 10.483-11.834 10.483-11.834 2.559 1.699 5.622 2.567 8.833 2.255l.25-.212c-.078.796-.042 1.575.1 2.497-3.758 4.199-2.654 4.936-10.167 6.482-7.602 1.566-3.136 4.355-.22 5.084 3.534.884 11.712 2.136 17.237-5.598l-.221.882c1.473 1.18 2.507 7.672 2.334 13.557-.174 5.885-.29 9.926.871 13.082 1.16 3.156 2.316 10.256 12.192 8.14 8.252-1.768 12.528-6.351 13.124-13.995.422-5.435 1.377-4.631 1.438-9.49l.767-2.3c.884-7.367.14-9.743 5.225-8.638l1.235.108c3.742.17 8.639-.602 11.514-1.938 6.19-2.871 9.861-7.667 3.758-6.408z" />
        <path fill="#fff" d="M75.957 122.307c-8.232 0-10.84-6.519-11.907-9.185-1.562-3.907-1.899-19.069-1.551-31.503a1.59 1.59 0 011.64-1.55 1.594 1.594 0 011.55 1.639c-.401 14.341.168 27.337 1.324 30.229 1.804 4.509 4.54 8.453 12.275 6.796 7.343-1.575 10.093-4.359 11.318-11.46.94-5.449 2.799-20.951 3.028-24.01a1.593 1.593 0 011.71-1.472 1.597 1.597 0 011.472 1.71c-.239 3.185-2.089 18.657-3.065 24.315-1.446 8.387-5.185 12.191-13.794 14.037-1.463.313-2.792.453-4 .454zM31.321 90.466a6.71 6.71 0 01-2.116-.35c-5.347-1.784-10.44-10.492-15.138-25.885-3.576-11.717-5.842-23.947-6.041-27.922-.589-11.784 2.445-20.121 9.02-24.778 13.007-9.216 34.888-.44 35.813-.062a1.596 1.596 0 01-1.207 2.955c-.211-.086-21.193-8.492-32.768-.285-5.622 3.986-8.203 11.392-7.672 22.011.167 3.349 2.284 15.285 5.906 27.149 4.194 13.742 8.967 22.413 13.096 23.79.648.216 2.62.873 5.439-2.517A245.272 245.272 0 0145.88 73.046a1.596 1.596 0 012.304 2.208c-.048.05-4.847 5.067-10.077 11.359-2.477 2.979-4.851 3.853-6.786 3.853zm69.429-13.445a1.596 1.596 0 01-1.322-2.487c14.863-22.055 20.08-48.704 15.612-54.414-5.624-7.186-13.565-10.939-23.604-11.156-7.433-.16-13.341 1.738-14.307 2.069l-.243.099c-.971.305-1.716-.227-1.997-.849a1.6 1.6 0 01.631-2.025c.046-.027.192-.089.429-.176l-.021.006.021-.007c1.641-.601 7.639-2.4 15.068-2.315 11.108.118 20.284 4.401 26.534 12.388 2.957 3.779 2.964 12.485.019 23.887-3.002 11.625-8.651 24.118-15.497 34.277-.306.457-.81.703-1.323.703zm.76 10.21c-2.538 0-4.813-.358-6.175-1.174-1.4-.839-1.667-1.979-1.702-2.584-.382-6.71 3.32-7.878 5.208-8.411-.263-.398-.637-.866-1.024-1.349-1.101-1.376-2.609-3.26-3.771-6.078-.182-.44-.752-1.463-1.412-2.648-3.579-6.418-11.026-19.773-6.242-26.612 2.214-3.165 6.623-4.411 13.119-3.716C97.6 28.837 88.5 10.625 66.907 10.271c-6.494-.108-11.82 1.889-15.822 5.93-8.96 9.049-8.636 25.422-8.631 25.586a1.595 1.595 0 11-3.19.084c-.02-.727-.354-17.909 9.554-27.916C53.455 9.272 59.559 6.96 66.96 7.081c13.814.227 22.706 7.25 27.732 13.101 5.479 6.377 8.165 13.411 8.386 15.759.165 1.746-1.088 2.095-1.341 2.147l-.576.013c-6.375-1.021-10.465-.312-12.156 2.104-3.639 5.201 3.406 17.834 6.414 23.229.768 1.376 1.322 2.371 1.576 2.985.988 2.396 2.277 4.006 3.312 5.3.911 1.138 1.7 2.125 1.982 3.283.131.23 1.99 2.98 13.021.703 2.765-.57 4.423-.083 4.93 1.45.997 3.015-4.597 6.532-7.694 7.97-2.775 1.29-7.204 2.106-11.036 2.106zm-4.696-4.021c.35.353 2.101.962 5.727.806 3.224-.138 6.624-.839 8.664-1.786 2.609-1.212 4.351-2.567 5.253-3.492l-.5.092c-7.053 1.456-12.042 1.262-14.828-.577a6.162 6.162 0 01-.54-.401c-.302.119-.581.197-.78.253-1.58.443-3.214.902-2.996 5.105zm-45.562 8.915c-1.752 0-3.596-.239-5.479-.71-1.951-.488-5.24-1.957-5.19-4.37.057-2.707 3.994-3.519 5.476-3.824 5.354-1.103 5.703-1.545 7.376-3.67.488-.619 1.095-1.39 1.923-2.314 1.229-1.376 2.572-2.073 3.992-2.073.989 0 1.8.335 2.336.558 1.708.708 3.133 2.42 3.719 4.467.529 1.847.276 3.625-.71 5.006-3.237 4.533-7.886 6.93-13.443 6.93zm-7.222-4.943c.481.372 1.445.869 2.518 1.137 1.631.408 3.213.615 4.705.615 4.546 0 8.196-1.882 10.847-5.594.553-.774.387-1.757.239-2.274-.31-1.083-1.08-2.068-1.873-2.397-.43-.178-.787-.314-1.115-.314-.176 0-.712 0-1.614 1.009a41.146 41.146 0 00-1.794 2.162c-2.084 2.646-3.039 3.544-9.239 4.821-1.513.31-2.289.626-2.674.835zm12.269-7.36a1.596 1.596 0 01-1.575-1.354 8.218 8.218 0 01-.08-.799c-4.064-.076-7.985-1.82-10.962-4.926-3.764-3.927-5.477-9.368-4.699-14.927.845-6.037.529-11.366.359-14.229-.047-.796-.081-1.371-.079-1.769.003-.505.013-1.844 4.489-4.113 1.592-.807 4.784-2.215 8.271-2.576 5.777-.597 9.585 1.976 10.725 7.246 3.077 14.228.244 20.521-1.825 25.117-.385.856-.749 1.664-1.04 2.447l-.257.69c-1.093 2.931-2.038 5.463-1.748 7.354a1.595 1.595 0 01-1.335 1.819l-.244.02zM42.464 42.26l.062 1.139c.176 2.974.504 8.508-.384 14.86-.641 4.585.759 9.06 3.843 12.276 2.437 2.542 5.644 3.945 8.94 3.945h.068c.369-1.555.982-3.197 1.642-4.966l.255-.686c.329-.884.714-1.74 1.122-2.646 1.991-4.424 4.47-9.931 1.615-23.132-.565-2.615-1.936-4.128-4.189-4.627-4.628-1.022-11.525 2.459-12.974 3.837zm9.63-.677c-.08.564 1.033 2.07 2.485 2.271 1.449.203 2.689-.975 2.768-1.539.079-.564-1.033-1.186-2.485-1.388-1.451-.202-2.691.092-2.768.656zm2.818 2.826l-.407-.028c-.9-.125-1.81-.692-2.433-1.518-.219-.29-.576-.852-.505-1.354.101-.736.999-1.177 2.4-1.177.313 0 .639.023.967.069.766.106 1.477.327 2.002.62.91.508.977 1.075.936 1.368-.112.813-1.405 2.02-2.96 2.02zm-2.289-2.732c.045.348.907 1.496 2.029 1.651l.261.018c1.036 0 1.81-.815 1.901-1.082-.096-.182-.762-.634-2.025-.81a5.823 5.823 0 00-.821-.059c-.812 0-1.243.183-1.345.282zm43.605-1.245c.079.564-1.033 2.07-2.484 2.272-1.45.202-2.691-.975-2.771-1.539-.076-.564 1.036-1.187 2.486-1.388 1.45-.203 2.689.092 2.769.655zm-2.819 2.56c-1.396 0-2.601-1.086-2.7-1.791-.115-.846 1.278-1.489 2.712-1.688.316-.044.629-.066.93-.066 1.238 0 2.058.363 2.14.949.053.379-.238.964-.739 1.492-.331.347-1.026.948-1.973 1.079l-.37.025zm.943-3.013c-.276 0-.564.021-.856.061-1.441.201-2.301.779-2.259 1.089.048.341.968 1.332 2.173 1.332l.297-.021c.787-.109 1.378-.623 1.66-.919.443-.465.619-.903.598-1.052-.028-.198-.56-.49-1.613-.49zm3.965 32.843a1.594 1.594 0 01-1.324-2.483c3.398-5.075 2.776-10.25 2.175-15.255-.257-2.132-.521-4.337-.453-6.453.07-2.177.347-3.973.614-5.71.317-2.058.617-4.002.493-6.31a1.595 1.595 0 113.186-.172c.142 2.638-.197 4.838-.525 6.967-.253 1.643-.515 3.342-.578 5.327-.061 1.874.178 3.864.431 5.97.64 5.322 1.365 11.354-2.691 17.411a1.596 1.596 0 01-1.328.708z" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    svg: (
      <svg viewBox="0 0 630 630" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <rect width="630" height="630" fill="#f7df1e" rx="60" />
        <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.07z" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 180" className="w-full h-full text-white drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_408_134" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_408_134)">
          <circle cx="90" cy="90" r="90" fill="white" stroke="currentColor" strokeWidth="2" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)" />
          <path d="M115.012 54H127.125V125.97H115.012V54Z" fill="url(#paint1_linear_408_134)" />
        </g>
        <defs>
          <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="black" />
            <stop offset="1" stopColor="black" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="black" />
            <stop offset="1" stopColor="black" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "React",
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-full h-full text-[#61DAFB] drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    svg: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-[#38B2AC] drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.511 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Go",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs><path id="go-original-a" d="M18.8 1h90.5v126H18.8z" /></defs>
        <clipPath id="go-original-b"><use xlinkHref="#go-original-a" overflow="visible" /></clipPath>
        <path fillRule="evenodd" clipRule="evenodd" fill="#F6D2A2" d="M21.1 68.7c.2 3.5 3.7 1.9 5.3.8 1.5-1.1 2-.2 2.1-2.3.1-1.4.2-2.7.2-4.1-2.3-.2-4.8.3-6.7 1.7-.9.7-2.8 3-.9 3.9" clipPath="url(#go-original-b)" />
        <path d="M23 71.2c-.7 0-2-.3-2.2-2.3-.6-.4-.8-.9-.8-1.2-.1-1.2 1.2-2.6 1.9-3.1 1.6-1.2 3.7-1.8 5.9-1.8h1.3v.3c.1 1.1 0 2.2-.1 3.2 0 .3 0 .6-.1.9-.1 1.5-.4 1.7-1.1 2-.3.1-.6.2-1.1.6-.5.3-2.2 1.4-3.7 1.4zm4.8-7.8c-2.1 0-4 .6-5.5 1.7-.7.5-1.7 1.7-1.6 2.5 0 .3.2.6.6.8l.2.1v.2c.1 1.6.9 1.8 1.5 1.8 1 0 2.4-.7 3.3-1.3.6-.4 1-.5 1.3-.6.5-.2.6-.2.7-1.4 0-.3 0-.6.1-.9.1-.9.1-1.9.1-2.8-.3-.1-.5-.1-.7-.1z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#C6B198" d="M21.1 68.7c.5-.2 1.1-.3 1.4-.8" clipPath="url(#go-original-b)" />
        <path d="M21.1 69c-.1 0-.3-.1-.3-.2-.1-.2 0-.4.2-.4.1 0 .2-.1.2-.1.4-.2.8-.3 1-.6.1-.1.3-.2.5-.1.1.1.2.3.1.5-.4.5-.9.7-1.3.8l-.2.1h-.2z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#6AD7E5" d="M29.3 26.4c-13.6-3.8-3.5-21.1 7.4-14l-7.4 14z" clipPath="url(#go-original-b)" />
        <path d="M29.5 26.8l-.3-.1c-7-2-6.9-7-6.7-8.5.5-3.8 4.1-7.8 8.9-7.8 1.9 0 3.7.6 5.5 1.8l.3.2-7.7 14.4zm1.9-15.7c-4.5 0-7.8 3.7-8.3 7.2-.5 3.6 1.7 6.4 6 7.7l7.1-13.5c-1.5-.9-3.1-1.4-4.8-1.4z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#6AD7E5" d="M89.6 11.1c10.7-7.5 20.5 9.5 8 13.8l-8-13.8z" clipPath="url(#go-original-b)" />
        <path d="M97.5 25.3L89.2 11l.3-.2c1.9-1.3 3.8-2 5.7-2 4.6 0 7.9 3.8 8.6 7.5.3 1.5.6 6.6-6 8.8l-.3.2zm-7.4-14l7.7 13.3c3.9-1.4 5.9-4.4 5.3-8-.6-3.4-3.7-6.9-7.9-6.9-1.7-.1-3.4.4-5.1 1.6z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#F6D2A2" d="M92 112.3c2.7 1.7 7.7 6.8 3.6 9.3-3.9 3.6-6.1-4-9.6-5 1.5-2 3.4-3.9 6-4.3" clipPath="url(#go-original-b)" />
        <path d="M93.5 122.9c-1.6 0-3-1.6-4.2-3.1-1.1-1.2-2.2-2.5-3.4-2.9l-.5-.1.3-.4c1.2-1.7 3.2-3.9 6.2-4.4h.1l.1.1c1.7 1.1 5.4 4.2 5.3 7.1 0 1.1-.6 2-1.7 2.7-.7.7-1.4 1-2.2 1zm-7-6.5c1.2.5 2.2 1.8 3.2 2.9 1.2 1.5 2.4 2.8 3.7 2.8.6 0 1.2-.3 1.8-.9h.1c.9-.6 1.4-1.3 1.4-2.2 0-2.3-2.9-5.2-4.9-6.5-1.8.5-3.6 1.7-5.3 3.9zm9.1 5.5c-.1 0-.2-.1-.3-.2-.2-.4-.4-.9-.5-1.3-.3-.8-.6-1.6-1.2-2.2-.1-.1-.1-.3 0-.5.1-.1.3-.1.5 0 .7.7 1.1 1.6 1.4 2.5l.5 1.2c.1.2 0 .4-.1.5h-.3z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#F6D2A2" d="M43.2 118.1c-3.2.5-5 3.4-7.7 4.9-2.5 1.5-3.5-.5-3.7-.9-.4-.2-.4.2-1-.4-2.3-3.7 2.4-6.4 4.9-8.2 3.5-.8 5.7 2.2 7.5 4.6" clipPath="url(#go-original-b)" />
        <path d="M33.8 123.8c-1.3 0-2-1.1-2.2-1.5h-.1c-.3 0-.5-.1-.9-.5v-.1c-2.2-3.5 1.6-6.2 4.1-8l.9-.6h.2c.4-.1.7-.1 1.1-.1 3 0 4.9 2.6 6.5 4.7l.5.7-.6.1c-1.9.3-3.3 1.5-4.7 2.7-.9.8-1.8 1.5-2.8 2.1-.8.3-1.4.5-2 .5zm-2.2-2.1c.1 0 .2 0 .4.1h.1l.1.1c.2.3.7 1.2 1.7 1.2.5 0 1-.2 1.5-.5 1-.5 1.9-1.3 2.7-2 1.3-1.1 2.7-2.3 4.5-2.8-1.5-2-3.3-4.2-5.8-4.2-.3 0-.6 0-.9.1l-.8.6c-2.6 1.8-5.8 4.1-3.9 7.1.1.2.2.3.4.3zm.2.7c-.2 0-.4-.2-.3-.4.1-1 .6-1.7 1.1-2.5.3-.4.5-.8.7-1.2.1-.2.3-.2.4-.2.2.1.2.3.2.4-.2.5-.5.9-.8 1.3-.5.7-.9 1.3-1 2.1 0 .4-.1.5-.3.5z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" d="M29.9 21.7c-1.8-.9-3.1-2.2-2-4.3 1-1.9 2.9-1.7 4.7-.8l-2.7 5.1zm64.9-1.8c1.8-.9 3.1-2.2 2-4.3-1-1.9-2.9-1.7-4.7-.8l2.7 5.1z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#F6D2A2" d="M107.1 68.2c-.2 3.5-3.7 1.9-5.3.8-1.5-1.1-2-.2-2.1-2.3-.1-1.4-.2-2.7-.2-4.1 2.3-.2 4.8.3 6.7 1.7 1 .8 2.8 3 .9 3.9" clipPath="url(#go-original-b)" />
        <path d="M105.3 70.7c-1.5 0-3.2-1.1-3.7-1.4-.5-.3-.8-.5-1.1-.6-.8-.3-1-.5-1.1-2 0-.3 0-.6-.1-.9-.1-1-.2-2.1-.1-3.2v-.3h1.3c2.2 0 4.3.6 5.9 1.8.7.5 2 1.9 1.9 3.1 0 .4-.2.9-.8 1.2-.2 2-1.5 2.3-2.2 2.3zM99.8 63c0 .9 0 1.9.1 2.8 0 .3 0 .6.1.9.1 1.2.2 1.2.7 1.4.3.1.7.3 1.3.6.9.6 2.3 1.3 3.3 1.3.6 0 1.4-.2 1.5-1.8V68l.2-.1c.4-.2.6-.4.6-.8.1-.8-.9-2-1.6-2.5-1.5-1.1-3.5-1.7-5.5-1.7-.2.1-.4.1-.7.1z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#C6B198" d="M107.1 68.2c-.5-.2-1.1-.3-1.4-.8" clipPath="url(#go-original-b)" />
        <path d="M107.1 68.6h-.1l-.2-.1c-.5-.2-1-.3-1.3-.8-.1-.1-.1-.4.1-.5.1-.1.4-.1.5.1.2.3.6.4 1 .6.1 0 .2.1.2.1.2.1.3.3.2.4-.1.1-.3.2-.4.2z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#6AD7E5" d="M62.8 4c13.6 0 26.3 1.9 33 15 6 14.6 3.8 30.4 4.8 45.9.8 13.3 2.5 28.6-3.6 40.9-6.5 12.9-22.7 16.2-36 15.7-10.5-.4-23.1-3.8-29.1-13.4-6.9-11.2-3.7-27.9-3.2-40.4.6-14.8-4-29.7.9-44.1C34.5 8.5 48.1 5.1 62.8 4" clipPath="url(#go-original-b)" />
        <path d="M63.3 121.9h-2.5c-4.1-.1-10.3-.8-16.4-3.3-5.9-2.4-10.2-5.8-13-10.3-5.6-9.1-4.6-21.6-3.7-32.7.2-2.8.4-5.4.5-7.9.2-5.2-.2-10.6-.7-15.7-.8-9.4-1.6-19.1 1.5-28.5 2.4-7 6.7-12 13.2-15.2 5.1-2.5 11.4-3.9 20.4-4.6C76 3.6 89.3 5.5 96 18.8c4.4 10.7 4.4 22.2 4.5 33.3 0 4.2 0 8.5.3 12.7.1 1.3.2 2.6.2 3.9.8 12.2 1.7 26-3.9 37.2-2.8 5.7-7.7 9.9-14.4 12.6-5.4 2.2-12.2 3.4-19.4 3.4zM62.8 4.3c-14.1 1.1-27.9 4.2-33 19.4-3.1 9.3-2.3 18.9-1.5 28.2.4 5.2.9 10.5.7 15.8-.1 2.5-.3 5.1-.5 7.9-.9 11-1.9 23.4 3.6 32.3 2.3 3.7 9.7 12.5 28.8 13.2h2.5c22.1 0 30.3-9.8 33.3-15.6 5.5-11 4.6-24.8 3.9-36.9-.1-1.3-.2-2.6-.2-3.9-.2-4.2-.3-8.5-.3-12.7-.1-11-.1-22.5-4.4-33.1C92.7 13 88.2 9 82 6.7c-6.4-2.1-13.6-2.4-19.2-2.4z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M65.2 22.2c2.4 14.2 25.6 10.4 22.3-3.9-3-12.8-23.1-9.2-22.3 3.9" clipPath="url(#go-original-b)" />
        <path d="M76.2 31.5c-4.5 0-10.2-2.4-11.4-9.2-.2-3.2.8-6.1 2.9-8.3 2.3-2.5 5.8-3.9 9.4-3.9 4.2 0 9.2 2.2 10.6 8.3.8 3.4.2 6.4-1.7 8.8-2.1 2.6-5.8 4.3-9.8 4.3zm-10.7-9.3c.5 2.8 1.8 5 3.9 6.6 1.8 1.4 4.3 2.1 6.8 2.1 3.7 0 7.3-1.6 9.3-4.1 1.8-2.2 2.3-5.1 1.6-8.3-1.3-5.7-6-7.7-10-7.7-3.4 0-6.7 1.4-8.9 3.7-1.9 2-2.9 4.7-2.7 7.7z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M37.5 24.5c3.2 12.3 22.9 9.2 22.2-3.2-.9-14.8-25.3-12-22.2 3.2" clipPath="url(#go-original-b)" />
        <path d="M48 32.7c-4.3 0-9.3-2.1-10.9-8.1-.7-3.5 0-6.7 2-9.1 2.2-2.7 5.8-4.3 9.7-4.3 5.2 0 10.7 3.1 11.1 10.1.2 2.9-.7 5.5-2.7 7.6-2.1 2.3-5.6 3.8-9.2 3.8zm.8-20.8c-3.7 0-7.1 1.5-9.2 4-1.9 2.3-2.5 5.2-1.8 8.5C39.2 30 44 32 48 32c3.4 0 6.7-1.3 8.8-3.6 1.8-1.9 2.7-4.4 2.5-7.1-.2-4.3-3.1-9.4-10.5-9.4z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M68 39.2c0 1.8.4 3.9.1 5.9-.5.9-1.4 1-2.2 1.3-1.1-.2-2-.9-2.5-1.9-.3-2.2.1-4.4.2-6.6l4.4 1.3z" clipPath="url(#go-original-b)" />
        <path d="M65.9 46.8c-1.3-.2-2.3-1-2.8-2.1-.2-1.6-.1-3.1 0-4.6.1-.7.1-1.4.1-2.1v-.4l5.1 1.6v.2c0 .6.1 1.2.1 1.9.1 1.3.2 2.7 0 4v.1c-.4.8-1.1 1-1.8 1.3-.2-.1-.4 0-.7.1zm-2.2-2.4c.4.9 1.2 1.5 2.1 1.7.2-.1.4-.1.5-.2.6-.2 1.1-.4 1.4-.9.2-1.2.1-2.5 0-3.8 0-.6-.1-1.2-.1-1.7l-3.8-1.2c0 .6-.1 1.2-.1 1.7-.1 1.6-.2 3 0 4.4z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" d="M46.3 22.5c0 2-1.5 3.6-3.3 3.6-1.8 0-3.3-1.6-3.3-3.6s1.5-3.6 3.3-3.6c1.8 0 3.3 1.6 3.3 3.6" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M45.2 23.3c0 .5-.4.9-.8.9s-.8-.4-.8-.9.4-.9.8-.9c.5 0 .8.4.8.9" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" d="M74.2 21.6c0 2-1.5 3.6-3.3 3.6-1.8 0-3.3-1.6-3.3-3.6s1.5-3.6 3.3-3.6c1.8 0 3.3 1.6 3.3 3.6" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#fff" d="M73.2 22.4c0 .5-.3.9-.8.9-.4 0-.8-.4-.8-.9s.3-.9.8-.9c.4 0 .8.4.8.9M58.4 39c-1.5 3.5.8 10.6 4.8 5.4-.3-2.2.1-4.4.2-6.6l-5 1.2z" clipPath="url(#go-original-b)" />
        <path d="M60.5 46.6c-.7 0-1.4-.4-1.9-1.2-1.1-1.6-1.3-4.6-.5-6.5l.1-.2 5.5-1.4v.4l-.1 2.2c-.1 1.5-.2 2.9 0 4.4v.1l-.1.1c-1 1.4-2 2.1-3 2.1zm-1.8-7.3c-.6 1.7-.4 4.4.5 5.7.4.6.8.9 1.3.9.7 0 1.5-.6 2.3-1.6-.2-1.5-.1-3 .1-4.4l.1-1.7-4.3 1.1z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" fill="#F6D2A2" d="M58.9 32.2c-2.7.2-4.9 3.5-3.5 6 1.9 3.4 6-.3 8.6 0 3 .1 5.4 3.2 7.8.6 2.7-2.9-1.2-5.7-4.1-7l-8.8.4z" clipPath="url(#go-original-b)" />
        <path fill="#231F20" d="M69.7 40.2c-.9 0-1.8-.4-2.7-.8-.9-.4-1.9-.8-3-.8h-.3c-.8 0-1.7.3-2.7.7-1.1.4-2.2.7-3.2.7-1.2 0-2.1-.5-2.7-1.6-.7-1.2-.6-2.6.1-3.9.8-1.5 2.2-2.4 3.7-2.6l8.9-.4h.1c2.2.9 4.7 2.6 5.2 4.6.2 1-.1 2-.9 2.9-.8.9-1.6 1.2-2.5 1.2zM64.1 38c1.1 0 2.2.5 3.2.9.9.4 1.7.7 2.5.7.7 0 1.3-.3 1.9-.9.7-.7.9-1.5.8-2.3-.4-1.7-2.8-3.3-4.7-4.1l-8.7.4c-1.3.1-2.5 1-3.2 2.2-.6 1.1-.6 2.3-.1 3.3.5.9 1.1 1.3 2.1 1.3.9 0 1.9-.4 2.9-.7 1.1-.4 2-.7 3-.7 0-.2.1-.2.3-.1z" clipPath="url(#go-original-b)" />
        <path fillRule="evenodd" clipRule="evenodd" d="M58.6 32.1c-.2-4.7 8.8-5.3 9.8-1.4 1.1 4-9.4 4.9-9.8 1.4" clipPath="url(#go-original-b)" />
      </svg>
    ),
  },
  {
    name: "n8n",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="#EA5A47" letterSpacing="-0.05em">
          n8n
        </text>
      </svg>
    ),
  },
  {
    name: "Vite",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="vite-a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#41d1ff" /><stop offset="1" stopColor="#bd34fe" /></linearGradient>
          <linearGradient id="vite-b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffea83" /><stop offset=".083" stopColor="#ffdd35" /><stop offset="1" stopColor="#ffa800" /></linearGradient>
        </defs>
        <path fill="url(#vite-a)" d="M124.766 19.52 67.324 122.238c-1.187 2.121-4.234 2.133-5.437.024L3.305 19.532c-1.313-2.302.652-5.087 3.261-4.622L64.07 25.187a3.09 3.09 0 0 0 1.11 0l56.3-10.261c2.598-.473 4.575 2.289 3.286 4.594Zm0 0" />
        <path fill="url(#vite-b)" d="M91.46 1.43 48.954 9.758a1.56 1.56 0 0 0-1.258 1.437l-2.617 44.168a1.563 1.563 0 0 0 1.91 1.614l11.836-2.735a1.562 1.562 0 0 1 1.88 1.836l-3.517 17.219a1.562 1.562 0 0 0 1.985 1.805l7.308-2.223c1.133-.344 2.223.652 1.985 1.812l-5.59 27.047c-.348 1.692 1.902 2.614 2.84 1.164l.625-.968 34.64-69.13c.582-1.16-.421-2.48-1.69-2.234l-12.185 2.352a1.558 1.558 0 0 1-1.793-1.965l7.95-27.562A1.56 1.56 0 0 0 91.46 1.43Zm0 0" />
      </svg>
    ),
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name ?? "Khondoker Sazzad Sunfi";
  const tagline = profile?.tagline ?? "Data Science | Machine Learning | AI";
  const bio =
    profile?.bio ??
    "I build intelligent systems and scalable data architectures that solve complex problems. Transforming raw data into actionable insights and robust AI products.";

  // Use CMS avatar if available, otherwise fall back to local image
  const avatarSrc =
    profile?.avatar?.asset?._ref
      ? urlFor(profile.avatar).width(600).height(600).fit("crop").url()
      : "/sazzadsunfi.jpg";

  const images = ["/sunfi1.jpg", avatarSrc];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [contributionCount, setContributionCount] = useState<string | number>("...");

  useEffect(() => {
    const swapInterval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(swapInterval);
  }, [avatarSrc]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/sunfi-x?y=${currentYear}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.total && typeof data.total[currentYear] === 'number') {
            setContributionCount(data.total[currentYear]);
            return;
          }
        }
        setContributionCount(250);
      } catch {
        setContributionCount(250);
      }
    };
    fetchContributions();
  }, []);

  // Extract first and last name for styling
  const nameParts = name.split(" ");
  const lastName = nameParts.pop() ?? "Sunfi";
  const firstName = nameParts.join(" ") || "Khondoker Sazzad";

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pt-24 pb-16 bg-transparent overflow-hidden min-h-[85vh] hero-mobile-fix"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <style jsx global>{`
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

.quicksandHeading {
  font-family: 'Quicksand', sans-serif !important;
}

@media (min-width: 769px) {
  .hero-name-container {
    font-size: 48px !important;
    white-space: nowrap !important;
    display: block !important;
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .hero-mobile-fix {
    padding: 0.5rem 0.25rem !important;
    padding-top: 50px !important; 
    overflow: clip !important;
  }
  .hero-mobile-fix .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .hero-mobile-fix * {
    text-align: center !important;
  }
  .hero-name-container {
    font-size: clamp(1.8rem, 7vw, 2.2rem) !important;
    white-space: normal !important;
    word-break: break-word !important;
    display: block !important;
    width: 100% !important;
    line-height: 1.1 !important;
    word-spacing: 0.1em !important;
    letter-spacing: -0.01em !important;
    margin-top: 0.25rem !important;
    margin-bottom: 0.5rem !important;
  }
  .hero-name-container span {
    display: inline-block !important;
    margin-right: 0.2rem !important;
  }
  .hero-tagline {
    font-size: clamp(0.8rem, 3.5vw, 1rem) !important;
    justify-content: center !important;
    display: flex !important;
    flex-wrap: wrap !important;
    margin-bottom: 0.5rem !important;
  }
  .hero-image-container {
    height: auto !important;
    min-height: 320px !important; 
    margin-top: -1.5rem !important; 
    margin-bottom: -1.5rem !important; 
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    overflow: visible !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin-left: calc(-50vw + 50%) !important;
    position: relative !important;
  }
  .hero-orbit-wrapper {
    transform: scale(0.62) !important; 
  }
  .hero-buttons-row {
    flex-direction: row !important;
    justify-content: center !important;
    gap: 0.5rem !important;
    max-width: 300px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-top: 0.5rem !important;
  }
  .hero-buttons-row a {
    flex: 1 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    font-size: 13px !important;
  }
  .hero-socials-row {
    justify-content: center !important;
    gap: 0.75rem !important;
    margin-top: 2rem !important;
  }
  .hero-github-badge {
    bottom: 0px !important;
    right: -5px !important;
    transform: none !important;
    z-index: 20 !important;
    max-width: 130px !important;
    padding: 6px 10px !important;
    border-radius: 8px !important;
  }
  .hero-badge-count {
    font-size: 13px !important;
    font-weight: 900 !important;
    text-shadow: 0 0 1px currentColor;
  }
  .hero-badge-label {
    font-size: 9px !important;
    font-weight: 800 !important;
  }
  .hero-available-badge {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  .hero-greeting-label {
    margin-bottom: 0.25rem !important;
  }
}
`}</style>

      <div className="container mx-auto px-6 lg:px-12 z-[2] relative">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Text and Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-0 lg:mt-0">
            {/* Available Pill & Greeting */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="hero-available-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.12)] backdrop-blur-md mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                <span className="text-xs md:text-sm font-medium text-[#34D399] tracking-wide">Available for opportunities</span>
              </div>
              <div className="hero-greeting-label text-sm font-medium tracking-[0.2em] text-gray-400 uppercase">
                Hi, I'm
              </div>
            </motion.div>

            {/* Main Name */}
            <motion.h1
              variants={itemVariants}
                className={`quicksandHeading hero-name-container mb-4 text-white leading-[1.1] flex flex-row flex-wrap items-center justify-center lg:justify-start gap-x-2 sm:gap-x-3`}
            >
              <span className="font-semibold text-white">{firstName}&nbsp;</span>
              <span className="font-bold text-[#C83228D9] relative inline-block">
                {lastName}
              </span>
            </motion.h1>

            {/* Roles / Tagline */}
            <motion.h2
              variants={itemVariants}
              className="hero-tagline text-base md:text-lg lg:text-xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300 mb-4"
            >
              {tagline.split("|").map((part, index, array) => (
                <span key={index} className="inline-block">
                  {part.trim()}
                  {index < array.length - 1 && (
                    <span className="text-[#C83228D9] mx-3 opacity-70 inline-block translate-y-[-1px]">|</span>
                  )}
                </span>
              ))}
            </motion.h2>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-gray-400/90 max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed font-light px-4 md:px-0"
            >
              {bio}
            </motion.p>

            {/* Location & University */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-6 mb-6 text-sm text-gray-500 font-medium"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C83228D9]/80" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C83228D9]/80" />
                <span>United International University</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto hero-buttons-row"
            >
              {/* Secondary: View Projects */}
              <Link
                href="/projects"
                className="group relative px-8 py-3.5 w-full sm:w-auto rounded-full border border-white/20 bg-white/5 text-white font-medium text-sm md:text-base tracking-wide overflow-hidden transition-all hover:border-white/40 hover:bg-white/10 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Projects
                </span>
              </Link>

              {/* Primary: Hire Me */}
              <Link
                href="/contact"
                className="group relative px-8 py-3.5 w-full sm:w-auto rounded-full bg-[#C83228D9] hover:bg-[#C83228] text-[#FFFFFF] font-medium text-sm md:text-base tracking-wide transition-all shadow-[0_0_20px_rgba(200,50,40,0.4)] hover:shadow-[0_0_30px_rgba(200,50,40,0.6)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  Hire Me
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-6 mt-8 w-full hero-socials-row"
            >
              {[
                { icon: FaGithub, href: "https://github.com/sunfi-x", label: "GitHub" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/khondoker-sazzad-sunfi-3124a4325/", label: "LinkedIn" },
                { icon: FaXTwitter, href: "https://x.com/SUNFI15", label: "X" }
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#dc2626]/50 hover:bg-[#dc2626]/5 transition-all duration-300"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-[18px] h-[18px] md:w-5 md:h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-900 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Profile Picture & Orbits */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 h-[350px] md:h-[450px] lg:h-[600px] w-full mt-10 lg:mt-0 hero-image-container">
            <div className="relative group w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 z-10">
              {/* Multi-layered glowing borders */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 md:-inset-6 lg:-inset-8 rounded-full border border-[#dc2626]/15 border-t-[#dc2626]/45 opacity-45 z-0 pointer-events-none"
              />
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(220,38,38,0.12)",
                    "0 0 40px rgba(220,38,38,0.25)",
                    "0 0 20px rgba(220,38,38,0.12)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#dc2626]/4 z-0 pointer-events-none"
              />

              {/* Main Avatar Container */}
              <div className="relative w-full h-full">

                {/* Layer 1 (Front - Main Avatar Stack) */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-[#0a0a0a] ring-2 ring-[#dc2626]/30 shadow-[0_0_28px_rgba(220,38,38,0.2)] z-20">
                  {images.map((src, i) => (
                    <motion.div
                      key={`front-${i}`}
                      initial={{ opacity: i === 0 ? 1 : 0 }}
                      animate={{ opacity: currentIdx === i ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={src}
                        alt={`${name} - ${i}`}
                        fill
                        className="object-cover"
                        priority
                        loading="eager"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* GitHub Contributions Badge */}
                <div 
                  className="hero-github-badge"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "-10px",
                    backgroundColor: "#111318",
                    border: "1px solid #ffffff15",
                    borderRadius: "12px",
                    padding: "6px 10px",
                    zIndex: 40,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "fit-content",
                    minWidth: "100px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                  }}
                >
                  {/* Top - Count Number */}
                  <span 
                    className="hero-badge-count"
                    style={{ 
                      color: "#22C55E", 
                      fontWeight: "700", 
                      fontSize: "22px",
                      lineHeight: "1.2",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {contributionCount}+
                  </span>

                  {/* Bottom - Label */}
                  <span 
                    className="hero-badge-label"
                    style={{ 
                      color: "#888", 
                      fontSize: "11px",
                      fontWeight: "400",
                      marginTop: "0px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    GitHub Contributions
                  </span>
                </div>
              </div>

              {/* Floating Tech Icons via CSS Orbit & Framer Motion */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-0 h-0 z-30 pointer-events-none"
              >
                {floatingIcons.map((icon, i) => (
                  <div
                    key={icon.name}
                    className="absolute top-0 left-0"
                    style={{ transform: `rotate(${(i * 360) / 9}deg)` }}
                  >
                    {/* Outward Push using responsive Tailwind translate */}
                    <div className="absolute top-0 left-0 -translate-y-[140px] md:-translate-y-[200px] lg:-translate-y-[240px]">
                      {/* Counter Rotation (to keep upright against fixed rotation) */}
                      <div style={{ transform: `rotate(-${(i * 360) / 9}deg)` }}>
                        {/* Counter Rotation (to keep upright against continuous animation) */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 left-0"
                        >
                          {/* Robust Centering */}
                          <div className="absolute pointer-events-auto -left-6 -top-6 md:-left-7 md:-top-7 lg:-left-8 lg:-top-8">
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1, y: ["-6px", "6px", "-6px"] }}
                              transition={{
                                opacity: { delay: 0.8 + i * 0.1, duration: 0.6 },
                                scale: { delay: 0.8 + i * 0.1, duration: 0.6, type: "spring" },
                                y: { duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                              }}
                              whileHover={{ scale: 1.2, zIndex: 40 }}
                              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-[#0a0a0a]/90 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-2.5 md:p-3 lg:p-3.5 backdrop-blur-xl hover:border-[#dc2626]/60 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-colors cursor-pointer group"
                              title={icon.name}
                            >
                              <div className="w-full h-full group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                                {icon.svg}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
