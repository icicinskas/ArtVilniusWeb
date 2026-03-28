import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentsTable } from "@/components/moderator/CommentsTable"

export default async function ModeratorCommentsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("moderator")

  // Gauname visus komentarus
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      artwork: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("comments")}</h1>
        <p className="text-gray-500 mt-2">{t("commentsDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allComments")}</CardTitle>
          <CardDescription>
            {t("totalCommentsCount")}: {comments.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommentsTable comments={comments} locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
