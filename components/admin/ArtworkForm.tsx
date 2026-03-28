"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FormProvider } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, Link } from "@/lib/routing"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageCropModal, type CropMetadata } from "@/components/admin/ImageCropModal"

const artworkSchema = z.object({
  title: z.string().min(1, "Pavadinimas yra privalomas"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Paveikslėlis yra privalomas"),
  price: z.union([z.string(), z.number()]).optional(),
  category: z.string().min(1, "Kategorija yra privaloma"),
  technique: z.string().optional(),
  dimensions: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  isForSale: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  exhibitionId: z.string().optional(),
  collectionId: z.string().optional(),
  showInShop: z.boolean().optional(),
})

type ArtworkFormData = z.infer<typeof artworkSchema>

const CATEGORIES = [
  "Paveikslas",
  "Skulptūra",
  "Fotografija",
  "Grafika",
  "Tapyba",
  "Kolekcija",
  "Kitas",
]

interface ArtworkFormProps {
  locale?: string
}

export function ArtworkForm({ locale }: ArtworkFormProps) {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [pendingCropFile, setPendingCropFile] = useState<{
    file: File
    objectUrl: string
  } | null>(null)
  const [imageMetadata, setImageMetadata] = useState<CropMetadata | null>(null)
  const [exhibitions, setExhibitions] = useState<{ id: string; title: string }[]>([])
  const [collections, setCollections] = useState<{ id: string; title: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/exhibitions").then((r) => r.json()),
      fetch("/api/collections").then((r) => r.json()),
    ]).then(([exh, coll]) => {
      setExhibitions(Array.isArray(exh) ? exh.map((e: { id: string; title: string }) => ({ id: e.id, title: e.title })) : [])
      setCollections(Array.isArray(coll) ? coll.map((c: { id: string; title: string }) => ({ id: c.id, title: c.title })) : [])
    })
  }, [])

  const form = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      price: "",
      category: "",
      technique: "",
      dimensions: "",
      year: "",
      isForSale: false,
      isPublished: false,
      exhibitionId: "",
      collectionId: "",
      showInShop: false,
    },
  })

  const imageUrl = form.watch("imageUrl")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPendingCropFile({ file, objectUrl })
    setCropModalOpen(true)
    e.target.value = ""
  }

  const handleCropComplete = async (blob: Blob, metadata: CropMetadata) => {
    if (!pendingCropFile) return

    setIsUploading(true)
    try {
      const extension = pendingCropFile.file.name.split(".").pop() || "jpg"
      const croppedFile = new File([blob], `cropped-${Date.now()}.${extension}`, {
        type: blob.type,
      })

      const formData = new FormData()
      formData.append("file", croppedFile)

      const response = await fetch("/api/admin/artworks/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Įkelti nepavyko")
      }

      form.setValue("imageUrl", data.url)
      setImageMetadata(metadata)
      toast({
        title: t("success"),
        description: t("imageUploaded"),
      })
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error instanceof Error ? error.message : t("uploadError"),
      })
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(pendingCropFile.objectUrl)
      setPendingCropFile(null)
      setCropModalOpen(false)
    }
  }

  const handleCropCancel = () => {
    if (pendingCropFile) {
      URL.revokeObjectURL(pendingCropFile.objectUrl)
      setPendingCropFile(null)
    }
    setCropModalOpen(false)
  }

  const removeImage = () => {
    form.setValue("imageUrl", "")
    setImageMetadata(null)
  }

  async function onSubmit(data: ArtworkFormData) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || null,
          imageUrl: data.imageUrl,
          imageMetadata: imageMetadata ?? undefined,
          price: data.price ? Number(data.price) : null,
          category: data.category,
          technique: data.technique || null,
          dimensions: data.dimensions || null,
          year: data.year ? Number(data.year) : null,
          isForSale: data.isForSale ?? false,
          isPublished: data.isPublished ?? false,
          exhibitionId: data.exhibitionId && data.exhibitionId !== "none" ? data.exhibitionId : null,
          collectionId: data.collectionId && data.collectionId !== "none" ? data.collectionId : null,
          showInShop: data.showInShop ?? false,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Kūrinio sukurti nepavyko")
      }

      toast({
        title: t("success"),
        description: t("artworkCreated"),
      })

      router.push("/admin/artworks")
      router.refresh()
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error instanceof Error ? error.message : t("createError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...form}>
      {pendingCropFile && (
        <ImageCropModal
          imageSrc={pendingCropFile.objectUrl}
          isOpen={cropModalOpen}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          mimeType={pendingCropFile.file.type}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("image")}</FormLabel>
              <div className="space-y-4">
                {field.value ? (
                  <div className="relative inline-block">
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      {/* object-contain: rodo visa paveiksla, skirtingi matmenys italpina i langeli */}
                      <img
                        src={field.value}
                        alt="Peržiūra"
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex flex-col items-center justify-center w-48 h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors",
                      isUploading && "pointer-events-none opacity-70"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground text-center px-2">
                          {t("uploadImage")}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t("or")}</span>
                  <FormControl>
                    <Input
                      placeholder={t("imageUrlPlaceholder")}
                      {...field}
                      className="max-w-md"
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("descriptionPlaceholder")}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("categoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("price")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("priceOptional")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="technique"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("technique")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("techniquePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dimensions")}</FormLabel>
                <FormControl>
                  <Input placeholder="pvz. 100x80 cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>{t("year")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1000"
                  max="2100"
                  placeholder="2024"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="isForSale"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{t("forSale")}</FormLabel>
                  <FormDescription>{t("forSaleDescription")}</FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{t("published")}</FormLabel>
                  <FormDescription>{t("publishedDescription")}</FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exhibitionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("exhibition")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("exhibitionPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t("noExhibition")}</SelectItem>
                    {exhibitions.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>
                        {ex.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t("exhibitionDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("collection")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("collectionPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t("noCollection")}</SelectItem>
                    {collections.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t("collectionDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showInShop"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{t("showInShop")}</FormLabel>
                  <FormDescription>{t("showInShopDescription")}</FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
          <Link href="/admin/artworks">
            <Button type="button" variant="outline">
              {t("cancel")}
            </Button>
          </Link>
        </div>
      </form>
    </FormProvider>
  )
}
