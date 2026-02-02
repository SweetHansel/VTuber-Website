import { cn } from "@/lib/utils";
import { UpdatesPage } from "../pages/UpdatesPage";
import { AspectLock } from "./AspectLock";
import { InteractiveMediaFromCMS } from "./InteractiveMediaFromCMS";
import { useLayoutStore } from "@/stores/layoutStore";

export function PhoneLayout() {
  const { focusState, setFocus } = useLayoutStore();
  return (
    <AspectLock
      aspectRatio={1 / 2}
      anchorX="right"
      anchorY="bottom"
      className="absolute perspective-1000"
    >
      <div
        className={cn(
          "h-full w-full overflow-hidden z-10",
          focusState == "default" && "rotate-x-11 rotate-z-5",
        )}
        onClick={(e) => {
          if (focusState == "default") setFocus("left");
          e.stopPropagation();
        }}
      >
        <InteractiveMediaFromCMS
          showEmpty
          location="landing-left"
          className="h-full w-full object-contain absolute bottom-0"
        />
        <div
          className="absolute top-[2%] left-[2%] h-[75%] w-[96%]"
          onClick={(e) => e.stopPropagation()}
        >
          <UpdatesPage />
        </div>
      </div>
    </AspectLock>
  );
}
