"use client";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function PaginationControl({
  page,
  totalPages,
  basePath,
  extraParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefForPage(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams ?? {})) {
      if (value) params.set(key, value);
    }
    if (p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Pagination
        page={page}
        count={totalPages}
        renderItem={(item) => (
          <PaginationItem component={Link} href={hrefForPage(item.page ?? 1)} {...item} />
        )}
      />
    </Box>
  );
}
