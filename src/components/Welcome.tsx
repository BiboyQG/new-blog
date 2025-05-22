export default function Welcome() {
  return (
    <div className="welcome-section">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <span className="mr-2">👋</span> Welcome to Banghao's Blog
      </h1>

      <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
        <p>
          Hi! This is Banghao Chi, a M.S. CS student from University of
          Illinois at Urbana-Champaign(UIUC) and also a Research Assistant advised by{" "}
          <span className="font-medium">Prof. Minjia Zhang</span>. I'm also
          under the supervision of{" "}
          <span className="font-medium">Kevin Chang</span> in an internship at
          <span className="font-medium">
            {" "}
            National Center for Supercomputing Applications(NCSA)
          </span>
          . Before that, I was an Mathematics undergrad at UIUC.
        </p>

        <ul className="space-y-2 list-disc pl-5">
          <li>I'm documenting my learning notes in this blog 😊</li>
          <li>
            This is a space where I will mostly be sharing about{" "}
            <span className="font-medium">Coding and Math</span> 🤓
          </li>
          <li>
            I also work on Fullstack development with{" "}
            <span className="font-medium">React, Golang and SpringBoot</span>{" "}
            (^▽^)
          </li>
        </ul>
      </div>

      <div className="flex space-x-4">
        <a
          href="https://github.com/biboyqg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-github"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@biboyog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-youtube"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/banghao-chi-550737276/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-linkedin"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </div>
    </div>
  );
}
