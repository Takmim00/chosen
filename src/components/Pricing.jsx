const Pricing = () => {
  return (
    <div className="bg-[#F5F1EB] flex items-center justify-center py-20">
      <div className="w-11/12 mx-auto">
        <h1 className="text-center font-bold text-6xl mb-5">PRICING</h1>
        <div class="flex justify-center mb-5">
          <div class="flex border-2 rounded-2xl p-1  overflow-hidden ">
            <button class="px-16 py-2  text-xl font-semibold text-black">
              CLIENT
            </button>
            <button class="px-16 py-2 text-xl font-bold rounded-xl  bg-[#FFAA01]">
              BUSINESS
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-[#DDE4B8] rounded-2xl p-8 ">
            <h1 className=" text-[#848239] text-2xl pb-2">Community Member</h1>
            <p className="font-bold text-4xl pb-6">FREE</p>
            <p className="border-b-2 text-[#848239] font-medium border-[#848239] py-3">
              Read-only access to Forum
            </p>
            <p className=" text-[#848239] font-medium pt-3">
              Read-only access to Service Community
            </p>
          </div>
          <div className="bg-[#DDE4B8] rounded-2xl p-8 ">
            <h1 className=" text-[#848239] text-2xl pb-2">Community Builder</h1>
            <p className="font-bold text-4xl pb-6">$7 / MONTH</p>
            <p className="border-b-2 text-[#848239] font-medium border-[#848239] py-3">
              Full access to Forum
            </p>
            <p className="border-b-2 text-[#848239] font-medium border-[#848239] py-3">
              Full access to Service Community
            </p>
            <p className="border-b-2 text-[#848239] font-medium border-[#848239] py-3">
              Unlimited access to built in AI Consultant and analytics
            </p>
            <p className=" text-[#848239] font-medium pt-3">
              Access to premium ChaskiX partner benefits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
