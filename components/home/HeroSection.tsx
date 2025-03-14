const HeroSection = () => {
    return (
        <section
        className="relative flex h-[50vh] items-center justify-center bg-no-repeat bg-left"
        style={{
            backgroundImage: "url('/img/redCar.png')",
            backgroundSize: "35%", 
            }}
        >            <div className="z-5 relative mx-auto max-w-7xl px-12">
                <div className="mx-auto w-full text-center md:w-11/12 xl:w-9/12">
                    <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-red-700 md:text-6xl md:tracking-tight">
                        <span>Siguranța</span>{" "}
                        <span className="leading-12 block w-full bg-gradient-to-r from-yellow-600 to-red-500 bg-clip-text py-2 text-transparent lg:inline">
                            începe cu tine!{" "}
                        </span>
                    </h1>
                </div>
            </div>
        </section> 
    );
};

export default HeroSection;