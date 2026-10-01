import img2 from "../assets/img/Vector-2.png";

import img4 from "../assets/img/Vector-4.png";
const OneSearch = () => {
  return (
    <div className="bg-[#DDE4B8]">
      <div className="grid grid-cols-2 w-11/12 mx-auto py-20">
        <div>
          <h1 className="text-6xl font-bold ">
            ONE SEARCH. <br />
            ENDLESS
            <br />
            POSSIBILITIES.
          </h1>
          <p className="text-[#848239] text-2xl font-normal pt-6">
            Forget endless scrolling. Post what you need or search directly.
            ChaskiX matches you with real people offering real services —
            tailored to your location, your budget, and your timing.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 my-8">
          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                POST A <br /> REQUEST
              </h2>

              <img src={img4} alt="" className="w-28 pt-4" />
            </div>
          </div>
          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                SEARCH <br /> PROVIDERS
              </h2>

              <img src={img2} alt="" className="w-28 pt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneSearch;
