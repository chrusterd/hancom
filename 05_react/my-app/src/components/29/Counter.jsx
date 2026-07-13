import { useState } from 'react';

const Counter = () => {
    const [ count, setCount ] = useState(0)
    return (
        <button
            onClick={() => setCount(c => c + 1)}
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-150 hover:bg-purple-700 active:bg-purple-800 cursor-pointer"
        >
            {count} Times Clicked!
        </button>
    )
}
export default Counter