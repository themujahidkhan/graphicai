"use client";

import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

type Project = {
  id: string;
  name: string;
  width: number;
  height: number;
  updatedAt: string;
  thumbnailUrl?: string;
  templateThumbnailUrl?: string;
};

type ProjectsData = {
  pages: Array<{ data: Project[] }>;
};

export const ProjectsSection = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this project.",
  );
  const duplicateMutation = useDuplicateProject();
  const removeMutation = useDeleteProject();
  const router = useRouter();

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetProjects();

  const onCopy = (project: Project) => {
    duplicateMutation.mutate({ id: project.id, name: `Copy of ${project.name}` });
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      removeMutation.mutate({ id });
    }
  };

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    )
  }

  if (!data || data.pages.length === 0 || data.pages[0].data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No projects found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <h3 className="font-semibold text-lg">
        Recent projects
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.pages.map((group) => (
          <React.Fragment key={uuidv4()}>
            {group.data.map((project: Project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative"
                onClick={() => router.push(`/editor/${project.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/editor/${project.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative aspect-video bg-gray-200">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : project.templateThumbnailUrl ? (
                    <Image
                      src={project.templateThumbnailUrl}
                      alt={project.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FileIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {project.width} x {project.height} px
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white bg-opacity-50 hover:bg-opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom" className="w-60">
                      <DropdownMenuItem
                        className="h-10 cursor-pointer"
                        disabled={duplicateMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopy(project);
                        }}
                      >
                        <CopyIcon className="size-4 mr-2" />
                        Make a copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10 cursor-pointer"
                        disabled={removeMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(project.id);
                        }}
                      >
                        <Trash className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};