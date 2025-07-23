import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Users,
  Image as ImageIcon,
  ArrowRight
} from "lucide-react";

export default function ServerCard({
  server,
  statusLoading = false,
}: {
  server: { id: string; name: string; image: string; playerCount?: number; isOnline?: boolean };
  statusLoading?: boolean;
}) {
  const router = useRouter();

  if (!server || !server.id || !server.name) {
    return null;
  }

  const handleClick = () => {
    router.push(`/store/server/${server.id}`);
  };

  return (
    <Card 
      onClick={handleClick}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <CardContent className="p-0">
        {/* Header with Status Badge */}
        <div className="relative">
          {/* Server Image */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900 dark:to-cyan-900 overflow-hidden">
            {server.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${server.image}`}
                alt={server.name}
                width={500}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 h-full">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">Resim Yok</span>
              </div>
            )}
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 via-transparent to-purple-200 dark:from-blue-900 dark:to-purple-900 group-hover:rotate-1 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
              {server.name}
            </h3>
            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300 ml-2" />
          </div>
          
          {/* Animated underline */}
          <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 dark:from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-700/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
