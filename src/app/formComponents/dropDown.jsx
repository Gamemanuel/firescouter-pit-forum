export default function DropDown({ question, dataBaseId, optionsArray}) {
    return (
        <div className="
            w-full
            px-3
            mb-6
            "
        >
            <label className="
                block
                uppercase
                tracking-wide
                text-white
                text-xs
                font-bold
                mb-2
                "
                htmlFor={ dataBaseId }
            >
                { question }
            </label>
            <div className="relative">
                <select className="
                    appearance-none
                    block
                    w-full
                    bg-gray-800
                    text-gray-100
                    border-gray-800
                    rounded
                    py-3
                    px-4
                    leading-tight
                    focus:outline-none
                    focus:border-purple-500
                    focus:border-2
                    border-2
                    rounded-lg
                    shadow-lg
                    " 
                    name={ dataBaseId }
                    id={ dataBaseId }
                >
                    { /* allways will be an option */}
                    <option>None</option>

                    {/* variable option choices based on the array */}
                    {/* TODO: make the # of options variable and the text be based on the array */}
                        <option>Mechanum</option>
                        <option>6 wheel</option>
                        <option>Tank</option>
                        <option>omni</option>
                        <option>4-wheel</option>

                </select>
                <div class="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    flex
                    items-center
                    px-2
                    text-gray-700
                    "
                >
                    <svg class="
                        fill-white
                        h-4
                        w-4
                        " 
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}