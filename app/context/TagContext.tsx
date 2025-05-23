"use client";

import { createContext, useContext } from "react";
import { Tag } from "@/types/tag";

type TagContextType = {
  tags: Tag[];
};

export const TagContext = createContext<TagContextType>({ tags: [] });

export const useTags = () => useContext(TagContext);
