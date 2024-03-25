"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MdOutlineSearch } from "react-icons/md";
import queryString from "query-string";


const Search = () => {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = {
      key: text,
    };

    const url = queryString.stringifyUrl(
      {
        url: "/search",
        query,
      },
      {
        skipNull: true,
      }
    );

    router.push(url);
    setText("");
  };

  return (
    <form
      className="flex flex-row border-[1px] border-neutral-700 rounded-full overflow-hidden w-2/5 "
      onSubmit={handleSearch}
    >
      <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button type="submit" className="px-3 bg-white border-none">
        <MdOutlineSearch className="h-6 w-6" />
      </button>
    </form>
  );
};

export default Search;
