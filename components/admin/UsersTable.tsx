"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  _count: {
    orders: number
  }
}

interface UsersTableProps {
  users: User[]
  locale: string
}

export function UsersTable({ users, locale }: UsersTableProps) {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const router = useRouter()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setSelectedRole(user.role)
  }

  const handleRoleUpdate = async () => {
    if (!editingUser || !selectedRole) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      toast({
        title: t("success"),
        description: t("userRoleUpdated"),
      })

      setEditingUser(null)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("updateError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "MODERATOR":
        return "default"
      case "USER":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">{t("email")}</th>
              <th className="text-left p-4 font-semibold">{t("name")}</th>
              <th className="text-left p-4 font-semibold">{t("role")}</th>
              <th className="text-left p-4 font-semibold">{t("orders")}</th>
              <th className="text-left p-4 font-semibold">{t("createdAt")}</th>
              <th className="text-left p-4 font-semibold">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.name || "-"}</td>
                <td className="p-4">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">{user._count.orders}</td>
                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString(locale)}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
            <DialogDescription>
              {t("editUserDescription")}: {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">{t("role")}</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleRoleUpdate} disabled={isLoading}>
              {isLoading ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
