import { Skeleton } from "@/components/ui/skeleton";

function loading() {
    return (
        <section className="w-full flex flex-col h-full">
            <div className="flex p-4 items-center gap-2 border-b">
                <div className="relative h-8 w-8">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="flex-grow overflow-y-scroll">
                <div className="h-full flex flex-col-reverse overflow-y-scroll px-4 gap-2">
                    <div className="w-full flex justify-end">
                        <Skeleton className="flex h-8 w-[250px]" />
                    </div>
                    <Skeleton className="flex h-8 w-[200px]" />
                    <Skeleton className="flex h-8 w-[240px]" />
                    <div className="w-full flex justify-end">
                        <Skeleton className="flex h-8 w-[200px]" />
                    </div>
                    <Skeleton className="flex h-8 w-[200px]" />
                </div>
            </div>

            <div className="p-4 flex items-center gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-20" />
            </div>
        </section>
    );
}

export default loading;
