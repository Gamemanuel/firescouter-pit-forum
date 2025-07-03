import Icon from 'supercons'

export default function DropDown({ question, dataBaseId, optionsArray}) {
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
            <label className="
                block
                text-left
                uppercase
                tracking-wide
                text-gray-800
                dark:text-white
                text-xs
                font-bold mb-2
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
                    name={ dataBaseId }
                    id={ dataBaseId }
                >
                    { /* allways will be an option */}
                    <option>None</option>

                    {/* variable option choices based on the imputed array */}
                    {optionsArray.map(option => {
                        return (
                            <option key={option}>
                                {option}
                            </option>
                        )
                    }
                    )}

                </select>
                <div className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    flex
                    items-center
                    px-2
                    dark:text-gray-700
                    text-gray-100
                    "
                >
                    <Icon className="
                        dark:fill-white
                        fill-purple-500
                        h-7
                        w-7
                        "  
                        glyph="down-caret" size={128} 
                    />
                </div>
            </div>
        </div>
        </div>
    );
}