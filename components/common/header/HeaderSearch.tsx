"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useSetModal from "@/libs/utils/hooks/useSetModal";
import { MODAL_TYPE } from "@/libs/types/modalType";

const HeaderSearch = () => {
  const { setModal } = useSetModal();
  return (
    <div
      className="flex-1 flex items-center justify-center w-full gap-2 group cursor-pointer"
      onClick={() => setModal(MODAL_TYPE.SEARCH)}
    >
      <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 group-hover:text-primary" />
      <div
        className={`w-full pl-2 pr-2 py-1 text-xs text-gray-300 bg-white rounded border border-gray-300 cursor-pointer outline-none group-hover:bg-gray-100 group-hover:border-none group-hover:ring-1 group-hover:ring-primary group-hover:ring-opacity-50 md:hidden`}
      >
        <p className={`whitespace-nowrap`}>click to search</p>
      </div>
    </div>
  );
};

export default HeaderSearch;
