const loadingPanel = (param) => {
    return (
        <div className={`${param ? 'flex justify-center items-center' : 'hidden'}`}>
            <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500 z-50">
                loading...
            </div>
        </div>
    )
}

export default loadingPanel