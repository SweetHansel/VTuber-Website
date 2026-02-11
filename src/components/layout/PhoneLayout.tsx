import { UpdatesScreen } from "@/components/phone/UpdatesScreen";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useLayoutStore, PHONE } from "@/stores/layoutStore";

export function PhoneLayout() {
  const { focusState, setFocus } = useLayoutStore();
  return (
    <div
      className="absolute pointer-events-auto"
      style={{ width: PHONE.width, height: PHONE.height }}
      onClick={(e) => {
        if (focusState == "default") setFocus("left");
        e.stopPropagation();
      }}
    >
      <InteractiveMediaFromCMS
        showEmpty
        location="landing-left"
        className="absolute w-full aspect-1/2 top-0 object-contain absolute"
      />
      <div
        className="absolute top-[2%] left-[2%] h-[96%] w-[96%]"
        onClick={(e) => e.stopPropagation()}
      >
        <UpdatesScreen />
      </div>
    </div>
  );
}
