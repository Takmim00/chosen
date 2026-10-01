import banner from "../assets/img/banner.png";

const Banner = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        minHeight: "85vh",
      }}
      className="flex items-center justify-center px-4 text-center"
    >
      <div className="mx-auto text-black space-y-6">
        <h1 className="text-6xl  font-bold text-center leading-tight">
          FOR CLIENTS SEEKING <br />
          TALENT. FOR PROVIDERS <br />
          SEEKING GROWTH.
        </h1>
        <p className="text-md  mb-8 max-w-3xl mx-auto font-semibold">
          ChaskiX is where customers come to
          get things done — and where solopreneurs, side hustlers, and small
          business owners come to make it happen. Whether you're a buyer ready
          to post a request or a provider looking to offer your skills, you're
          in the right place.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button className="bg-[#FFAA01]  text-black font-semibold py-2 px-9 rounded-full">
            EXPLORE SERVICES
          </button>
          <button className="bg-[#FFAA01]  text-black font-semibold py-2 px-9 rounded-full">
            LIST YOUR SERVICE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
