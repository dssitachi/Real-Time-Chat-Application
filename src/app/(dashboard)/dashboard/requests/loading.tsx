import { Skeleton } from "@/components/ui/skeleton";

function loading() {
    return (
        <section className="flex flex-col p-4">
            <section className="max-w-md">
                <h2 className="text-lg mb-2">Add a friend</h2>
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </section>
        </section>
    );
}

export default loading;
