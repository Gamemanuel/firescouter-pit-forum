export default function InputBox({ question, categoryOfQuestion, placeholder, type }) {
  return (
    <div className='
      flex
      flex-wrap
      -mx-3
      mb-6
      '
    >
    <div className="
      w-full
      px-3
      mb-3
      "
    >
      <label
        className="
          block
          text-left
          uppercase
          tracking-wide
          text-gray-800
          dark:text-white
          text-xs
          font-bold mb-2
          "
        htmlFor={categoryOfQuestion}
      >
        {question}
      </label>
      <input
        className="
          appearance-none
          block
          w-full
          bg-gray-100
          dark:bg-gray-800
          text-gray-900
          dark:text-gray-100
          border
          border-gray-300
          dark:border-gray-700
          rounded
          py-3
          px-4
          leading-tight
          focus:outline-none
          focus:border-purple-500
          "
        name={categoryOfQuestion}
        id={categoryOfQuestion}
        type={type}
        placeholder={placeholder}
      />
    </div>
    </div>  
  );
}