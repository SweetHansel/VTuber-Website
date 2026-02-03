"use client";

import Image from "next/image";
import { Calendar, User, Box } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { is3DModelType } from "@/constants/models";

interface ModelModalProps {
  data: Record<string, unknown>;
}

export function ModelModalContent({
  data,
}: Readonly<ModelModalProps>) {
  const name = String(data.name || "Unknown Model");
  const version = data.version ? String(data.version) : undefined;
  const modelType = String(data.modelType || "live2d");
  const isActive = Boolean(data.isActive);
  const debutDate = data.debutDate ? String(data.debutDate) : undefined;
  const showcase = Array.isArray(data.showcase) ? data.showcase : [];
  const credits = Array.isArray(data.credits) ? data.credits : [];
  const technicalSpecs = data.technicalSpecs as
    | Record<string, unknown>
    | undefined;

  // Get first showcase image as thumbnail
  const thumbnail = showcase[0]?.media?.url || "/placeholder-model.png";

  // Determine if 2D or 3D
  const is3D = is3DModelType(modelType);

  return (
    <div className="flex gap-6">
      {/* Thumbnail */}
      <div className="relative h-64 w-48 shrink-0 overflow-hidden rounded-xl">
        <Image src={thumbnail} alt={name} fill className="object-cover" />
        {isActive && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
            Active
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
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
            {modelType}
          </span>
        </div>

        {/* Name & Version */}
        <h2 className="mb-1 text-2xl font-bold text-(--modal-text)">{name}</h2>
        {version && (
          <p className="mb-3 text-(--modal-text)/60">Version {version}</p>
        )}

        {/* Debut date */}
        {debutDate && (
          <p className="mb-4 flex items-center gap-1.5 text-sm text-(--modal-text)/40">
            <Calendar className="h-4 w-4" />
            Debut:{" "}
            {formatDate(debutDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {/* Technical specs (for 3D models) */}
        {technicalSpecs && is3D && (
          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            {!!technicalSpecs.polyCount && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Polygons</p>
                <p className="font-medium text-(--modal-text)">
                  {Number(technicalSpecs.polyCount).toLocaleString()}
                </p>
              </div>
            )}
            {!!technicalSpecs.blendshapes && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Blendshapes</p>
                <p className="font-medium text-(--modal-text)">
                  {String(technicalSpecs.blendshapes)}
                </p>
              </div>
            )}
            {!!technicalSpecs.boneCount && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Bones</p>
                <p className="font-medium text-(--modal-text)">
                  {String(technicalSpecs.boneCount)}
                </p>
              </div>
            )}
            {!!technicalSpecs.textureResolution && (
              <div className="rounded-lg bg-(--modal-surface)/5 px-3 py-2">
                <p className="text-(--modal-text)/40">Texture</p>
                <p className="font-medium text-(--modal-text)">
                  {String(technicalSpecs.textureResolution)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Credits */}
        {credits.length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-(--modal-text)/40">Credits</p>
            <div className="flex flex-wrap gap-2">
              {credits.map(
                (
                  credit: {
                    role?: string;
                    artist?: { name?: string };
                    name?: string;
                  },
                  index: number,
                ) => (
                  <div
                    key={index}
                    className="rounded-full bg-(--modal-surface)/10 px-3 py-1.5 text-sm"
                  >
                    <span className="text-(--modal-text)/50">
                      {credit.role}:{" "}
                    </span>
                    <span className="text-(--modal-text)">
                      {credit.artist?.name || credit.name || "Unknown"}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
