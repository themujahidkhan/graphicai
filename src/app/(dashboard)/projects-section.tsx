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

export const ProjectsSection = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this project.",
  );
  const duplicateMutation = useDuplicateProject();
  const removeMutation = useDeleteProject();
  const router = useRouter();

  const onCopy = (id: string) => {
    // @ts-ignore
    duplicateMutation.mutate({ id });
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      // @ts-ignore
      removeMutation.mutate({ id });
    }
  };

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetProjects();

  // @ts-ignore
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

  if (
    !data.pages.length ||
    // @ts-ignore
    !data.pages[0].data.length
  ) {
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
      <Table>
        <TableBody>
          {data.pages.map((group, i) => (
            <React.Fragment key={uuidv4()}>
              {/* @ts-ignore */}
              {group.data.map((project) => (

                <TableRow key={uuidv4()}>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="font-medium flex items-center gap-x-2 cursor-pointer"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
  {project.thumbnailUrl ? (
    <Image
      src={project.thumbnailUrl}
      alt={project.name}
      width={64}
      height={64}
      className="object-cover"
    />
  ) : project.templateThumbnailUrl ? (
    <Image
      src={project.templateThumbnailUrl}
      alt={project.name}
      width={64}
      height={64}
      className="object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <FileIcon className="size-6 text-gray-400" />
    </div>
  )}
</div>
                    <div>
                      <p>{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.width} x {project.height} px
                      </p>
                    </div>
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="hidden md:table-cell cursor-pointer"
                  >
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled={false}
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={duplicateMutation.isPending}
                          onClick={() => onCopy(project.id)}
                        >
                          <CopyIcon className="size-4 mr-2" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={removeMutation.isPending}
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
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