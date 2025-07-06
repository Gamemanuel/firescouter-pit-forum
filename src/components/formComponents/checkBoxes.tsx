import React from 'react';

interface CheckBoxProps {
  question: string;
  options: string[];
  categoryOfQuestion: string;
}

export default function CheckBox({ question, options, categoryOfQuestion }: CheckBoxProps) {
  return (
    <div className="flex flex-col mb-6 -mx-3 px-3">
      <label
        className="
          block
          text-left
          uppercase
          tracking-wide
          text-gray-800
          dark:text-white
          text-xs
          font-bold
          mb-2
        "
      >
        {question}
      </label>
      <div className="
        relative
        flex
        w-full
        flex-col
        rounded-lg
        bg-gray-100
        dark:bg-gray-800
        text-gray-900
        dark:text-gray-100
        shadow
        overflow-hidden {/* Important to contain rounded corners */}
        border
        border-gray-300
        dark:border-gray-700
      ">
        <nav className="flex min-w-[240px] flex-col gap-1 p-2">
          {options.map((option, index) => (
            <div
              key={option}
              role="button"
              className="flex w-full items-center rounded-lg p-0 transition-all
              hover:bg-gray-200 focus-within:bg-gray-200 active:bg-gray-200
              dark:hover:bg-gray-700 dark:focus-within:bg-gray-700 dark:active:bg-gray-700
              "
            >
              <label
                htmlFor={`${categoryOfQuestion}-${index}`}
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative" htmlFor={`${categoryOfQuestion}-${index}`}>
                    <input
                      type="checkbox"
                      name={categoryOfQuestion}
                      value={option}
                      className="
                        peer h-5 w-5 cursor-pointer transition-all appearance-none rounded
                        shadow hover:shadow-md
                        border border-gray-400 dark:border-gray-500
                        checked:bg-purple-500 checked:border-purple-500
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                      "
                      id={`${categoryOfQuestion}-${index}`}
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100
                      top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                        stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                  <label className="cursor-pointer ml-2 text-gray-800 text-sm dark:text-gray-200" htmlFor={`${categoryOfQuestion}-${index}`}>
                    {option}
                  </label>
                </div>
              </label>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}