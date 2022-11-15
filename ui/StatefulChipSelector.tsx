"use client";

import { FC, useState } from "react";
import { ChipSelector } from "./ChipSelector";

export const StatefulChipSelector: FC<{ options: string[] }> = ({
  options,
}) => {
  const [selected, setSelected] = useState(options[0]);
  return (
    <ChipSelector
      options={options}
      selected={selected}
      onSelect={setSelected}
    />
  );
};
