import { cx } from "@/lib/utils";

export const StickerCard = ({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
}) => (
  <div className="relative">
    <a
      className={cx(
        "relative z-10 mt-0 block h-full w-full overflow-hidden hover:cursor-pointer",
        "duration-[180ms] transition-all ease-in-out",
        "before:z-3 before:duration-[180ms] after:z-2 after:shadow-xs after:duration-[180ms] rounded-lg rounded-tr-[26px] bg-white px-4 pb-[18px] pt-5 shadow-[inset_0_0_0_1px] shadow-gray-200 before:absolute before:right-0 before:top-0 before:h-[30px] before:w-[30px] before:-translate-y-1/2 before:translate-x-1/2 before:rotate-45 before:bg-gray-50 before:shadow-[0_1px_0_0_] before:shadow-gray-200 before:transition-all before:ease-in-out before:content-[''] after:absolute after:right-0 after:top-0 after:size-7 after:-translate-y-2 after:translate-x-2 after:rounded-bl-lg after:border after:bg-gray-50 after:transition-all after:ease-in-out after:content-[''] hover:rounded-tr-[45px] hover:before:h-[50px] hover:before:w-[50px] hover:after:h-[42px] hover:after:w-[42px] hover:after:shadow-lg hover:after:shadow-black/5",
      )}
    >
      <div>
        <div className="relative flex items-center gap-2">
          <div className="absolute -left-4 h-5 w-[3px] rounded-r-sm bg-cyan-500" />
          <Icon className="size-5 shrink-0 text-cyan-500" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-gray-600 sm:text-sm">{description}</p>
      </div>
    </a>
  </div>
);
