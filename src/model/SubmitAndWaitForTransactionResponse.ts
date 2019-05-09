// Copyright (c) 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {Transaction} from "./Transaction";

export interface SubmitAndWaitForTransactionResponse {
    transaction: Transaction
}