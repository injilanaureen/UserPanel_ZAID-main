// import Link from "next/link"
import { Link } from "@inertiajs/react"
import { ChevronRight, LogOut } from "lucide-react"

export default function ProfileSidebar() {
  return (
    <div className="w-[340px] bg-white shadow-md flex flex-col">
      <div className="bg-indigo-600 text-white py-16 flex flex-col items-center">
        <h2 className="text-xl font-medium">Zaid Maalik</h2>
        <p className="text-sm mt-1">Api Partner</p>
        <div className="border-t w-16 my-6 opacity-30"></div>
        <div className="flex justify-between w-24">
          <div className="h-6 border-l opacity-30"></div>
          <div className="h-6 border-l opacity-30"></div>
        </div>
        <div className="border-t w-16 mt-6 opacity-30"></div>
      </div>

      <div className="p-4 text-gray-500 uppercase text-xs font-medium">Navigation</div>

      <nav className="flex-1">
        <Link href="#" className="flex items-center px-4 py-3 bg-blue-500 text-white">
          <ChevronRight className="h-5 w-5 mr-2" />
          <span>Profile Details</span>
        </Link>

        <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 mr-2" />
          <span>Kyc Details</span>
        </Link>

        <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 mr-2" />
          <span>Pin Manager</span>
        </Link>
      </nav>

      <div className="p-4 border-t">
        <Link href="#" className="flex items-center text-gray-700">
          <LogOut className="h-5 w-5 mr-2 text-blue-500" />
          <span>Log out</span>
        </Link>
      </div>
    </div>
  )
}

