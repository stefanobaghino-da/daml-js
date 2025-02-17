// Copyright (c) 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import * as jsc from 'jsverify';
import {SubmitAndWaitForTransactionIdResponse} from "../../src/model/SubmitAndWaitForTransactionIdResponse";

export const ArbitrarySubmitAndWaitForTransactionIdResponse: jsc.Arbitrary<SubmitAndWaitForTransactionIdResponse> =
    jsc.record({
        transactionId: jsc.string
    });
