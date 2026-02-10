import { cn } from "@/lib/utils";
import { UpdatesScreen } from "@/components/phone/UpdatesScreen";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useLayoutStore } from "@/stores/layoutStore";
import { AspectLock } from "./AspectLock";

export function PhoneLayout() {
  const { focusState, setFocus } = useLayoutStore();
  return (
    <AspectLock aspectRatio={2/3} className="absolute">
      <div
        className="h-full w-full absolute pointer-events-auto"
        onClick={(e) => {
          if (focusState == "default") setFocus("left");
          e.stopPropagation();
        }}
      >
        <InteractiveMediaFromCMS
          showEmpty
          location="landing-left"
          className="h-[133%] w-full top-0 object-contain absolute"
        />
        <div
          className="absolute top-[2%] left-[2%] h-[96%] w-[96%]"
          onClick={(e) => e.stopPropagation()}
        >
          <UpdatesScreen />
        </div>
      </div>
    </AspectLock>
  );
}
