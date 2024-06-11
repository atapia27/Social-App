const sizes = {
    md: 'px-4 py-2 rounded-md text-base',
    lg: 'px-5 py-3 rounded-lg text-lg',
  }
  
  const colors = {
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    cyan: 'bg-cyan-600 hover:bg-cyan-700 text-white',
  }
  
  export default function Link({ color, size, children }) {
    let sizeClasses = sizes[size]
  
    return (
      <button type="button" className={`flex items-center ${sizeClasses}`}>
        {children}
      </button>
    )
  }