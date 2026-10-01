import img1 from "../assets/img/Vector-1.png";
import img2 from "../assets/img/Vector-2.png";
import img3 from "../assets/img/Vector-3.png";
import img4 from "../assets/img/Vector-4.png";
const SearchBid = () => {
  return (
    <div className="bg-[#DDE4B8] py-20">
      <div className="w-11/12 mx-auto ">
        <h1 className="text-6xl font-bold">
          SEARCH.BID.CHAT.DELIVER.
          <span className="text-[#848239]">REPEAT.</span>
        </h1>
        <div className="grid grid-cols-4 gap-8 my-8">
          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                SEARCH FOR <br /> SERVICES
              </h2>
              <p className="text-[#848239]  font-medium">
                Find what you need by location, category, or keywords.
              </p>
              <img src={img2} alt="" className="w-28" />
            </div>
          </div>

          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                POST <br /> OPPORTUNITIES
              </h2>
              <p className="text-[#848239]  font-medium">
                Share your needs or advertise your offerings.
              </p>
              <img src={img4} alt="" className="w-28" />
            </div>
          </div>
          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                BID OR <br /> HIRE
              </h2>
              <p className="text-[#848239]  font-medium">
                Make your move. Negotiate and accept bids in real time.
              </p>
              <img src={img3} alt="" className="w-28" />
            </div>
          </div>
          <div className="card bg-[#F5F1EB]  shadow-sm rounded-3xl">
            <div className="card-body items-center flex text-center p-6">
              <h2 className="card-title font-bold text-2xl">
                GET PAID OR <br /> PAY FAIRLY
              </h2>
              <p className="text-[#848239]  font-medium">
                Secure, fast, and transparent <br /> transactions.
              </p>
              <img src={img1} alt="" className="w-14" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <button className=" border-2 px-16 py-2 rounded-2xl font-bold">BROWSE OR BID NOW</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBid;
