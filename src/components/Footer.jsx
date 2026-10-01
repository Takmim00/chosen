import logo from "../assets/img/Vector.png";
const Footer = () => {
  return (
    <div className="bg-[#DDE4B8] ">
      <div className="w-11/12 mx-auto grid grid-cols-2 py-20">
        <div>
          <h1 className="font-bold text-7xl text-[#848239]">
            CHaSKIX <br /> STUDIOS
          </h1>
          <p className="text-[#848239] text-xl pt-1.5">
            INSPIRED BYTHE SPIRIT OFTHE CHaSQUIS
          </p>
          <div class="mt-8 space-y-2">
            <p class="uppercase font-semibold text-[#848239] tracking-wide">
              Keep up with the tribe
            </p>
            <div class="flex">
              <input
                type="email"
                placeholder="Your email →"
                class="px-4 py-2 border border-[#848239] rounded-2xl bg-transparent placeholder-[#848239] focus:outline-none w-64"
              />
            </div>
          </div>
        </div>
        <div class="relative ">
          <p class="text-[#848239] text-lg leading-relaxed ">
            The name "Chaski" honors the legendary Andean messengers, known for
            their strength, agility, and resourcefulness. Just like the
            Chasquis, we help solopreneurs and service providers move faster,
            communicate more effectively, and create lasting impact.
          </p>

          <img
            src={logo}
            alt="abstract shape"
            class="absolute left-28 pt-4 w-96 opacity-30 pointer-events-none"
          />
        </div>
      </div>
      <footer class="bg-[#848239] text-[#F5F1EB] py-4">
        <div class="w-11/12 mx-auto px-6 flex flex-col md:flex-row justify-between text-sm">
          <div class="flex space-x-6 mb-2 md:mb-0">
            <a href="#" class="hover:underline">
              INSTAGRAM
            </a>
            <a href="#" class="hover:underline">
              TIKTOK
            </a>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="hover:underline">
              PRIVACY
            </a>
            <a href="#" class="hover:underline">
              TERMS
            </a>
            <span>©2025 CHASKIX</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
