import Image from "next/image";

const Header = () => {
  return (
    <div className="flex">
      <div>
        <Image src="/logo.png" alt="Aakash" width={50} height={50} />
        <span>Aakash</span>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
