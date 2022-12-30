// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import z from "zod";
import type {
  categoryDataValidator,
  categoryMetaValidator,
  flagDataValidator,
  flagMetaValidator,
  sizeValidator,
} from "./server/validation";

export type FlagMeta = z.infer<typeof flagMetaValidator>;

export type FlagData = z.infer<typeof flagDataValidator>;

export type CategoryMeta = z.infer<typeof categoryMetaValidator>;

export type CategoryData = z.infer<typeof categoryDataValidator>;

export type Size = z.infer<typeof sizeValidator>;
