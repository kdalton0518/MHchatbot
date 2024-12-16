import { Skeleton } from "../ui/skeleton";

export default function ChatLoading() {
  return (
    <div>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="max-w-[700px] h-[40px] rounded-md" />
          <Skeleton className="w-[70%] h-[20px] rounded-md" />
          <Skeleton className="w-[30%] h-[20px] rounded-md" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="max-w-[700px] h-[40px] rounded-md" />
          <Skeleton className="w-[82%] h-[20px] rounded-md" />
          <Skeleton className="w-[45%] h-[20px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
