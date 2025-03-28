# Document Annotation Application

This is a Next.js single-page application (SPA) built with TypeScript and Emotion for styling. The application allows users to upload PDF documents, annotate them (highlight, underline, comment, and add signatures), and export the final annotated document as a high-quality PDF.

## Table of Contents

- [Setup and Running Instructions](#setup-and-running-instructions)
- [Libraries and Tools Used](#libraries-and-tools-used)
- [Challenges Faced and Solutions](#challenges-faced-and-solutions)
- [Potential Future Enhancements](#potential-future-enhancements)

## Setup and Running Instructions

1. **Clone the Repository**  
   Make sure you have forked the repository and cloned your fork:
   ```bash
   git clone https://github.com/yourusername/your-forked-repo.git
   cd your-forked-repo
   ```
2. **Initialize the Next.js App with TypeScript**
   npx create-next-app@latest . --typescript

3. **Install Dependencies**
   npm install
   npm install @emotion/react @emotion/styled

4. **Configure Next.js for Emotion (optional)**
   import type { NextConfig } from "next";

const nextConfig: NextConfig = {
/_ config options here _/
compiler: {
emotion: true,
},
};

export default nextConfig;

5. **Run the Development Server**
   npm run dev

6. **Building for Production**
   npm run build
   npm start

## Libraries and Tools Used

Next.js: Provides a robust framework for building server-rendered and static web applications.

TypeScript: Enhances code quality and maintainability with static typing.

Emotion: Enables CSS-in-JS styling for dynamic and modular component styling.

react-pdf & pdf.js: Used to render PDF documents in the browser. This combination is easy to integrate, highly customizable, and will serve as the foundation for adding editing and annotation features later.

uuid: to generate unique Id for key Identifiers.

ESLint and Prettier: Ensure code consistency and maintainability through automated linting and formatting.

sweetalert: for proper action notifications

used a google font as well, that looked to fit the purpose of the task.

## Challenges Faced and Solutions

Initial Setup and Configuration:
Setting up Next.js with TypeScript and integrating Emotion required careful configuration. Configuring the SWC compiler with Emotion support in next.config.js resolved SSR issues and improved debugging.

Integration with PDF Rendering and Annotation Tools:
While PDF rendering and annotation features are in progress, integrating pdf.js and PDF-Lib was really challenging. Had to do some research to figure things out.

Finding a way to properly position the comment and signature in the exported pdf file was really challenging, mainly because the PDF-LIB which i am using makes use of a bottom left origin for positioning, but with some brainstorming and research i was able to find a way to make it work better at least.

the pdf worker and viewer gave me a lot of headached while trying to consfigure, as they has to be exactly of same version. Just ended up downgrading the viewer to the version of the worker.

## Potential Future Enhancements
Making the process a lot less manual than it is.

Real-Time Collaboration:
Explore the possibility of enabling multiple users to annotate a document simultaneously.

Advanced UI/UX Improvements:
Continuously improve the interface and user experience with responsive design, smooth transitions, and additional feedback mechanisms.
