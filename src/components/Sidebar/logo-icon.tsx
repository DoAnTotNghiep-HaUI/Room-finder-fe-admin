import logo from "../../../public/favicon.svg";
export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <img
        src={logo}
        alt=""
        className="w-10 h-10"
      />
    </div>
  );
};
