import { GalleryVerticalEnd } from "lucide-react"
import { LoginPreview } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container flex flex-col items-center justify-center min-h-screen py-12 mx-auto">
        <a href="/" className="flex items-center gap-3 mb-8 text-2xl font-semibold transition-colors">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex h-10 w-10 items-center justify-center rounded-xl shadow-md">
            <GalleryVerticalEnd className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Empowering Young Minds
          </span>
        </a>
        <LoginPreview />
      </div>
    </div>
  )
}
