"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, User, Box, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { is3DModelType } from "@/constants/models";
import { PeopleDisplay } from "@/components/people";
import { RichTextRenderer } from "@/components/richtext/RichTextRenderer";
import { getMedia, getTag, type Tag } from "@/hooks/useCMS";
import type { Credit } from "@/lib/people";
import type { Model } from "@/payload-types";

interface ModelModalProps {
  data: Model;
}

export function ModelModalContent({
  data,
}: Readonly<ModelModalProps>) {
  const [currentRefIndex, setCurrentRefIndex] = useState(0);

  const showcase = data.showcase ?? [];
  const modelFile = getMedia(data.modelFile);
  const description = data.description as { root: { children: unknown[] } } | null | undefined;

  const tags = (data.tags ?? []).map(getTag).filter((t): t is Tag => !!t);

  // Get first showcase image as thumbnail
  const firstShowcase = showcase[0];
  const firstShowcaseMedia = firstShowcase ? getMedia(firstShowcase.media) : undefined;
  const thumbnail = firstShowcaseMedia?.url || "/placeholder-model.png";

  const is3D = is3DModelType(data.modelType);

  const credits: Credit[] = (data.credits ?? []).map((c) => ({
    role: c.role || 'Unknown',
    artist: c.artist as Credit['artist'],
    name: c.name ?? undefined,
    id: c.id ?? undefined,
  }));

  const validRefSheets = (data.refSheets ?? [])
    .map(rs => ({ ...rs, mediaObj: getMedia(rs.media) }))
    .filter(rs => rs.mediaObj?.url);

  return (
    <div className="flex gap-6">
      {/* Thumbnail */}
      <div className="relative h-64 w-48 shrink-0 overflow-hidden rounded-xl">
        <Image src={thumbnail} alt={data.name} fill className="object-cover" />
        {data.isActive && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
            Active
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Type badge */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase",
              is3D
                ? "bg-purple-500/20 text-purple-300"
                : "bg-blue-500/20 text-blue-300",
            )}
          >
            {is3D ? <Box className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {data.modelType}
          </span>
        </div>

        {/* Name & Version */}
        <h2 className="mb-1 text-2xl font-bold text-(--modal-text)">{data.name}</h2>
        {data.version && (
          <p className="mb-3 text-(--modal-text)/60">Version {data.version}</p>
        )}

        {/* Debut date */}
        {data.debutDate && (
          <p className="mb-4 flex items-center gap-1.5 text-sm text-(--modal-text)/40">
            <Calendar className="h-4 w-4" />
            Debut:{" "}
            {formatDate(data.debutDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {/* Description */}
        {description && (
          <div className="mb-4">
            <RichTextRenderer content={description} className="text-sm" />
          </div>
        )}

        {/* Technical specs (for 3D models) */}
        {data.technicalSpecs && is3D && (
          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            {!!data.technicalSpecs.polyCount && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Polygons</p>
                <p className="font-medium text-(--modal-text)">
                  {Number(data.technicalSpecs.polyCount).toLocaleString()}
                </p>
              </div>
            )}
            {!!data.technicalSpecs.blendshapes && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Blendshapes</p>
                <p className="font-medium text-(--modal-text)">
                  {String(data.technicalSpecs.blendshapes)}
                </p>
              </div>
            )}
            {!!data.technicalSpecs.boneCount && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Bones</p>
                <p className="font-medium text-(--modal-text)">
                  {String(data.technicalSpecs.boneCount)}
                </p>
              </div>
            )}
            {!!data.technicalSpecs.textureResolution && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Texture</p>
                <p className="font-medium text-(--modal-text)">
                  {String(data.technicalSpecs.textureResolution)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Model File Download */}
        {data.includeModelFile && modelFile?.url && (
          <div className="mb-4">
            <a
              href={modelFile.url}
              download
              className="inline-flex items-center gap-2 rounded-full bg-(--modal-primary)/20 px-4 py-2 text-sm font-medium text-(--modal-primary) transition-colors hover:bg-(--modal-primary)/30"
            >
              <Download className="h-4 w-4" />
              Download Model
              {modelFile.filename && (
                <span className="text-(--modal-text)/40">({modelFile.filename})</span>
              )}
            </a>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : 'var(--modal-surface)',
                    color: tag.color || 'var(--modal-text)',
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ref Sheets Gallery */}
        {validRefSheets.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-(--modal-text)/40">Reference Sheets</p>
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-(--modal-surface)/5">
                <Image
                  src={validRefSheets[currentRefIndex].mediaObj!.url!}
                  alt={validRefSheets[currentRefIndex].label || `Ref sheet ${currentRefIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              {validRefSheets[currentRefIndex].label && (
                <p className="mt-1 text-center text-xs text-(--modal-text)/60">
                  {validRefSheets[currentRefIndex].label}
                </p>
              )}
              {validRefSheets.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentRefIndex((i) => (i === 0 ? validRefSheets.length - 1 : i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentRefIndex((i) => (i === validRefSheets.length - 1 ? 0 : i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    {validRefSheets.map((_, idx) => (
                      <button
                        key={"refsheet_"+idx}
                        onClick={() => setCurrentRefIndex(idx)}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          idx === currentRefIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Credits */}
        {credits.length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-(--modal-text)/40">Credits</p>
            <PeopleDisplay credits={credits} />
          </div>
        )}
      </div>
    </div>
  );
}
