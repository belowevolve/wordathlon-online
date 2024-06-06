import Image from "next/image";

const Logo = () => {
  return (
    <a
      href="https://github.com/belowevolve"
      className="relative inline-block w-[10.25rem]  font-annie text-5xl "
    >
      below{" "}
      <span className="absolute -top-[0.7rem] left-[4.6rem] rotate-[16deg]">
        evolve
      </span>
      <Image
        className="absolute -top-[0.4rem] left-[0.6rem]"
        width={45}
        height={10}
        alt="Dino"
        src={"/dino.svg"}
      />
      <Image
        className="absolute bottom-[0.5rem] left-[5.2rem]"
        alt="Monkey"
        width={34}
        height={25}
        src={"/monkey.svg"}
      />
    </a>
  );
};

export default Logo;
